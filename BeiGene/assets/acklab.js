/* Reusable RabbitMQ acknowledgement lab: a queue, one consumer, and every button the protocol gives you.
 *
 * Usage in a lesson:
 *   <div class="acklab" data-acklab='{
 *     "label": "...",
 *     "prefetch": 1,
 *     "ackTimeoutMin": 30,
 *     "dlx": true,
 *     "messages": ["订单 1001 已支付", "订单 1002 已支付", "订单 1003 已支付"],
 *     "scenarios": [ {"title":"...","steps":["...","..."],"guess":"..."} ]
 *   }'></div>
 *   <script src="../assets/acklab.js"></script>
 *
 * Design notes:
 *  - Three boxes: 队列 (Ready), 消费者手里 (Unacked / in flight), 死信 (DLX). The broker only tracks
 *    a delivery while it is in the Unacked box; in automatic-ack mode the broker forgets the message
 *    the moment it is sent, which is the whole lesson.
 *  - Each message carries a "已写库 ×n" counter so duplicate processing is visible, and a
 *    "redelivered" badge that RabbitMQ would set on requeue.
 *  - "消费者崩溃" closes the channel: manual mode requeues everything unacked; auto mode loses
 *    whatever was in hand. "时钟 +31 min" triggers the delivery acknowledgement timeout.
 *  - Nothing is automated; the scenario list only tells the learner what to click.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var data;
    try { data = JSON.parse(root.getAttribute('data-acklab')); }
    catch (e) { root.textContent = 'Acklab data malformed: ' + e.message; return; }

    var prefetch = data.prefetch || 1;
    var ackTimeout = data.ackTimeoutMin || 30;
    var hasDlx = data.dlx !== false;
    var mode = 'manual';
    var now = 0, tag = 0, lost = 0, seq = 0;
    var ready = [], unacked = [], dlx = [], inHandAuto = null;
    var log = [];

    function mk(body) { seq++; return { id: 'm' + seq, body: body, redelivered: false, processed: 0, tag: 0, at: 0 }; }
    function reset() {
      now = 0; tag = 0; lost = 0; seq = 0; ready = []; unacked = []; dlx = []; inHandAuto = null; log = [];
      (data.messages || []).forEach(function (b) { ready.push(mk(b)); });
      say('重置。队列里 ' + ready.length + ' 条，消费者空手。', '');
    }
    function say(text, tone) { log.unshift({ t: now, text: text, tone: tone || '' }); if (log.length > 12) log.pop(); }
    function inHand() { return mode === 'manual' ? unacked[unacked.length - 1] || null : inHandAuto; }

    // ---- actions -------------------------------------------------------------
    function deliver() {
      if (!ready.length) { say('队列为空，没有可投递的消息。', 'bad'); return render(); }
      if (mode === 'manual' && unacked.length >= prefetch) {
        say('prefetch = ' + prefetch + '：手里还有 ' + unacked.length + ' 条未 ACK，broker 不再投递。先 ACK / NACK。', 'bad'); return render();
      }
      if (mode === 'auto' && inHandAuto) { say('上一条还没处理完。先点「处理完成」。', 'bad'); return render(); }
      var m = ready.shift(); tag++; m.tag = tag; m.at = now;
      if (mode === 'manual') { unacked.push(m); say('basic.deliver ' + m.id + '（deliveryTag=' + tag + (m.redelivered ? '，redelivered=true' : '') + '）。broker 记为 Unacked。', ''); }
      else { inHandAuto = m; say('basic.deliver ' + m.id + '，自动 ACK 模式：<strong>broker 发出即视为已投递，已从队列删除</strong>。', 'warn'); }
      render();
    }
    function process() {
      var m = inHand();
      if (!m) { say('手里没有消息。先点「投递下一条」。', 'bad'); return render(); }
      m.processed++;
      say('业务处理 ' + m.id + '：写库成功。已写库 ×' + m.processed + (m.processed > 1 ? ' —— <strong>同一条消息被处理了两次</strong>' : '') + '。', m.processed > 1 ? 'warn' : 'good');
      if (mode === 'auto') inHandAuto = null;
      render();
    }
    function ack() {
      if (mode === 'auto') { say('自动 ACK 模式下没有 ACK 可发——broker 早就删了。', 'bad'); return render(); }
      var m = inHand();
      if (!m) { say('没有未确认的投递可以 ACK。', 'bad'); return render(); }
      unacked.pop();
      say('basic.ack deliveryTag=' + m.tag + '。broker 删除 ' + m.id + '。' + (m.processed === 0 ? '<strong>注意：你还没处理它就 ACK 了——处理时若崩溃，这条就丢了。</strong>' : ''), m.processed === 0 ? 'warn' : 'good');
      render();
    }
    function nack(requeue) {
      if (mode === 'auto') { say('自动 ACK 模式下无法 NACK。', 'bad'); return render(); }
      var m = inHand();
      if (!m) { say('没有未确认的投递可以 NACK。', 'bad'); return render(); }
      unacked.pop();
      if (requeue) { m.redelivered = true; ready.unshift(m); say('basic.nack requeue=true。' + m.id + ' 回到队列<strong>头部</strong>，redelivered=true。若处理必然失败，这会无限循环。', 'warn'); }
      else if (hasDlx) { dlx.push(m); say('basic.nack requeue=false。' + m.id + ' 进入死信交换机（DLX）→ 死信队列，等人工处理。', ''); }
      else { lost++; say('basic.nack requeue=false，且队列没配 DLX：' + m.id + ' <strong>被直接丢弃</strong>。', 'bad'); }
      render();
    }
    function crash() {
      if (mode === 'manual') {
        if (!unacked.length) { say('消费者崩溃，channel 关闭。手里没有未 ACK 的投递，无事发生。重连。', ''); return render(); }
        var n = unacked.length;
        while (unacked.length) { var m = unacked.pop(); m.redelivered = true; ready.unshift(m); }
        say('消费者崩溃，channel 关闭。broker 把 ' + n + ' 条 Unacked 自动放回队列，redelivered=true。<strong>处理过但没 ACK 的，会再来一次。</strong>重连。', 'warn');
      } else {
        if (inHandAuto) { lost++; say('消费者崩溃。' + inHandAuto.id + ' 在手里、broker 已删除 —— <strong>永久丢失</strong>。重连。', 'bad'); inHandAuto = null; }
        else say('消费者崩溃，手里没消息，无事发生。重连。', '');
      }
      render();
    }
    function tick() {
      now += ackTimeout + 1;
      var stale = unacked.filter(function (m) { return now - m.at > ackTimeout; });
      if (mode === 'manual' && stale.length) {
        stale.forEach(function (m) { unacked.splice(unacked.indexOf(m), 1); m.redelivered = true; ready.unshift(m); });
        say('T+' + now + 'min：' + stale.length + ' 条投递超过 ' + ackTimeout + ' 分钟未 ACK。broker 以 PRECONDITION_FAILED 关闭 channel，消息回队列，redelivered=true。', 'warn');
      } else say('T+' + now + 'min：没有超时的未确认投递。', '');
      render();
    }

    // ---- render --------------------------------------------------------------
    var box = el('div', 'al-box');
    root.appendChild(box);

    function msgCard(m, where) {
      var c = el('div', 'al-msg' + (m.redelivered ? ' redelivered' : ''));
      c.innerHTML = '<span class="al-id">' + esc(m.id) + '</span> ' + esc(m.body)
        + (m.tag && where !== 'ready' ? ' <span class="al-tag">tag ' + m.tag + '</span>' : '')
        + (m.redelivered ? ' <span class="al-badge">redelivered</span>' : '')
        + (m.processed ? ' <span class="al-proc' + (m.processed > 1 ? ' dup' : '') + '">已写库 ×' + m.processed + '</span>' : '');
      return c;
    }
    function render() {
      box.innerHTML = '';
      var head = el('div', 'al-head');
      head.appendChild(el('span', 'label', esc(data.label || 'ACK 实验室')));
      head.appendChild(el('span', 'al-clock', 'T+' + now + 'min · prefetch ' + prefetch + ' · ack 超时 ' + ackTimeout + 'min'));
      box.appendChild(head);

      var modes = el('div', 'al-modes');
      ['manual', 'auto'].forEach(function (mo) {
        var b = el('button', 'al-mode' + (mode === mo ? ' on' : ''), mo === 'manual' ? '手动 ACK（autoAck: false）' : '自动 ACK（autoAck: true）');
        b.onclick = function () {
          if (mode === mo) return;
          if (unacked.length || inHandAuto) { say('手里还有消息，先处理完再切换模式。', 'bad'); return render(); }
          mode = mo; say('切换到' + (mo === 'manual' ? '手动' : '自动') + ' ACK 模式。', ''); render();
        };
        modes.appendChild(b);
      });
      box.appendChild(modes);

      var cols = el('div', 'al-cols');
      function col(title, items, where, empty) {
        var c = el('div', 'al-col');
        c.appendChild(el('h4', null, title + ' <span class="al-count">' + items.length + '</span>'));
        if (!items.length) c.appendChild(el('div', 'al-empty', empty));
        items.forEach(function (m) { c.appendChild(msgCard(m, where)); });
        return c;
      }
      cols.appendChild(col('队列 · Ready', ready, 'ready', '空'));
      var hand = mode === 'manual' ? unacked.slice() : (inHandAuto ? [inHandAuto] : []);
      cols.appendChild(col(mode === 'manual' ? '消费者手里 · Unacked（broker 记着）' : '消费者手里（broker 已遗忘）', hand, 'hand', '空手'));
      cols.appendChild(col('死信队列 · DLX', dlx, 'dlx', hasDlx ? '空' : '未配置'));
      box.appendChild(cols);

      var stats = el('div', 'al-stats', '永久丢失：<strong class="' + (lost ? 'bad' : '') + '">' + lost + '</strong> 条');
      box.appendChild(stats);

      var acts = el('div', 'al-actions');
      [['投递下一条', deliver], ['处理完成（写库）', process], ['ACK', ack],
       ['NACK · requeue', function () { nack(true); }], ['NACK · 不 requeue', function () { nack(false); }],
       ['消费者崩溃', crash], ['时钟 +' + (ackTimeout + 1) + ' min', tick], ['重置', function () { reset(); render(); }]]
        .forEach(function (a) { var b = el('button', 'al-btn', a[0]); b.onclick = a[1]; acts.appendChild(b); });
      box.appendChild(acts);

      var lg = el('div', 'al-log');
      log.forEach(function (l) { lg.appendChild(el('div', 'al-line ' + l.tone, '<span class="al-t">T+' + l.t + '</span> ' + l.text)); });
      box.appendChild(lg);

      if (data.scenarios && data.scenarios.length) {
        var sc = el('div', 'al-scenarios');
        data.scenarios.forEach(function (s) {
          var d = el('details', 'al-scn');
          d.appendChild(el('summary', null, esc(s.title)));
          var ol = el('ol');
          (s.steps || []).forEach(function (st) { ol.appendChild(el('li', null, st)); });
          d.appendChild(ol);
          if (s.guess) d.appendChild(el('p', 'al-guess', '先猜：' + s.guess));
          sc.appendChild(d);
        });
        box.appendChild(sc);
      }
    }
    reset(); render();
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('.acklab'), build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

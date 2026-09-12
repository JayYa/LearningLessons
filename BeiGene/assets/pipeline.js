/* Reusable middleware-pipeline simulator.
 *
 * Renders an ASP.NET Core style pipeline as nested boxes ("Russian doll"), lets the
 * learner pick what each middleware does on this request, then fires one request
 * and prints the exact in/out trace — including what happens to code *after*
 * `await next()` when an inner middleware short-circuits or throws.
 *
 * Usage in a lesson:
 *   <div class="pipeline" data-pipeline='{
 *     "label":"...",
 *     "middlewares":[
 *       {"id":"ex","name":"UseExceptionHandler","before":"try {","after":"} catch → 写 500",
 *        "catches":true,"modes":["next"]},
 *       {"id":"log","name":"Logging","before":"记开始时间","after":"打印耗时 + 状态码",
 *        "modes":["next","write-next"]},
 *       {"id":"auth","name":"Auth","before":"读 token","after":"—",
 *        "modes":["next","short","throw"], "shortStatus":401},
 *       {"id":"ep","name":"Endpoint","before":"执行 Controller.Action","after":"—",
 *        "terminal":true,"modes":["ok","throw"]}
 *     ]
 *   }'></div>
 *   <script src="../assets/pipeline.js"></script>
 *
 * Modes (per middleware, author whitelists which ones the learner may pick):
 *   next        普通：跑 before → await next() → 跑 after
 *   short       短路：写响应（shortStatus，默认 401）然后 return，不调 next
 *   throw       抛异常：before 之后 throw，不调 next
 *   write-next  先往响应体写字节，再调 next（演示 HasStarted 之后改状态码会炸）
 *   ok          终端：只有 terminal 中间件可用，执行并写 200
 *
 * Design notes:
 *  - The doll diagram and the fold expression `ex(log(auth(endpoint(404))))` are
 *    rendered from the same array, so the learner sees that order-of-registration
 *    *is* nesting depth. That is the one thing this widget exists to make obvious.
 *  - "after" code of outer middleware still runs on a short-circuit; on an
 *    exception it is skipped unless that middleware `catches`. Both are shown in
 *    the trace rather than described.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  var MODE_LABEL = {
    'next': '正常：调 next',
    'short': '短路：写响应后 return',
    'throw': '抛异常',
    'write-next': '先写响应体，再调 next',
    'ok': '正常执行，写 200'
  };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function build(root) {
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-pipeline')); }
    catch (e) { root.textContent = 'Pipeline data malformed: ' + e.message; return; }

    var mws = cfg.middlewares;
    var modes = {};
    mws.forEach(function (m) { modes[m.id] = (m.modes && m.modes[0]) || (m.terminal ? 'ok' : 'next'); });

    root.appendChild(el('div', 'pl-head', '<span class="label">' + (cfg.label || '管道模拟') + '</span>'));

    // Fold expression: app = ex(log(auth(endpoint(404))))
    var fold = el('pre', 'pl-fold');
    root.appendChild(fold);

    // Doll diagram + per-middleware mode selectors
    var doll = el('div', 'pl-doll');
    root.appendChild(doll);

    var controls = el('div', 'pl-controls',
      '<button type="button" class="pl-fire">发一个请求 ▸</button>' +
      '<button type="button" class="pl-reset">重来</button>');
    root.appendChild(controls);

    var trace = el('ol', 'pl-trace');
    root.appendChild(trace);

    var verdict = el('div', 'pl-verdict');
    root.appendChild(verdict);

    function paintFold() {
      var expr = '404';
      for (var i = mws.length - 1; i >= 0; i--) expr = mws[i].name + '(' + expr + ')';
      fold.innerHTML = '<span class="cm">// Build() 把注册顺序倒着折叠成一个函数</span>\napp = ' + expr + ';';
    }

    function paintDoll() {
      doll.innerHTML = '';
      var container = doll;
      mws.forEach(function (m, i) {
        var box = el('div', 'pl-box' + (m.terminal ? ' terminal' : ''));
        box.style.setProperty('--depth', String(i));
        var head = el('div', 'pl-box-head');
        head.appendChild(el('span', 'pl-idx', String(i + 1)));
        head.appendChild(el('span', 'pl-name', m.name));
        var allowed = m.modes || [m.terminal ? 'ok' : 'next'];
        if (allowed.length > 1) {
          var sel = document.createElement('select');
          sel.className = 'pl-mode';
          allowed.forEach(function (k) {
            var o = document.createElement('option');
            o.value = k; o.textContent = MODE_LABEL[k] || k;
            if (modes[m.id] === k) o.selected = true;
            sel.appendChild(o);
          });
          sel.addEventListener('change', function () { modes[m.id] = sel.value; clearTrace(); });
          head.appendChild(sel);
        } else {
          head.appendChild(el('span', 'pl-mode-fixed', MODE_LABEL[allowed[0]] || allowed[0]));
        }
        box.appendChild(head);
        box.appendChild(el('div', 'pl-before', '↓ ' + (m.before || '')));
        var inner = el('div', 'pl-inner');
        box.appendChild(inner);
        if (!m.terminal) box.appendChild(el('div', 'pl-after', '↑ ' + (m.after || '')));
        container.appendChild(box);
        container = inner;
      });
      container.appendChild(el('div', 'pl-404', '管道末端：没人处理 → 404'));
    }

    function clearTrace() { trace.innerHTML = ''; verdict.className = 'pl-verdict'; verdict.innerHTML = ''; }

    function line(depth, tone, text) {
      var li = el('li', 'pl-line' + (tone ? ' ' + tone : ''), text);
      li.style.paddingLeft = (depth * 1.2 + 0.6) + 'rem';
      trace.appendChild(li);
    }

    // Returns {status, exception, responseStarted, hitEnd}
    function run(i, st) {
      if (i >= mws.length) {
        line(i, 'wait', '到达管道末端，没有终端中间件处理 → 状态码 404');
        st.status = 404; st.hitEnd = true;
        return;
      }
      var m = mws[i], mode = modes[m.id];
      line(i, null, '→ <b>' + m.name + '</b>：' + (m.before || ''));

      if (mode === 'short') {
        var code = m.shortStatus || 401;
        if (st.responseStarted) {
          line(i, 'bad', '✋ 想把状态码改成 ' + code + '，但响应体已经开始发送 —— <code>InvalidOperationException: Headers are read-only, response has already started.</code>');
          st.exception = { at: m.name, msg: 'Headers are read-only, response has already started' };
          return;
        }
        line(i, 'wait', '✋ 短路：写 ' + code + ' 响应，<b>不调 next</b>，return');
        st.status = code; st.responseStarted = true; st.shortBy = m.name;
        return;
      }
      if (mode === 'throw') {
        line(i, 'bad', '💥 throw ' + (m.throws || 'InvalidOperationException') + '，<b>没调 next</b>');
        st.exception = { at: m.name, msg: m.throws || 'InvalidOperationException' };
        return;
      }
      if (mode === 'ok') {
        line(i, 'good', '✔ 执行完成，写 200 响应');
        st.status = 200; st.responseStarted = true;
        return;
      }
      if (mode === 'write-next') {
        line(i, 'wait', '✎ 往响应体写了字节 → <code>Response.HasStarted = true</code>，状态码和头已经发出去了');
        st.responseStarted = true; st.status = st.status || 200;
      }

      // next / write-next: descend
      line(i, null, '&nbsp;&nbsp;await next() …');
      run(i + 1, st);

      if (st.exception) {
        if (m.catches && st.responseStarted) {
          line(i, 'bad', '🛡 <b>' + m.name + '</b> 抓到了 ' + st.exception.msg + '，但响应已经开始发送，<b>改不了状态码</b> → 只能重新抛出，连接被中止，客户端收到半截响应');
          st.caught = 'too-late';
          return;
        }
        if (m.catches) {
          line(i, 'good', '🛡 <b>' + m.name + '</b> 的 catch 抓到了 ' + st.exception.msg + '（来自 ' + st.exception.at + '）→ 写 500 响应');
          st.caught = st.exception; st.exception = null; st.status = 500; st.responseStarted = true;
        } else {
          line(i, 'bad', '↑ <b>' + m.name + '</b>：异常穿过，<s>' + (m.after || '') + '</s> <em>后置代码不执行</em>');
          return;
        }
      }
      if (m.after && m.after !== '—') {
        var extra = st.shortBy ? '（虽然 ' + st.shortBy + ' 短路了，这里照样跑，看到的状态码是 ' + st.status + '）' : '';
        line(i, st.shortBy ? 'wait' : null, '↑ <b>' + m.name + '</b>：' + m.after + extra);
      }
    }

    function fire() {
      clearTrace();
      var st = { status: 0, exception: null, caught: null, responseStarted: false, hitEnd: false, shortBy: null };
      run(0, st);
      var title, tone, text;
      if (st.caught === 'too-late') {
        tone = 'bad';
        title = '异常处理中间件在最外层，但也救不了。';
        text = '响应体已经开始发送，头和状态码早就出去了，<code>UseExceptionHandler</code> 没法把它改写成 500——它会检查 <code>HasStarted</code>，为 true 就直接重新抛出。教训有两条：一、能改头的事（状态码、鉴权拒绝）必须发生在任何人写 body 之前；二、往 body 写东西的中间件，把写操作放到 <code>await next()</code> <strong>之后</strong>。';
      } else if (st.caught) {
        tone = 'wait';
        title = '异常被最外层接住了，中间几层的后置代码全没跑。';
        text = '看 trace 里带删除线的那几行：' + st.caught.at + ' 抛出后，它外面每一层从 <code>await next()</code> 处直接被异常穿过，后置代码不执行——日志中间件没记到这条请求的耗时。只有 <code>UseExceptionHandler</code> 因为在<strong>最外层</strong>才有机会 catch 并写 500。如果把它挪到 Logging 里面，Logging 自己抛的异常就没人接了。';
      } else if (st.exception) {
        tone = 'bad';
        title = '异常一路穿出管道，没人接。';
        text = '最外层也没有 catch，这个请求以 500 结束，且外层中间件的后置代码全部没跑——日志里不会有这条请求的耗时。这就是 <code>UseExceptionHandler</code> 必须排在<strong>第一个</strong>的原因：它要在所有人外面。';
      } else if (st.status === 404 && st.hitEnd) {
        tone = 'wait'; title = '走到了管道末端。';
        text = 'Build() 折叠时塞在最里面的那个默认委托就是它：<code>if (!HasStarted) StatusCode = 404</code>。所有人的后置代码照常执行。';
      } else if (st.shortBy) {
        tone = 'wait'; title = st.shortBy + ' 短路了，但外层的后置代码照常跑完。';
        text = '短路只是「不调 next」——外层中间件从自己的 <code>await next()</code> 返回后，后面的代码一行不少。所以 Logging 放在 Auth 外面，就能记录到 401；放在里面，401 的请求根本进不来。';
      } else {
        tone = 'good'; title = '请求进去、响应出来，进出顺序正好相反。';
        text = '注意 trace 的缩进：进的时候 1→2→3→4，出的时候 4→3→2→1。每个中间件的 before 和 after 隔着整个内层——它们是<strong>同一个方法里 await next() 的上下两半</strong>，和上一课的状态机是同一件事。';
      }
      verdict.className = 'pl-verdict show ' + tone;
      verdict.innerHTML = '<strong>' + title + '</strong>' + text +
        '<div class="pl-status">最终状态码：<b>' + (st.exception ? '500（未处理异常）' : st.status) + '</b></div>';
    }

    controls.querySelector('.pl-fire').addEventListener('click', fire);
    controls.querySelector('.pl-reset').addEventListener('click', function () {
      mws.forEach(function (m) { modes[m.id] = (m.modes && m.modes[0]) || (m.terminal ? 'ok' : 'next'); });
      paintDoll(); clearTrace();
    });

    paintFold();
    paintDoll();
  }

  function init() { document.querySelectorAll('.pipeline[data-pipeline]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* === ASP.NET Core Course — Pipeline Trace Component ===
 * Retrieval practice for middleware ordering: the learner reads a pipeline,
 * predicts the console trace, and gets immediate feedback.
 *
 * Markup:
 *   <div class="pipe" data-pipe='[
 *        {"id":"A","kind":"use"},
 *        {"id":"B","kind":"use","short":true},
 *        {"id":"C","kind":"use"},
 *        {"id":"E","kind":"endpoint"}
 *      ]'
 *        data-prompt="请求带 X-Block 头时，控制台按顺序打印什么？">
 *     <pre class="pipe__code">…（展示给学习者的代码）…</pre>
 *   </div>
 *   …
 *   <script src="../assets/pipeline-sim.js"></script>
 *
 * Node kinds:
 *   use        — logs "<id> in", calls next, logs "<id> out". With "short":true it
 *                logs "<id> short" and does NOT call next.
 *   endpoint   — logs "<id>" (terminal, never calls next).
 *   run        — same as endpoint (terminal delegate).
 *   throw      — logs "<id> in", calls next, then throws: nothing after it on the way
 *                back is logged for *any* outer middleware ("<id> throw").
 *   mapwhen    — {"id":"M","kind":"mapwhen","branch":[...]} : when "hit":true the
 *                branch runs and the main line is NOT rejoined.
 *   usewhen    — {"id":"U","kind":"usewhen","branch":[...]} : when "hit":true the
 *                branch runs and then continues into the main line.
 *
 * Learner types the trace as tokens separated by spaces/commas/newlines, e.g.
 *   "A in, B in, C in, E, C out, B out, A out". Comparison is case-insensitive
 *   and ignores punctuation; the expected trace is computed from the model, so
 *   the same component works for any pipeline a lesson describes.
 */
(function () {
  'use strict';

  function simulate(nodes) {
    var log = [];
    // returns true if an exception is propagating outward
    function run(list, i) {
      if (i >= list.length) return false;
      var n = list[i];
      switch (n.kind) {
        case 'endpoint':
        case 'run':
          log.push(n.id);
          return false;
        case 'use':
          if (n.short) { log.push(n.id + ' short'); return false; }
          log.push(n.id + ' in');
          var thrown = run(list, i + 1);
          if (thrown) return true;
          log.push(n.id + ' out');
          return false;
        case 'throw':
          log.push(n.id + ' in');
          if (run(list, i + 1)) return true;
          log.push(n.id + ' throw');
          return true;
        case 'mapwhen':
          if (n.hit) return run(n.branch || [], 0);
          return run(list, i + 1);
        case 'usewhen':
          if (n.hit) {
            // branch, then rejoin: branch nodes are followed by the rest of main line
            return run((n.branch || []).concat(list.slice(i + 1)), 0);
          }
          return run(list, i + 1);
        default:
          return run(list, i + 1);
      }
    }
    run(nodes, 0);
    return log;
  }

  function norm(s) {
    return s.toLowerCase().replace(/[^\w一-鿿]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  }

  function init(el) {
    var nodes;
    try { nodes = JSON.parse(el.getAttribute('data-pipe')); }
    catch (e) { el.textContent = 'pipeline-sim: data-pipe 不是合法 JSON'; return; }
    var expected = simulate(nodes);
    var expectedTokens = norm(expected.join(' '));

    var prompt = document.createElement('div');
    prompt.className = 'pipe__prompt';
    prompt.textContent = el.getAttribute('data-prompt') || '控制台会按什么顺序打印？';

    var ta = document.createElement('textarea');
    ta.className = 'pipe__input';
    ta.rows = 3;
    ta.placeholder = '例：A in, B in, E, B out, A out';
    ta.setAttribute('aria-label', '你的预测');

    var btn = document.createElement('button');
    btn.className = 'pipe__check';
    btn.type = 'button';
    btn.textContent = '核对';

    var reveal = document.createElement('button');
    reveal.className = 'pipe__reveal';
    reveal.type = 'button';
    reveal.textContent = '看答案';

    var fb = document.createElement('div');
    fb.className = 'pipe__feedback';

    function show(cls, html) {
      fb.className = 'pipe__feedback pipe__feedback--show pipe__feedback--' + cls;
      fb.innerHTML = html;
    }

    function answerHtml() {
      return '<pre class="pipe__trace">' + expected.join('\n') + '</pre>';
    }

    btn.addEventListener('click', function () {
      var got = norm(ta.value);
      if (!got.length) { show('warn', '先写下你的预测，再核对。'); return; }
      if (got.join(' ') === expectedTokens.join(' ')) {
        show('ok', '✅ 完全正确。' + answerHtml());
        el.classList.add('pipe--done');
        return;
      }
      // find first divergence
      var k = 0;
      while (k < got.length && k < expectedTokens.length && got[k] === expectedTokens[k]) k++;
      var idx = Math.floor(k / 2); // approx line index (tokens are ~2 per line)
      show('bad', '❌ 从第 ' + (idx + 1) + ' 行左右开始不一致。想想：哪个中间件没调 next？响应是按注册顺序的<strong>逆序</strong>回来的。改一改再核对，或点「看答案」。');
    });

    reveal.addEventListener('click', function () {
      show('info', '答案：' + answerHtml());
      el.classList.add('pipe--done');
    });

    var row = document.createElement('div');
    row.className = 'pipe__row';
    row.appendChild(btn);
    row.appendChild(reveal);

    el.appendChild(prompt);
    el.appendChild(ta);
    el.appendChild(row);
    el.appendChild(fb);
  }

  Array.prototype.slice.call(document.querySelectorAll('.pipe')).forEach(init);
})();

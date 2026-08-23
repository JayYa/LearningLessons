/* Reusable call-chain failure explorer.
 *
 * Renders a chain of services, focuses one hop, and lets the learner inject a
 * failure mode on that hop. For each mode the lesson author supplies what the
 * *user* sees, what state the *data* is left in, and what the engineering fix is.
 *
 * Usage in a lesson:
 *   <div class="callchain" data-callchain='{
 *     "title":"...",
 *     "nodes":["浏览器","网关","工单服务","库存服务"],
 *     "focus":2,                       // index of the hop: nodes[2] -> nodes[3]
 *     "label":"POST /reserve",
 *     "modes":[
 *       {"id":"ok","label":"正常","tone":"good",
 *        "seen":"...","state":"...","fix":"...","retry":"..."}
 *     ]
 *   }'></div>
 *   <script src="../assets/callchain.js"></script>
 *
 * Design notes:
 *  - The point of the widget is that three of the four modes look identical to
 *    the *caller*. The learner has to click through to feel that ambiguity;
 *    reading a table does not produce it.
 *  - "retry" is optional per mode. When absent the retry toggle is hidden for
 *    that mode, so authors only write the combinations that teach something.
 *  - tone: "good" | "bad" (default "bad") only drives the arrow colour.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function build(root) {
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-callchain')); }
    catch (e) { root.textContent = 'Callchain data malformed: ' + e.message; return; }

    var focus = cfg.focus || 0;
    var current = 0, retryOn = false;

    var head = el('div', 'cc-head',
      '<span class="label">Try to break it</span>' +
      '<span class="cc-title">' + (cfg.title || '') + '</span>');
    root.appendChild(head);

    // ----- chain -----
    var chain = el('div', 'cc-chain');
    var edges = [];
    cfg.nodes.forEach(function (name, i) {
      chain.appendChild(el('div', 'cc-node', name));
      if (i < cfg.nodes.length - 1) {
        var isFocus = i === focus;
        var edge = el('div', 'cc-edge' + (isFocus ? ' focus' : ''));
        edge.appendChild(el('span', null, isFocus ? (cfg.label || '') : ''));
        edge.appendChild(el('div', 'cc-arrow'));
        edge.appendChild(el('span', 'cc-edge-state', ''));
        chain.appendChild(edge);
        edges.push(edge);
      }
    });
    root.appendChild(chain);
    var focusEdge = edges[focus];

    // ----- controls -----
    var controls = el('div', 'cc-controls');
    var buttons = cfg.modes.map(function (mode, i) {
      var b = el('button', 'cc-mode', mode.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { current = i; render(); });
      controls.appendChild(b);
      return b;
    });

    var retryWrap = el('label', 'cc-retry');
    var retryBox = document.createElement('input');
    retryBox.type = 'checkbox';
    retryWrap.appendChild(retryBox);
    retryWrap.appendChild(el('span', null, '客户端自动重试一次'));
    retryBox.addEventListener('change', function () { retryOn = retryBox.checked; render(); });
    controls.appendChild(retryWrap);
    root.appendChild(controls);

    // ----- output -----
    var out = el('div', 'cc-out');
    root.appendChild(out);

    function row(cls, key, val) {
      var r = el('div', 'cc-row ' + cls);
      r.appendChild(el('div', 'cc-key', key));
      r.appendChild(el('div', 'cc-val', val));
      return r;
    }

    function render() {
      var mode = cfg.modes[current];
      var tone = mode.tone === 'good' ? 'good' : 'bad';

      buttons.forEach(function (b, i) {
        b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      });

      focusEdge.classList.remove('good', 'bad');
      focusEdge.classList.add(tone);
      focusEdge.querySelector('.cc-edge-state').textContent = mode.label;

      retryWrap.style.visibility = mode.retry ? 'visible' : 'hidden';

      out.innerHTML = '';
      out.appendChild(row('seen', '调用方看到', mode.seen));
      out.appendChild(row('state' + (tone === 'good' ? ' ok' : ''), '数据状态', mode.state));
      if (mode.fix) out.appendChild(row('fix', '工程上怎么办', mode.fix));
      if (mode.retry && retryOn) out.appendChild(el('div', 'cc-note', '<strong>加了重试之后：</strong>' + mode.retry));
    }

    render();
  }

  document.querySelectorAll('.callchain').forEach(build);
})();

/* Reusable slow-request triage lab: a trace waterfall plus a strip of metrics, and one question —
 * "where did the time go?" The learner clicks a bar (or a gap) before the verdict is shown.
 *
 * Usage in a lesson:
 *   <div class="waterfall" data-waterfall='{
 *     "label": "...",
 *     "cases": [
 *       {"title": "...", "total": 2000, "ask": "哪一段是瓶颈？",
 *        "metrics": [{"k":"CPU","v":"12%","tone":"bad"}, ...],
 *        "spans": [
 *          {"id":"web","name":"GET /orders","start":0,"dur":2000,"depth":0},
 *          {"id":"db","name":"SELECT ...","start":120,"dur":1800,"depth":1,"culprit":true}
 *        ],
 *        "gaps": [{"id":"g1","name":"？空白","start":0,"dur":2600,"depth":1,"culprit":true}],
 *        "verdict": "...", "next": "下一步用什么工具"}
 *     ]
 *   }'></div>
 *   <script src="../assets/waterfall.js"></script>
 *
 * Design notes:
 *  - Cases are tabs; each case renders a Gantt-style waterfall. Bars are buttons; the learner must
 *    pick one before the verdict appears (retrieval, not recognition).
 *  - "gaps" are rendered as dashed, empty bars — time nobody instrumented. Making the gap
 *    clickable is the point: a trace whose spans do not add up to the total is itself a finding.
 *  - "metrics" is an optional strip of dashboard tiles shown above the waterfall, because the
 *    same waterfall reads differently depending on what CPU / thread count / p99 are doing.
 *  - Each span may carry "hint": shown when a wrong bar is clicked, so wrong answers teach too.
 *  - Print: verdicts are expanded by CSS.
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
    var data;
    try { data = JSON.parse(root.getAttribute('data-waterfall')); }
    catch (e) { root.textContent = 'Waterfall data malformed: ' + e.message; return; }

    var head = el('div', 'wf-head');
    head.appendChild(el('span', 'label', data.label || 'Where did the time go?'));
    var score = el('span', 'wf-score', '0 / ' + data.cases.length);
    head.appendChild(score);
    root.appendChild(head);

    var tabs = el('div', 'wf-tabs');
    root.appendChild(tabs);
    var stage = el('div', 'wf-stage');
    root.appendChild(stage);

    var solved = {};
    var tabBtns = [];

    data.cases.forEach(function (c, i) {
      var b = el('button', 'wf-tab', (i + 1) + ' · ' + c.title);
      b.type = 'button';
      b.addEventListener('click', function () { show(i); });
      tabs.appendChild(b);
      tabBtns.push(b);
    });

    function updateScore() {
      var n = Object.keys(solved).length;
      score.textContent = n + ' / ' + data.cases.length;
    }

    function show(i) {
      tabBtns.forEach(function (b, j) { b.classList.toggle('active', j === i); });
      var c = data.cases[i];
      stage.innerHTML = '';

      if (c.intro) stage.appendChild(el('p', 'wf-intro', c.intro));

      if (c.metrics && c.metrics.length) {
        var strip = el('div', 'wf-metrics');
        c.metrics.forEach(function (m) {
          var t = el('div', 'wf-tile' + (m.tone ? ' ' + m.tone : ''));
          t.appendChild(el('span', 'wf-k', m.k));
          t.appendChild(el('span', 'wf-v', m.v));
          strip.appendChild(t);
        });
        stage.appendChild(strip);
      }

      var total = c.total;
      var scale = el('div', 'wf-scale');
      [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
        var tick = el('span', 'wf-tick', Math.round(total * f) + ' ms');
        tick.style.left = (f * 100) + '%';
        scale.appendChild(tick);
      });
      stage.appendChild(scale);

      var chart = el('div', 'wf-chart');
      var rows = (c.spans || []).map(function (s) { s._gap = false; return s; })
        .concat((c.gaps || []).map(function (g) { g._gap = true; return g; }));
      rows.sort(function (a, b) { return (a.start - b.start) || (a.depth - b.depth); });

      var verdict = el('div', 'wf-verdict');
      var answered = false;

      rows.forEach(function (s) {
        var row = el('div', 'wf-row');
        var name = el('span', 'wf-name', s.name);
        name.style.paddingLeft = (0.6 + (s.depth || 0) * 1.1) + 'rem';
        row.appendChild(name);
        var track = el('div', 'wf-track');
        var bar = el('button', 'wf-bar' + (s._gap ? ' gap' : '') + (s.tone ? ' ' + s.tone : ''));
        bar.type = 'button';
        bar.style.left = (s.start / total * 100) + '%';
        bar.style.width = Math.max(s.dur / total * 100, 0.6) + '%';
        bar.title = s.dur + ' ms';
        bar.appendChild(el('span', 'wf-dur', s.dur + ' ms'));
        bar.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          chart.querySelectorAll('.wf-bar').forEach(function (b) { b.classList.add('locked'); });
          if (s.culprit) {
            bar.classList.add('hit');
            solved[i] = true;
            updateScore();
            verdict.className = 'wf-verdict good';
            verdict.innerHTML = '<span class="wf-tag">对</span><p>' + c.verdict + '</p>' +
              (c.next ? '<p class="wf-next"><strong>下一步 →</strong> ' + c.next + '</p>' : '');
          } else {
            bar.classList.add('miss');
            rows.forEach(function (r) { if (r.culprit) r._el.classList.add('hit'); });
            verdict.className = 'wf-verdict bad';
            verdict.innerHTML = '<span class="wf-tag">不是这一段</span>' +
              (s.hint ? '<p>' + s.hint + '</p>' : '') +
              '<p>' + c.verdict + '</p>' +
              (c.next ? '<p class="wf-next"><strong>下一步 →</strong> ' + c.next + '</p>' : '');
          }
        });
        s._el = bar;
        track.appendChild(bar);
        row.appendChild(track);
        chart.appendChild(row);
      });
      stage.appendChild(chart);

      stage.appendChild(el('p', 'wf-ask', c.ask || '点你认为的瓶颈那一段。'));
      stage.appendChild(verdict);
    }

    show(0);
  }

  document.querySelectorAll('.waterfall[data-waterfall]').forEach(build);
})();

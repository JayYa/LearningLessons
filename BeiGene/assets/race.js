/* Reusable concurrent-interleaving simulator.
 *
 * Two (or more) sessions run against one row. The learner picks a strategy, then
 * single-steps a fixed interleaving and watches the shared state change under it.
 *
 * Usage in a lesson:
 *   <div class="race" data-race='{
 *     "label": "...",
 *     "actors": [{"id":"c1","label":"张三"},{"id":"c2","label":"李四"}],
 *     "state": [{"key":"status","label":"status","init":"pending"}],
 *     "strategies": [{
 *       "id":"naive", "label":"读后写", "sql":"<span class=\"kw\">SELECT</span> ...",
 *       "steps":[{"actor":"c1","text":"...","note":"...","set":{"status":"claimed"},"tone":"bad"}],
 *       "verdict":{"tone":"bad","title":"...","text":"..."}
 *     }]
 *   }'></div>
 *   <script src="../assets/race.js"></script>
 *
 * Design notes:
 *  - Stepping is manual and one-way. Predicting the next line is the retrieval act,
 *    so never auto-play: the pause before the click is where the learning happens.
 *  - The verdict stays hidden until the last step, so the outcome cannot be read ahead.
 *  - `tone` on a step tints just that line (use it for the moment the bug becomes visible).
 *  - Switching strategy resets the timeline; the state row is the same in every strategy,
 *    which is what makes the comparison legible.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function build(root) {
    var data;
    try { data = JSON.parse(root.getAttribute('data-race')); }
    catch (e) { root.textContent = 'Race data malformed: ' + e.message; return; }

    var current = data.strategies[0], cursor = 0;

    var head = document.createElement('div');
    head.className = 'rc-head';
    head.innerHTML = '<span class="label">' + (data.label || '并发交错模拟') + '</span>';
    root.appendChild(head);

    var tabs = document.createElement('div');
    tabs.className = 'rc-tabs';
    root.appendChild(tabs);

    var sql = document.createElement('pre');
    sql.className = 'rc-sql';
    root.appendChild(sql);

    var state = document.createElement('div');
    state.className = 'rc-state';
    root.appendChild(state);

    var lanes = document.createElement('div');
    lanes.className = 'rc-lanes';
    lanes.style.gridTemplateColumns = 'repeat(' + data.actors.length + ', 1fr)';
    root.appendChild(lanes);

    var timeline = document.createElement('ol');
    timeline.className = 'rc-timeline';
    timeline.style.gridTemplateColumns = 'repeat(' + data.actors.length + ', 1fr)';
    root.appendChild(timeline);

    var verdict = document.createElement('div');
    verdict.className = 'rc-verdict';
    root.appendChild(verdict);

    var controls = document.createElement('div');
    controls.className = 'rc-controls';
    controls.innerHTML = '<button type="button" class="rc-step"></button>' +
      '<button type="button" class="rc-reset">重来</button>';
    root.appendChild(controls);

    var stepBtn = controls.querySelector('.rc-step');
    var resetBtn = controls.querySelector('.rc-reset');

    data.actors.forEach(function (a) {
      var lane = document.createElement('div');
      lane.className = 'rc-lane';
      lane.textContent = a.label;
      lanes.appendChild(lane);
    });

    function actorIndex(id) {
      for (var i = 0; i < data.actors.length; i++) {
        if (data.actors[i].id === id) return i;
      }
      return 0;
    }

    function paintState() {
      var vals = {};
      data.state.forEach(function (f) { vals[f.key] = f.init; });
      var changed = {};
      for (var i = 0; i < cursor; i++) {
        var set = current.steps[i].set;
        if (!set) continue;
        Object.keys(set).forEach(function (k) { vals[k] = set[k]; changed[k] = i === cursor - 1; });
      }
      state.innerHTML = '<span class="rc-state-label">行状态</span>' +
        data.state.map(function (f) {
          return '<span class="rc-cell' + (changed[f.key] ? ' just-changed' : '') + '">' +
            '<i>' + f.label + '</i>' + String(vals[f.key]) + '</span>';
        }).join('');
    }

    function paintTimeline() {
      timeline.innerHTML = '';
      current.steps.slice(0, cursor).forEach(function (s, i) {
        var li = document.createElement('li');
        li.className = 'rc-step-row' + (s.tone ? ' ' + s.tone : '') +
          (i === cursor - 1 ? ' latest' : '');
        li.style.gridColumn = String(actorIndex(s.actor) + 1);
        li.innerHTML = '<span class="rc-t">t' + (i + 1) + '</span>' +
          '<span class="rc-text">' + s.text + '</span>' +
          (s.note ? '<span class="rc-note">' + s.note + '</span>' : '');
        timeline.appendChild(li);
      });
    }

    function paintVerdict() {
      var done = cursor >= current.steps.length;
      if (!done || !current.verdict) { verdict.className = 'rc-verdict'; verdict.innerHTML = ''; return; }
      verdict.className = 'rc-verdict show ' + (current.verdict.tone || '');
      verdict.innerHTML = '<strong>' + current.verdict.title + '</strong>' + current.verdict.text;
    }

    function paint() {
      var done = cursor >= current.steps.length;
      stepBtn.textContent = cursor === 0 ? '开始 ▸' : (done ? '已到结局' : '下一步 ▸ （先猜再点）');
      stepBtn.disabled = done;
      resetBtn.disabled = cursor === 0;
      sql.innerHTML = current.sql;
      paintState();
      paintTimeline();
      paintVerdict();
    }

    data.strategies.forEach(function (st) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'rc-tab' + (st === current ? ' on' : '');
      tab.textContent = st.label;
      tab.addEventListener('click', function () {
        current = st; cursor = 0;
        tabs.querySelectorAll('.rc-tab').forEach(function (t) { t.classList.remove('on'); });
        tab.classList.add('on');
        paint();
      });
      tabs.appendChild(tab);
    });

    stepBtn.addEventListener('click', function () {
      if (cursor < current.steps.length) { cursor++; paint(); }
    });
    resetBtn.addEventListener('click', function () { cursor = 0; paint(); });

    paint();
  }

  function init() { document.querySelectorAll('.race[data-race]').forEach(build); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

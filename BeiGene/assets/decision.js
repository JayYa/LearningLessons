/* Reusable decision-tree walker.
 *
 * Usage in a lesson:
 *   <div class="decision" data-decision='{
 *     "start": {"q":"...","options":[{"label":"...","next":"a"},{"label":"...","next":"b"}]},
 *     "a": {"result":"...","detail":"...","tag":"O(n log n)"}
 *   }'></div>
 *   <script src="../assets/decision.js"></script>
 *
 * Design notes:
 *  - Forces an explicit choice at each node: the user walks the tree rather than reading it.
 *  - Breadcrumb of past answers stays visible, so the *path* (the reasoning) is the artifact,
 *    not just the leaf. That path is what gets spoken in an interview.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function build(root) {
    var tree;
    try { tree = JSON.parse(root.getAttribute('data-decision')); }
    catch (e) { root.textContent = 'Decision data malformed: ' + e.message; return; }

    var head = document.createElement('div');
    head.className = 'dec-head';
    head.innerHTML = '<span class="label">Decide it yourself</span>' +
      '<button type="button" class="dec-reset">重来</button>';
    root.appendChild(head);

    var trail = document.createElement('ol');
    trail.className = 'dec-trail';
    root.appendChild(trail);

    var stage = document.createElement('div');
    stage.className = 'dec-stage';
    root.appendChild(stage);

    function render(id) {
      var node = tree[id];
      stage.innerHTML = '';
      if (!node) { stage.textContent = 'Missing node: ' + id; return; }

      if (node.result) {
        var leaf = document.createElement('div');
        leaf.className = 'dec-leaf';
        leaf.innerHTML =
          (node.tag ? '<span class="dec-tag">' + node.tag + '</span>' : '') +
          '<p class="dec-result">' + node.result + '</p>' +
          (node.detail ? '<p class="dec-detail">' + node.detail + '</p>' : '');
        stage.appendChild(leaf);
        return;
      }

      var q = document.createElement('p');
      q.className = 'dec-q';
      q.textContent = node.q;
      stage.appendChild(q);

      var opts = document.createElement('div');
      opts.className = 'dec-opts';
      node.options.forEach(function (o) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dec-opt';
        btn.textContent = o.label;
        btn.addEventListener('click', function () {
          var li = document.createElement('li');
          li.textContent = node.q + ' → ' + o.label;
          trail.appendChild(li);
          render(o.next);
        });
        opts.appendChild(btn);
      });
      stage.appendChild(opts);
    }

    head.querySelector('.dec-reset').addEventListener('click', function () {
      trail.innerHTML = '';
      render('start');
    });

    render('start');
  }

  function init() { document.querySelectorAll('.decision[data-decision]').forEach(build); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

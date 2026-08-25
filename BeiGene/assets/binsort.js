/* Reusable two-bin categorisation drill.
 *
 * Usage in a lesson:
 *   <div class="binsort" data-binsort='{
 *     "bins": [{"id":"good","label":"...","tone":"good"},
 *              {"id":"bad","label":"...","tone":"bad"}],
 *     "items": [{"text":"...","bin":"good","why":"..."}]
 *   }'></div>
 *   <script src="../assets/binsort.js"></script>
 *
 * Design notes:
 *  - Retrieval practice, not recognition: the item is a bare signal with no cue in the
 *    wording as to which bin it belongs in. Keep item texts the same length.
 *  - Feedback is immediate and per-item, so the loop is as tight as it can be.
 *  - Wrong answers stay visible with the rationale. The point is the rationale, not the score.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function build(root) {
    var data;
    try { data = JSON.parse(root.getAttribute('data-binsort')); }
    catch (e) { root.textContent = 'Binsort data malformed: ' + e.message; return; }

    var answered = 0, correct = 0, total = data.items.length;

    var head = document.createElement('div');
    head.className = 'bs-head';
    head.innerHTML = '<span class="label">' + (data.label || '归类练习') + '</span>' +
      '<span class="bs-score"></span>';
    root.appendChild(head);

    var score = head.querySelector('.bs-score');
    function paintScore() {
      score.textContent = answered ? correct + ' / ' + answered + ' 正确（共 ' + total + '）' : '共 ' + total + ' 条';
    }
    paintScore();

    var list = document.createElement('ol');
    list.className = 'bs-list';
    root.appendChild(list);

    data.items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'bs-item';

      var text = document.createElement('p');
      text.className = 'bs-text';
      text.innerHTML = item.text;
      li.appendChild(text);

      var opts = document.createElement('div');
      opts.className = 'bs-opts';
      li.appendChild(opts);

      var why = document.createElement('div');
      why.className = 'bs-why';
      li.appendChild(why);

      data.bins.forEach(function (bin) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bs-opt';
        btn.textContent = bin.label;
        btn.addEventListener('click', function () {
          if (li.classList.contains('done')) return;
          li.classList.add('done');
          var right = bin.id === item.bin;
          answered++; if (right) correct++;
          paintScore();

          opts.querySelectorAll('.bs-opt').forEach(function (b) { b.disabled = true; });
          btn.classList.add(right ? 'picked-right' : 'picked-wrong');
          if (!right) {
            opts.querySelectorAll('.bs-opt').forEach(function (b, i) {
              if (data.bins[i].id === item.bin) b.classList.add('was-right');
            });
          }

          var truth = data.bins.filter(function (b) { return b.id === item.bin; })[0];
          why.className = 'bs-why show ' + (truth.tone || '');
          why.innerHTML = '<strong>' + truth.label + '。</strong>' + item.why;
        });
        opts.appendChild(btn);
      });

      list.appendChild(li);
    });
  }

  function init() { document.querySelectorAll('.binsort[data-binsort]').forEach(build); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

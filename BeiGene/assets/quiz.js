/* Reusable retrieval-practice quiz component.
 *
 * Usage in a lesson:
 *   <div class="quiz" data-quiz='[
 *     {"q":"...","options":["A","B","C"],"answer":1,"why":"..."}
 *   ]'></div>
 *   <script src="../assets/quiz.js"></script>
 *
 * Design notes:
 *  - Immediate feedback (tight loop), explanation shown on every answer.
 *  - Options are rendered in the authored order; keep them equal-length when writing.
 *  - Score is only revealed at the end, to keep attention on the explanation.
 */
(function () {
  function build(root) {
    var items;
    try { items = JSON.parse(root.getAttribute('data-quiz')); }
    catch (e) { root.textContent = 'Quiz data malformed: ' + e.message; return; }

    var answered = 0, correct = 0;

    var head = document.createElement('div');
    head.className = 'quiz-head';
    head.innerHTML = '<span class="label">Retrieval practice</span>' +
      '<span class="quiz-score" aria-live="polite"></span>';
    root.appendChild(head);
    var scoreEl = head.querySelector('.quiz-score');

    items.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'quiz-q';

      var q = document.createElement('p');
      q.className = 'quiz-prompt';
      q.innerHTML = '<span class="quiz-n">' + (i + 1) + '</span>' + item.q;
      card.appendChild(q);

      var list = document.createElement('div');
      list.className = 'quiz-opts';
      var locked = false;

      item.options.forEach(function (text, j) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          if (locked) return;
          locked = true;
          var right = j === item.answer;
          if (right) correct++;
          answered++;
          btn.classList.add(right ? 'is-correct' : 'is-wrong');
          if (!right) {
            list.children[item.answer].classList.add('is-correct');
          }
          Array.prototype.forEach.call(list.children, function (b) { b.disabled = true; });
          var why = document.createElement('div');
          why.className = 'quiz-why ' + (right ? 'ok' : 'no');
          why.innerHTML = '<strong>' + (right ? '对。' : '不对。') + '</strong>' + item.why;
          card.appendChild(why);
          if (answered === items.length) {
            scoreEl.textContent = correct + ' / ' + items.length;
          }
        });
        list.appendChild(btn);
      });

      card.appendChild(list);
      root.appendChild(card);
    });
  }

  function init() {
    document.querySelectorAll('.quiz[data-quiz]').forEach(build);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

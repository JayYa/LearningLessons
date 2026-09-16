/* === ASP.NET Core Course — Quiz Component ===
 * Auto-initializes every .quiz element on the page.
 *
 * Markup:
 *   <div class="quiz"
 *        data-feedback-correct="✅ 正确！…"
 *        data-feedback-wrong="❌ 不对。…">
 *     <div class="quiz__q">…</div>
 *     <div class="quiz__opt" data-answer="correct">A</div>
 *     <div class="quiz__opt" data-answer="wrong">B</div>
 *     <div class="quiz__feedback"></div>
 *   </div>
 *   …
 *   <script src="../assets/quiz.js"></script>
 *
 * Behaviour:
 *   - One click (or Enter/Space when focused) locks the answer, colours the
 *     chosen option, reveals the correct one, shows feedback.
 *   - A "重做" button appears so the learner can retry without reloading
 *     (the retry is counted — the score summary only counts first attempts).
 *   - After the last quiz, a score box is injected once every quiz has been
 *     answered at least once.
 *   - Option order is shuffled on load (data-no-shuffle on .quiz to disable),
 *     so answer position never leaks the answer.
 */
(function () {
  'use strict';

  var quizzes = Array.prototype.slice.call(document.querySelectorAll('.quiz'));
  if (!quizzes.length) return;

  var firstTry = {};   // quiz index -> true/false (first attempt correct?)
  var scoreBox = null;

  function shuffle(container, opts) {
    var arr = opts.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    var anchor = container.querySelector('.quiz__feedback');
    arr.forEach(function (o) { container.insertBefore(o, anchor); });
  }

  function ensureScoreBox() {
    if (scoreBox) return scoreBox;
    scoreBox = document.createElement('div');
    scoreBox.className = 'quiz-score';
    var last = quizzes[quizzes.length - 1];
    last.parentNode.insertBefore(scoreBox, last.nextSibling);
    return scoreBox;
  }

  function updateScore() {
    var answered = Object.keys(firstTry).length;
    if (answered < quizzes.length) return;
    var correct = quizzes.reduce(function (n, _, i) { return n + (firstTry[i] ? 1 : 0); }, 0);
    var box = ensureScoreBox();
    box.textContent = '首次作答：' + correct + ' / ' + quizzes.length +
      (correct === quizzes.length ? '，全对。把结果告诉老师。' : '。错的题回看对应章节，然后点「重做」再试一次；把首次结果告诉老师。');
    box.classList.add('quiz-score--show');
    box.classList.toggle('quiz-score--perfect', correct === quizzes.length);
  }

  quizzes.forEach(function (quiz, idx) {
    var opts = Array.prototype.slice.call(quiz.querySelectorAll('.quiz__opt'));
    var fb = quiz.querySelector('.quiz__feedback');
    if (!opts.length || !fb) return;

    var msgCorrect = quiz.dataset.feedbackCorrect || '✅ 正确！';
    var msgWrong   = quiz.dataset.feedbackWrong   || '❌ 不对。';
    var answered = false;

    if (!('noShuffle' in quiz.dataset)) shuffle(quiz, opts);

    // Accessibility
    quiz.setAttribute('role', 'group');
    opts.forEach(function (o) {
      o.setAttribute('role', 'button');
      o.setAttribute('tabindex', '0');
    });
    fb.setAttribute('aria-live', 'polite');

    var retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'quiz__retry';
    retry.textContent = '重做';
    fb.parentNode.insertBefore(retry, fb.nextSibling);

    function answer(opt) {
      if (answered) return;
      answered = true;
      quiz.classList.add('quiz--answered');

      var isCorrect = opt.dataset.answer === 'correct';
      opt.classList.add(isCorrect ? 'quiz__opt--correct' : 'quiz__opt--wrong');
      opts.forEach(function (o) {
        if (o.dataset.answer === 'correct' && o !== opt) o.classList.add('quiz__opt--correct');
        o.setAttribute('aria-disabled', 'true');
      });

      fb.textContent = isCorrect ? msgCorrect : msgWrong;
      fb.classList.add('quiz__feedback--show');

      if (!(idx in firstTry)) firstTry[idx] = isCorrect;
      updateScore();
    }

    function reset() {
      answered = false;
      quiz.classList.remove('quiz--answered');
      opts.forEach(function (o) {
        o.classList.remove('quiz__opt--correct', 'quiz__opt--wrong');
        o.removeAttribute('aria-disabled');
      });
      fb.textContent = '';
      fb.classList.remove('quiz__feedback--show');
      shuffle(quiz, opts);
    }

    opts.forEach(function (opt) {
      opt.addEventListener('click', function () { answer(opt); });
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); answer(opt); }
      });
    });
    retry.addEventListener('click', reset);
  });
})();

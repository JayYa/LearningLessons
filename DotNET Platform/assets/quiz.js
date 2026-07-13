/* === .NET Platform Course — Quiz Component === */
/* Auto-initializes all .quiz elements on the page.              */
/*                                                               */
/* Usage:                                                        */
/*   <link rel="stylesheet" href="../assets/styles.css">         */
/*   ...                                                         */
/*   <div class="quiz"                                           */
/*        data-feedback-correct="✅ 正确！"                       */
/*        data-feedback-wrong="❌ 不对。">                        */
/*     <div class="quiz__q">...</div>                            */
/*     <div class="quiz__opt" data-answer="correct">A</div>      */
/*     <div class="quiz__opt" data-answer="wrong">B</div>        */
/*     <div class="quiz__feedback"></div>                        */
/*   </div>                                                      */
/*   <script src="../assets/quiz.js"></script>                   */
/*                                                               */
/* Each .quiz__opt must have data-answer="correct" or "wrong".   */
/* Feedback messages can be set per-quiz via data attributes,    */
/* or omitted for generic defaults ("✅ 正确！"/"❌ 不对。").    */

(function () {
  const quizzes = document.querySelectorAll('.quiz');

  quizzes.forEach(function (quiz) {
    const opts = quiz.querySelectorAll('.quiz__opt');
    const fb = quiz.querySelector('.quiz__feedback');
    if (!opts.length || !fb) return;

    const msgCorrect = quiz.dataset.feedbackCorrect || '✅ 正确！';
    const msgWrong   = quiz.dataset.feedbackWrong   || '❌ 不对。';

    let answered = false;

    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (answered) return;
        answered = true;

        var isCorrect = opt.dataset.answer === 'correct';
        opt.classList.add(isCorrect ? 'quiz__opt--correct' : 'quiz__opt--wrong');

        // Reveal the correct answer if user got it wrong
        opts.forEach(function (o) {
          if (o.dataset.answer === 'correct' && o !== opt) {
            o.classList.add('quiz__opt--correct');
          }
        });

        fb.textContent = isCorrect ? msgCorrect : msgWrong;
        fb.classList.add('quiz__feedback--show');
      });
    });
  });
})();

/* === Quiz Widget === */
/* Usage: <div class="quiz" data-answer="0"> (0-indexed correct option) */
/*        <div class="quiz__option" data-idx="0">...</div> */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.quiz').forEach(function(quiz) {
      var correctIdx = parseInt(quiz.getAttribute('data-answer'), 10);
      var options = quiz.querySelectorAll('.quiz__option');
      var feedback = quiz.querySelector('.quiz__feedback');
      var answered = false;

      options.forEach(function(opt) {
        opt.addEventListener('click', function() {
          if (answered) return;
          answered = true;

          var idx = parseInt(opt.getAttribute('data-idx'), 10);
          var isCorrect = (idx === correctIdx);

          // Style the selected option
          opt.classList.add(isCorrect ? 'quiz__option--correct' : 'quiz__option--wrong');

          // Style the correct option
          if (!isCorrect) {
            options[correctIdx].classList.add('quiz__option--correct');
          }

          // Show feedback
          if (feedback) {
            feedback.classList.add(
              isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'
            );
            feedback.classList.add('quiz__feedback--show');
          }

          // Disable all options
          options.forEach(function(o) { o.style.cursor = 'default'; });
        });
      });
    });
  });
})();

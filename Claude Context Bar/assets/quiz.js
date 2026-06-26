/**
 * Shared quiz widget for VS Code Extension Development course.
 *
 * Usage in lesson HTML:
 *   <div class="quiz" id="q1">
 *     <h3>问题 N</h3>
 *     <p>Question text...</p>
 *     <label><input type="radio" name="q1" value="a"> Option A</label>
 *     <label><input type="radio" name="q1" value="b"> Option B</label>
 *     <button class="quiz-btn" data-quiz="q1" data-answer="b"
 *             data-explain="解释文本——无论答对还是答错都显示这段话。">检查答案</button>
 *     <div class="feedback" id="q1-fb"></div>
 *   </div>
 *
 * Optional: data-explain-incorrect for a different message on wrong answer.
 */

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz-btn');
    if (!btn) return;

    var quizId   = btn.getAttribute('data-quiz');
    var answer   = btn.getAttribute('data-answer');
    var explain  = btn.getAttribute('data-explain');
    var incorrectHint = btn.getAttribute('data-explain-incorrect');

    var fb = document.getElementById(quizId + '-fb');
    if (!fb) return;

    var checked = document.querySelector('input[name="' + quizId + '"]:checked');
    if (!checked) {
      fb.textContent = '请先选择一个答案。';
      fb.className = 'feedback incorrect';
      return;
    }

    if (checked.value === answer) {
      fb.textContent = '✓ 正确！' + explain;
      fb.className = 'feedback correct';
    } else {
      var msg = incorrectHint != null ? incorrectHint : explain;
      fb.textContent = '✗ 不对。' + msg;
      fb.className = 'feedback incorrect';
    }
  });
});

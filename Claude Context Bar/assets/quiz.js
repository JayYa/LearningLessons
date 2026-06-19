/**
 * Shared quiz widget for VS Code Extension Development course.
 *
 * Usage in lesson HTML:
 *   <div class="quiz" id="q1">
 *     <h3>问题 1</h3>
 *     <p>Question text...</p>
 *     <label><input type="radio" name="q1" value="a"> Option A</label>
 *     <label><input type="radio" name="q1" value="b"> Option B</label>
 *     <button onclick="checkQuiz('q1', 'a', '✓ correct', '✗ hint')">检查答案</button>
 *     <div class="feedback" id="q1-fb"></div>
 *   </div>
 */

function checkQuiz(quizId, correctValue, correctText, incorrectText) {
  const fb = document.getElementById(quizId + '-fb');
  if (!fb) return;
  const checked = document.querySelector('input[name="' + quizId + '"]:checked');
  if (!checked) {
    fb.textContent = '请先选择一个答案。';
    fb.className = 'feedback incorrect';
    return;
  }
  if (checked.value === correctValue) {
    fb.textContent = '✓ 正确！' + correctText;
    fb.className = 'feedback correct';
  } else {
    fb.textContent = '✗ ' + incorrectText;
    fb.className = 'feedback incorrect';
  }
}

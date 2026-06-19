/* ============================================================
   assets/quiz.js — 测验答案检查通用函数
   Vinland Saga 教学 workspace

   使用方式：
     <script src="../assets/quiz.js"></script>
     ...
     <button onclick="checkQuiz(1,'b','✅ 正确！……','❌ 不对。正确答案是B：……')">检查答案</button>

   参数：
     - questionNum: 问题编号（对应 id="f1", id="f2" 等）
     - correctValue: 正确答案的 value（如 'b'）
     - correctText:  回答正确时显示的文本
     - incorrectText: 回答错误时显示的文本

   无障碍说明：
     - 未选择任何选项时会提示"请先选择一个答案。"
     - 支持键盘导航（label > input[type=radio] 天然可焦点化）
   ============================================================ */

function checkQuiz(questionNum, correctValue, correctText, incorrectText) {
  var feedback = document.getElementById('f' + questionNum);
  var selected = document.querySelector('input[name="q' + questionNum + '"]:checked');

  if (!selected) {
    feedback.className = 'feedback incorrect';
    feedback.textContent = '请先选择一个答案。';
    return;
  }

  if (selected.value === correctValue) {
    feedback.className = 'feedback correct';
    feedback.textContent = '✅ ' + correctText;
  } else {
    feedback.className = 'feedback incorrect';
    feedback.textContent = '❌ ' + incorrectText;
  }
}

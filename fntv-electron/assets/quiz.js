/* 可复用测验组件 · 即时反馈
 *
 * 用法：
 *   <div class="quiz" data-answer="b">
 *     <p class="quiz-q">题干</p>
 *     <div class="quiz-opts">
 *       <button class="quiz-opt" data-opt="a">选项一</button>
 *       <button class="quiz-opt" data-opt="b">选项二</button>
 *     </div>
 *     <div class="quiz-explain">为什么。答错时同样展示，因为解释才是学习发生的地方。</div>
 *   </div>
 *
 * 页面任意处放 <div class="quiz-score"></div> 即自动汇总计分。
 * 注意：选项文案应保持等长，避免通过排版泄露答案。
 */
(function () {
  'use strict';

  function init() {
    var quizzes = Array.prototype.slice.call(document.querySelectorAll('.quiz'));
    if (!quizzes.length) return;

    var scoreBox = document.querySelector('.quiz-score');
    var answered = 0, correct = 0;

    // 给题目自动编号
    quizzes.forEach(function (quiz, i) {
      var q = quiz.querySelector('.quiz-q');
      if (q && !q.querySelector('.qnum')) {
        var num = document.createElement('span');
        num.className = 'qnum';
        num.textContent = String(i + 1).padStart(2, '0');
        q.insertBefore(num, q.firstChild);
      }
    });

    function renderScore() {
      if (!scoreBox) return;
      if (!answered) {
        scoreBox.innerHTML = '<span>答对 0 / ' + quizzes.length + '</span>';
        return;
      }
      scoreBox.innerHTML =
        '<span>答对 ' + correct + ' / ' + answered +
        '（共 ' + quizzes.length + ' 题）</span>' +
        '<button class="quiz-reset">重做</button>';
      scoreBox.querySelector('.quiz-reset').addEventListener('click', reset);
    }

    function reset() {
      answered = 0; correct = 0;
      quizzes.forEach(function (quiz) {
        quiz.querySelectorAll('.quiz-opt').forEach(function (b) {
          b.disabled = false;
          b.classList.remove('correct', 'wrong');
        });
        var ex = quiz.querySelector('.quiz-explain');
        if (ex) ex.classList.remove('show');
      });
      renderScore();
    }

    quizzes.forEach(function (quiz) {
      var answer = quiz.getAttribute('data-answer');
      var opts = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-opt'));

      opts.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;

          var picked = btn.getAttribute('data-opt');
          answered++;
          if (picked === answer) correct++;

          opts.forEach(function (b) {
            b.disabled = true;
            var v = b.getAttribute('data-opt');
            if (v === answer) b.classList.add('correct');
            else if (v === picked) b.classList.add('wrong');
          });

          var ex = quiz.querySelector('.quiz-explain');
          if (ex) ex.classList.add('show');

          renderScore();
        });
      });
    });

    renderScore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

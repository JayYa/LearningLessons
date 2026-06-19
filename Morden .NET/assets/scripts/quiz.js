/* ============================================================
   Quiz Helper — Morden .NET Course
   Reusable quiz interaction logic for lesson quizzes.

   Usage:
     <div class="quiz" id="q1">
       <h3>Q1. Question text</h3>
       <div class="question">Prompt:</div>
       <label><input type="radio" name="q1" value="a"> Answer A</label>
       <label><input type="radio" name="q1" value="b"> Answer B</label>
       <button onclick="Quiz.check('q1', 'b')">确认</button>
       <div class="feedback" id="f_q1"></div>
     </div>

     // Or batch mode:
     <button onclick="Quiz.checkAll({ q1:'b', q2:'c', q3:'a' })">提交全部</button>

     // With custom feedback text:
     Quiz.check('q1', 'c', {
       correct: '✅ 正确！because...',
       wrong:   '❌ 答案是 C。because...'
     });

   Conventions:
     - Quiz container: <div class="quiz" id="<qid>">
     - Radio group:    name="<qid>"
     - Feedback div:   id="f_<qid>" (preferred) or first .feedback inside #<qid>
   ============================================================ */

var Quiz = (function () {
  'use strict';

  /**
   * Find the feedback element for a given quiz ID.
   * Tries: #f_<qid>, then .feedback inside #<qid>.
   */
  function findFeedback(qid) {
    // Preferred convention: id="f_q1"
    var el = document.getElementById('f_' + qid);
    if (el) return el;
    // Fallback: first .feedback child of the quiz container
    var container = document.getElementById(qid);
    if (container) {
      return container.querySelector('.feedback');
    }
    return null;
  }

  /**
   * Show feedback on a quiz question.
   *
   * @param {string}  qid        Quiz container ID (also radio group name)
   * @param {string}  correctVal The correct radio value
   * @param {string|{correct:string, wrong:string}} correctMsg
   *        Either a correct-feedback string (with wrongMsg as 3rd arg),
   *        or an object { correct: '...', wrong: '...' }.
   * @param {string}  [wrongMsg] Wrong-feedback string (if correctMsg is a string)
   * @returns {boolean} Whether the answer was correct
   */
  function check(qid, correctVal, correctMsg, wrongMsg) {
    var fb = findFeedback(qid);
    if (!fb) {
      console.warn('Quiz: no feedback element found for ' + qid);
      return false;
    }

    var selected = document.querySelector('input[name="' + qid + '"]:checked');
    if (!selected) {
      fb.textContent = '⚠️ 请先选择一个答案。';
      fb.className = 'feedback show wrong';
      return false;
    }

    // Resolve arguments: if correctMsg is an object, unpack it
    var cMsg, wMsg;
    if (typeof correctMsg === 'object' && correctMsg !== null) {
      cMsg = correctMsg.correct;
      wMsg = correctMsg.wrong;
    } else {
      cMsg = correctMsg;
      wMsg = wrongMsg;
    }

    var isCorrect = selected.value === String(correctVal);
    fb.innerHTML = isCorrect ? cMsg : wMsg;
    fb.className = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
    return isCorrect;
  }

  /**
   * Batch-check all quiz questions.
   *
   * @param {Object} answers       { qid: correctValue, ... }
   * @param {Object} [explanations] { qid: { correct:'...', wrong:'...' }, ... }
   * @param {string} [scoreElId]    ID of score-display element (default: 'score')
   * @returns {number} Number of correct answers
   */
  function checkAll(answers, explanations, scoreElId) {
    var correct = 0;
    var total = 0;

    for (var qid in answers) {
      if (!answers.hasOwnProperty(qid)) continue;
      total++;
      var exp = explanations ? explanations[qid] : null;
      if (check(qid, answers[qid], exp || { correct: '✅ 正确！', wrong: '❌ 错误。' })) {
        correct++;
      }
    }

    var scoreEl = document.getElementById(scoreElId || 'score');
    if (scoreEl) {
      scoreEl.style.display = 'block';
      scoreEl.textContent = '得分：' + correct + ' / ' + total;
      scoreEl.style.color = correct === total ? 'var(--good)'
                         : correct >= total / 2 ? 'var(--warn)'
                         : 'var(--bad)';
    }

    return correct;
  }

  // ── Public API ──────────────────────────────────────────
  return {
    check: check,
    checkAll: checkAll,
    findFeedback: findFeedback
  };
})();

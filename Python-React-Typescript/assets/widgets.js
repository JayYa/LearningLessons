/* ============================================================
   widgets.js — 全课程共享交互控件
   无依赖，直接 <script src="../assets/widgets.js" defer></script>

   1) 测验 .quiz        —— 单选，点击立即反馈，答对/答错都展开解释
   2) 回忆 .recall      —— 先自己回想，再点开答案（retrieval practice）
   3) 步骤 .checklist   —— 可勾选，进度存 localStorage，刷新不丢

   标记约定见各初始化函数上方的注释。
   ============================================================ */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     1) 测验
     <div class="widget quiz">
       <p class="widget-kind">测验</p>
       <p class="quiz-q">题目？</p>
       <ul class="quiz-opts">
         <li><button data-correct>正确选项</button></li>
         <li><button>干扰选项</button></li>
       </ul>
       <div class="quiz-explain" hidden>解释文字</div>
     </div>
     --------------------------------------------------------- */
  function initQuiz(root) {
    const buttons = [...root.querySelectorAll('.quiz-opts button')];
    const explain = root.querySelector('.quiz-explain');

    buttons.forEach((btn) => {
      btn.classList.add('quiz-btn');
      btn.type = 'button';
      btn.addEventListener('click', () => {
        if (root.dataset.answered) return;
        root.dataset.answered = '1';

        const right = btn.hasAttribute('data-correct');
        buttons.forEach((b) => {
          b.disabled = true;
          if (b.hasAttribute('data-correct')) b.classList.add('is-right');
          else if (b === btn) b.classList.add('is-wrong');
          else b.classList.add('is-dim');
        });

        if (explain) {
          explain.hidden = false;
          const verdict = document.createElement('p');
          verdict.innerHTML = right
            ? '<strong>答对了。</strong>'
            : '<strong>答错了 —— 这是好事，错误记忆比正确猜测更牢。</strong>';
          explain.prepend(verdict);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     2) 回忆练习
     <div class="widget recall">
       <p class="widget-kind">回忆</p>
       <p class="recall-prompt">提示 / 问题</p>
       <button class="recall-btn">先出声回答，再点开</button>
       <div class="recall-answer" hidden>答案</div>
     </div>
     --------------------------------------------------------- */
  function initRecall(root) {
    const btn = root.querySelector('.recall-btn');
    const answer = root.querySelector('.recall-answer');
    if (!btn || !answer) return;
    btn.type = 'button';
    btn.addEventListener('click', () => {
      answer.hidden = !answer.hidden;
      btn.textContent = answer.hidden ? '先出声回答，再点开' : '收起';
    });
  }

  /* ---------------------------------------------------------
     3) 可勾选步骤
     <ol class="checklist" data-checklist="0001">
       <li><span class="step-title">标题</span> 正文…</li>
     </ol>
     进度写入 localStorage，key 为 teach:checklist:<data-checklist>
     --------------------------------------------------------- */
  function initChecklist(root) {
    const key = 'teach:checklist:' + (root.dataset.checklist || 'default');
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
    } catch { /* 存储被禁用或数据损坏时静默降级为未勾选 */ }

    const items = [...root.children];

    const progress = document.createElement('p');
    progress.className = 'checklist-progress';
    root.before(progress);

    const render = () => {
      const done = items.filter((li) => li.classList.contains('done')).length;
      progress.textContent = `进度 ${done} / ${items.length}`;
    };

    items.forEach((li, i) => {
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.className = 'step-box';
      box.checked = saved.includes(i);
      li.classList.toggle('done', box.checked);
      box.addEventListener('change', () => {
        li.classList.toggle('done', box.checked);
        const done = items
          .map((el, j) => (el.classList.contains('done') ? j : -1))
          .filter((j) => j >= 0);
        try { localStorage.setItem(key, JSON.stringify(done)); } catch { /* 同上 */ }
        render();
      });
      li.prepend(box);
    });

    render();
  }

  /* --------------------------------------------------------- */

  document.querySelectorAll('.quiz').forEach(initQuiz);
  document.querySelectorAll('.recall').forEach(initRecall);
  document.querySelectorAll('.checklist').forEach(initChecklist);
})();

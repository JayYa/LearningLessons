/* Reusable retrieval-practice widgets for the Docker & K8s course.
   Usage:
     <div class="quiz" data-answer="B">
       <p class="q">Question text?</p>
       <button data-opt="A">first option</button>
       ...
       <p class="why">Explanation shown after answering.</p>
     </div>

     <div class="recall"><p class="q">Prompt</p><div class="a">Hidden answer</div></div>

     <div class="typein" data-answer="docker build -t app ." data-hint="...">
       <p class="q">Prompt</p>
     </div>
*/
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function norm(s) {
    return s.toLowerCase().replace(/\s+/g, " ").trim();
  }

  ready(function () {
    /* ---- multiple choice ---- */
    document.querySelectorAll(".quiz").forEach(function (q) {
      var answer = q.dataset.answer;
      var why = q.querySelector(".why");
      if (why) why.style.display = "none";
      q.querySelectorAll("button[data-opt]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (q.dataset.done) return;
          q.dataset.done = "1";
          q.querySelectorAll("button[data-opt]").forEach(function (other) {
            other.disabled = true;
            if (other.dataset.opt === answer) other.classList.add("correct");
          });
          if (b.dataset.opt !== answer) b.classList.add("wrong");
          if (why) why.style.display = "block";
        });
      });
    });

    /* ---- free recall (flip to reveal) ---- */
    document.querySelectorAll(".recall").forEach(function (r) {
      var a = r.querySelector(".a");
      var btn = document.createElement("button");
      btn.className = "reveal";
      btn.textContent = "Show answer";
      a.style.display = "none";
      btn.addEventListener("click", function () {
        a.style.display = "block";
        btn.remove();
      });
      r.appendChild(btn);
    });

    /* ---- type the command ---- */
    document.querySelectorAll(".typein").forEach(function (t) {
      var answers = t.dataset.answer.split("|").map(norm);
      var wrap = document.createElement("div");
      wrap.className = "typein-row";
      var input = document.createElement("input");
      input.type = "text";
      input.spellcheck = false;
      input.placeholder = "type the command…";
      var btn = document.createElement("button");
      btn.className = "reveal";
      btn.textContent = "Check";
      var fb = document.createElement("p");
      fb.className = "fb";

      function check() {
        var v = norm(input.value);
        if (answers.indexOf(v) !== -1) {
          fb.className = "fb ok";
          fb.textContent = "✓ Correct.";
        } else {
          fb.className = "fb no";
          fb.textContent = "✗ Not yet. " + (t.dataset.hint || "");
        }
      }
      btn.addEventListener("click", check);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
      wrap.appendChild(input);
      wrap.appendChild(btn);
      t.appendChild(wrap);
      t.appendChild(fb);
    });
  });
})();

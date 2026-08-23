/* Reusable step-through sorting visualiser.
 *
 * Usage in a lesson:
 *   <div class="sortviz" data-algo="quicksort" data-array="[5,3,8,4,2,7,1,6]"></div>
 *   <div class="sortviz" data-algo="heapsort" data-view="tree" data-array="[3,7,1,9,4]"></div>
 *   <script src="../assets/sortviz.js"></script>
 *
 * data-algo:  insertion | quicksort | heapsort | mergesort
 * data-view:  bars (default) | tree | both
 * data-title: label shown top-left
 *
 * Design notes:
 *  - The real algorithm runs once and *records* frames as it goes, so the animation
 *    can never drift from the code printed in the lesson.
 *  - A frame is {a, roles, note, heap}. Stepping is manual by default: the learner
 *    predicts the next move, then checks. That prediction gap is the retrieval practice.
 */
(function () {

  // ---------- recorder ----------
  function Rec(a) {
    this.a = a.slice();
    this.frames = [];
  }
  Rec.prototype.snap = function (note, roles, heap) {
    this.frames.push({
      a: this.a.slice(),
      roles: roles || {},
      note: note,
      heap: (heap === undefined ? null : heap)
    });
  };
  Rec.prototype.swap = function (i, j) {
    var t = this.a[i]; this.a[i] = this.a[j]; this.a[j] = t;
  };

  // ---------- algorithms ----------
  var ALGOS = {};

  ALGOS.insertion = function (arr) {
    var r = new Rec(arr), a = r.a;
    r.snap('起点。把左边第 1 个数看成一手<b>已经理好的牌</b>，剩下的一张张往里插。', {0: 'done'});
    for (var i = 1; i < a.length; i++) {
      var v = a[i], roles = {}, d;
      for (d = 0; d < i; d++) roles[d] = 'done';
      roles[i] = 'active';
      r.snap('抽出 ' + i + ' 号位的 <b>' + v + '</b>，准备插进左边这手理好的牌。', roles);
      var j = i - 1;
      while (j >= 0 && a[j] > v) {
        a[j + 1] = a[j];
        var rr = {}; for (d = 0; d <= i; d++) rr[d] = 'done';
        rr[j] = 'scan'; rr[j + 1] = 'active';
        r.snap('<b>' + a[j] + '</b> 比 <b>' + v + '</b> 大 → 往右让一格。', rr);
        j--;
      }
      a[j + 1] = v;
      var r2 = {}; for (d = 0; d <= i; d++) r2[d] = 'done';
      r2[j + 1] = 'active';
      r.snap('空位出现在 ' + (j + 1) + ' 号，把 <b>' + v + '</b> 放进去。左边 ' + (i + 1) + ' 个又有序了。', r2);
    }
    var all = {}; for (var k = 0; k < a.length; k++) all[k] = 'done';
    r.snap('全部有序。每张牌最坏往左挪 n 步、共 n 张 → <b>O(n²)</b>。但数据本来就接近有序时几乎不挪，接近 O(n)。', all);
    return r.frames;
  };

  ALGOS.quicksort = function (arr) {
    var r = new Rec(arr), a = r.a, done = {};

    function mark(lo, hi, extra) {
      var roles = {}, i, k;
      for (i = 0; i < a.length; i++) if (i < lo || i > hi) roles[i] = done[i] ? 'done' : 'out';
      for (k in extra) roles[k] = extra[k];
      return roles;
    }

    function partition(lo, hi) {
      var pivot = a[hi], e, t;
      e = {}; e[hi] = 'pivot';
      r.snap('区间 [' + lo + '..' + hi + ']：拿<b>最后一个数 ' + pivot + '</b> 当标杆（pivot）。目标是把比它小的全赶到左边。', mark(lo, hi, e));
      var i = lo - 1;
      for (var j = lo; j < hi; j++) {
        e = {}; e[hi] = 'pivot'; e[j] = 'scan';
        for (t = lo; t <= i; t++) e[t] = 'active';
        r.snap('比一比：<b>' + a[j] + '</b> 对标杆 <b>' + pivot + '</b>。' +
          (a[j] <= pivot ? '不大于 → 它该进左边的「小值区」。' : '更大 → 原地不动。'), mark(lo, hi, e));
        if (a[j] <= pivot) {
          i++;
          if (i !== j) {
            r.swap(i, j);
            e = {}; e[hi] = 'pivot';
            for (t = lo; t <= i; t++) e[t] = 'active';
            r.snap('和小值区后面第一个位置（' + i + ' 号）交换，小值区长到 ' + (i - lo + 1) + ' 个。', mark(lo, hi, e));
          }
        }
      }
      r.swap(i + 1, hi);
      done[i + 1] = true;
      e = {}; e[i + 1] = 'done';
      r.snap('扫完了。把标杆换到小值区右边第一格 → <b>标杆落在 ' + (i + 1) + ' 号，这就是它在最终结果里的位置，从此再也不用动它</b>。', mark(lo, hi, e));
      return i + 1;
    }

    function sort(lo, hi) {
      if (lo >= hi) { if (lo === hi) done[lo] = true; return; }
      var p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }

    r.snap('起点。快排只有一个想法：<b>选一个数当标杆，小的赶到左边、大的赶到右边，然后左右两半各自再来一遍</b>。', {});
    sort(0, a.length - 1);
    var all = {}; for (var k2 = 0; k2 < a.length; k2++) all[k2] = 'done';
    r.snap('全部有序。每层把区间里的数扫一遍共 n 次比较，切到底约 log n 层 → <b>O(n log n)</b>。', all);
    return r.frames;
  };

  ALGOS.heapsort = function (arr) {
    var r = new Rec(arr), a = r.a, n = a.length;

    function roles(extra, heapSize) {
      var o = {}, i, k;
      for (i = heapSize; i < n; i++) o[i] = 'done';
      for (k in extra) o[k] = extra[k];
      return o;
    }

    function siftDown(i, size, why) {
      while (true) {
        var l = 2 * i + 1, rt = 2 * i + 2, big = i, e = {};
        if (l < size && a[l] > a[big]) big = l;
        if (rt < size && a[rt] > a[big]) big = rt;
        e[i] = 'active';
        if (l < size && !e[l]) e[l] = 'scan';
        if (rt < size && !e[rt]) e[rt] = 'scan';
        if (big === i) {
          r.snap(why + i + ' 号的 <b>' + a[i] + '</b> 已经不比孩子小，停下。', roles(e, size), size);
          return;
        }
        r.snap(why + i + ' 号的 <b>' + a[i] + '</b> 比孩子 <b>' + a[big] + '</b> 小 → 父子交换，让这个「不合格的父亲」继续往下沉。', roles(e, size), size);
        r.swap(i, big);
        i = big;
      }
    }

    r.snap('起点。先换个看法：<b>把数组当成一棵完全二叉树</b>——0 号是根，i 号的孩子是 2i+1 和 2i+2。数组一个字节都没变，只是换了个读法。', {}, n);
    for (var i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDown(i, n, '<b>建堆</b>（从最后一个当爹的节点往前逐个下沉）：');
    }
    var top = {}; top[0] = 'pivot';
    r.snap('建堆完成 → 现在它是个<b>大顶堆</b>：每个父节点都 ≥ 自己的孩子。于是<b>根 ' + a[0] + ' 一定是全场最大</b>。', roles(top, n), n);

    for (var end = n - 1; end > 0; end--) {
      var e = {}; e[0] = 'pivot'; e[end] = 'active';
      r.snap('堆顶 <b>' + a[0] + '</b> 是当前最大 → 和末尾的 <b>' + a[end] + '</b> 交换，它就此<b>就位</b>，堆的范围缩小 1。', roles(e, end + 1), end + 1);
      r.swap(0, end);
      var e2 = {}; e2[0] = 'active';
      r.snap('新的根 <b>' + a[0] + '</b> 是从末尾换上来的，多半不合格 → 让它下沉，重新把最大值顶上来。', roles(e2, end), end);
      siftDown(0, end, '<b>下沉修复</b>：');
    }
    var all = {}; for (var k = 0; k < n; k++) all[k] = 'done';
    r.snap('全部有序。取最大 O(1)、修复 O(log n)，取 n 次 → <b>O(n log n)</b>，而且<b>不需要额外内存</b>。', all, 0);
    return r.frames;
  };

  ALGOS.mergesort = function (arr) {
    var r = new Rec(arr), a = r.a, buf = a.slice();

    function mark(lo, hi, extra) {
      var o = {}, i, k;
      for (i = 0; i < a.length; i++) if (i < lo || i > hi) o[i] = 'out';
      for (k in extra) o[k] = extra[k];
      return o;
    }

    function merge(lo, mid, hi) {
      var t, e = {};
      for (t = lo; t <= hi; t++) buf[t] = a[t];
      e[lo] = 'scan'; e[mid + 1] = 'scan';
      r.snap('合并 [' + lo + '..' + mid + '] 和 [' + (mid + 1) + '..' + hi + ']：两边<b>各自已经有序</b>，所以只要反复比两边的队头，小的先出列。', mark(lo, hi, e));
      var i = lo, j = mid + 1;
      for (var k = lo; k <= hi; k++) {
        var pick, from;
        if (i > mid) { pick = buf[j++]; from = '右'; }
        else if (j > hi) { pick = buf[i++]; from = '左'; }
        else if (buf[i] <= buf[j]) { pick = buf[i++]; from = '左'; }
        else { pick = buf[j++]; from = '右'; }
        a[k] = pick;
        e = {}; e[k] = 'active';
        if (i <= mid && !e[i]) e[i] = 'scan';
        if (j <= hi && !e[j]) e[j] = 'scan';
        r.snap('两边队头里较小的是 <b>' + pick + '</b>（来自' + from + '边）→ 写进 ' + k + ' 号位。', mark(lo, hi, e));
      }
      e = {}; for (t = lo; t <= hi; t++) e[t] = 'done';
      r.snap('[' + lo + '..' + hi + '] 合并完成，整段有序。', mark(lo, hi, e));
    }

    function sort(lo, hi) {
      if (lo >= hi) return;
      var mid = lo + Math.floor((hi - lo) / 2);
      sort(lo, mid);
      sort(mid + 1, hi);
      merge(lo, mid, hi);
    }

    r.snap('起点。归并排序的想法是：<b>把两段已经有序的数据合成一段，非常容易</b>。所以先对半切到只剩一个数（一个数天然有序），再一层层合回来。', {});
    sort(0, a.length - 1);
    var all = {}; for (var k = 0; k < a.length; k++) all[k] = 'done';
    r.snap('全部有序。切 log n 层、每层合并扫 n 个 → <b>O(n log n)</b>，代价是要一块 <b>O(n) 的临时空间</b>——这正是它能改造成外部排序的原因。', all);
    return r.frames;
  };

  // ---------- rendering ----------
  function build(root) {
    var algo = root.getAttribute('data-algo');
    var view = root.getAttribute('data-view') || 'bars';
    var arr;
    try { arr = JSON.parse(root.getAttribute('data-array') || '[5,3,8,4,2,7,1,6]'); }
    catch (e) { root.textContent = 'sortviz: bad data-array'; return; }
    if (!ALGOS[algo]) { root.textContent = 'sortviz: unknown algo ' + algo; return; }

    var frames = ALGOS[algo](arr);
    var max = Math.max.apply(null, arr);
    var pos = 0, timer = null;

    var head = document.createElement('div');
    head.className = 'sv-head';
    head.innerHTML = '<span class="sv-title">' + (root.getAttribute('data-title') || algo) + '</span>' +
      '<span class="sv-counter"></span>';
    root.appendChild(head);

    var tree = null, bars = null;
    if (view === 'tree' || view === 'both') {
      tree = document.createElement('div'); tree.className = 'sv-tree'; root.appendChild(tree);
    }
    if (view === 'bars' || view === 'both') {
      bars = document.createElement('div'); bars.className = 'sv-bars'; root.appendChild(bars);
    }

    var note = document.createElement('p'); note.className = 'sv-note'; root.appendChild(note);

    var ctrl = document.createElement('div');
    ctrl.className = 'sv-ctrl';
    ctrl.innerHTML = '<button type="button" class="sv-prev">&#8249; 上一步</button>' +
      '<button type="button" class="sv-next">下一步 &#8250;</button>' +
      '<button type="button" class="sv-play">自动播放</button>' +
      '<button type="button" class="sv-reset">重来</button>' +
      '<span class="sv-legend">红=标杆/堆顶 · 黄=正在动 · 蓝=正在比 · 绿=已就位</span>';
    root.appendChild(ctrl);

    function render() {
      var f = frames[pos], i;
      head.querySelector('.sv-counter').textContent = '第 ' + (pos + 1) + ' / ' + frames.length + ' 步';
      note.innerHTML = f.note;

      if (bars) {
        bars.innerHTML = '';
        for (i = 0; i < f.a.length; i++) {
          var b = document.createElement('div');
          b.className = 'sv-bar' + (f.roles[i] ? ' r-' + f.roles[i] : '');
          b.style.height = Math.round((f.a[i] / max) * 100) + '%';
          b.innerHTML = '<span>' + f.a[i] + '</span>';
          bars.appendChild(b);
        }
      }
      if (tree) {
        tree.innerHTML = '';
        var idx = 0, width = 1;
        while (idx < f.a.length) {
          var row = document.createElement('div');
          row.className = 'sv-level';
          for (var c = 0; c < width && idx < f.a.length; c++, idx++) {
            var nd = document.createElement('span');
            nd.className = 'sv-node' + (f.roles[idx] ? ' r-' + f.roles[idx] : '');
            nd.textContent = f.a[idx];
            row.appendChild(nd);
          }
          tree.appendChild(row);
          width *= 2;
        }
      }
      ctrl.querySelector('.sv-prev').disabled = (pos === 0);
      ctrl.querySelector('.sv-next').disabled = (pos === frames.length - 1);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      ctrl.querySelector('.sv-play').textContent = '自动播放';
    }

    ctrl.querySelector('.sv-prev').onclick = function () { stop(); if (pos > 0) { pos--; render(); } };
    ctrl.querySelector('.sv-next').onclick = function () { stop(); if (pos < frames.length - 1) { pos++; render(); } };
    ctrl.querySelector('.sv-reset').onclick = function () { stop(); pos = 0; render(); };
    ctrl.querySelector('.sv-play').onclick = function () {
      if (timer) { stop(); return; }
      this.textContent = '暂停';
      timer = setInterval(function () {
        if (pos < frames.length - 1) { pos++; render(); } else { stop(); }
      }, 750);
    };

    render();
  }

  function init() {
    var nodes = document.querySelectorAll('.sortviz');
    for (var i = 0; i < nodes.length; i++) build(nodes[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

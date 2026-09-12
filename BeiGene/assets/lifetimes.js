/* Reusable DI-lifetime simulator.
 *
 * The learner picks a lifetime for each service, then fires requests one at a
 * time. For every request the widget prints the resolved object graph with
 * instance numbers, so "same instance or new instance" is *seen* per edge
 * instead of memorised per lifetime. Captive dependencies (a Scoped service
 * caught inside a Singleton) are detected and shown both ways: as the silent
 * production behaviour and as the exception ValidateScopes throws in Development.
 *
 * Usage in a lesson:
 *   <div class="lifetimes" data-lifetimes='{
 *     "label":"...",
 *     "services":[
 *       {"id":"svc","name":"OrderService","deps":["db","clock"],"default":"scoped"},
 *       {"id":"db","name":"AppDbContext","default":"scoped"},
 *       {"id":"clock","name":"Clock","default":"singleton","fixed":true}
 *     ],
 *     "roots":["svc","db"]      // what the controller constructor asks for
 *   }'></div>
 *   <script src="../assets/lifetimes.js"></script>
 *
 * Design notes:
 *  - Instance numbers are global and monotonic (#1, #2, …), never reset between
 *    requests, so a repeated number across two request columns *is* the evidence
 *    of sharing. The learner reads numbers, not lifetime names.
 *  - "roots" lists what the per-request consumer (controller) asks for. Listing a
 *    service twice (directly and via another service) is how Scoped vs Transient
 *    becomes visible within one request.
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  var LT = ['singleton', 'scoped', 'transient'];
  var LT_LABEL = { singleton: 'Singleton', scoped: 'Scoped', transient: 'Transient' };
  var RANK = { singleton: 2, scoped: 1, transient: 0 };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function build(root) {
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-lifetimes')); }
    catch (e) { root.textContent = 'Lifetimes data malformed: ' + e.message; return; }

    var byId = {};
    cfg.services.forEach(function (s) { byId[s.id] = s; });
    var lifetime = {};
    cfg.services.forEach(function (s) { lifetime[s.id] = s.default || 'scoped'; });
    var validate = true;

    var counter = 0;           // global instance counter
    var rootCache = {};        // singletons (and captives) live here
    var requests = [];         // rendered columns

    root.appendChild(el('div', 'lt-head', '<span class="label">' + (cfg.label || 'DI 生命周期模拟') + '</span>'));

    // Registration table
    var reg = el('table', 'lt-reg');
    reg.innerHTML = '<thead><tr><th>服务</th><th>依赖</th><th>注册为</th></tr></thead>';
    var tb = el('tbody');
    reg.appendChild(tb);
    root.appendChild(reg);

    var opts = el('div', 'lt-opts');
    var vlabel = el('label', 'lt-validate');
    var vbox = document.createElement('input'); vbox.type = 'checkbox'; vbox.checked = true;
    vlabel.appendChild(vbox);
    vlabel.appendChild(document.createTextNode(' 开发环境（ValidateScopes = true，Captive 直接抛异常）'));
    vbox.addEventListener('change', function () { validate = vbox.checked; reset(); });
    opts.appendChild(vlabel);
    root.appendChild(opts);

    var controls = el('div', 'lt-controls',
      '<button type="button" class="lt-fire">发一个请求 ▸</button>' +
      '<button type="button" class="lt-reset">重来（重启进程）</button>');
    root.appendChild(controls);

    var cols = el('div', 'lt-cols');
    root.appendChild(cols);

    var verdict = el('div', 'lt-verdict');
    root.appendChild(verdict);

    function paintReg() {
      tb.innerHTML = '';
      cfg.services.forEach(function (s) {
        var tr = el('tr');
        tr.appendChild(el('td', null, '<code>' + s.name + '</code>'));
        tr.appendChild(el('td', 'lt-deps', (s.deps || []).map(function (d) { return byId[d].name; }).join(', ') || '—'));
        var td = el('td');
        if (s.fixed) {
          td.appendChild(el('span', 'lt-fixed', 'Add' + LT_LABEL[lifetime[s.id]]));
        } else {
          var sel = document.createElement('select');
          sel.className = 'lt-sel';
          LT.forEach(function (k) {
            var o = document.createElement('option');
            o.value = k; o.textContent = 'Add' + LT_LABEL[k];
            if (lifetime[s.id] === k) o.selected = true;
            sel.appendChild(o);
          });
          sel.addEventListener('change', function () { lifetime[s.id] = sel.value; reset(); });
          td.appendChild(sel);
        }
        tr.appendChild(td);
        tb.appendChild(tr);
      });
    }

    // Resolve one service. fromRoot = true when we are inside a singleton
    // (the container resolves its deps from the root provider).
    function resolve(id, scope, fromRoot, parentName, out) {
      var s = byId[id], lt = lifetime[id];
      var node = { name: s.name, lt: lt, children: [], flags: [] };
      var inst;

      if (lt === 'singleton') {
        if (rootCache[id]) { inst = rootCache[id]; node.reused = true; }
        else { inst = ++counter; rootCache[id] = inst; node.fresh = true; }
        fromRoot = true;
      } else if (lt === 'scoped') {
        if (fromRoot) {
          // Captive: a scoped service being resolved by a singleton.
          if (validate) {
            throw { captive: true, service: s.name, parent: parentName };
          }
          if (rootCache[id]) { inst = rootCache[id]; node.reused = true; }
          else { inst = ++counter; rootCache[id] = inst; node.fresh = true; }
          node.flags.push('captive');
        } else if (scope[id]) { inst = scope[id]; node.reused = true; }
        else { inst = ++counter; scope[id] = inst; node.fresh = true; }
      } else { // transient
        inst = ++counter; node.fresh = true;
        if (fromRoot) node.flags.push('held');
      }
      node.inst = inst;

      // Only build children when this instance is newly constructed —
      // a reused instance keeps the dependencies it was built with.
      if (node.fresh) {
        (s.deps || []).forEach(function (d) {
          node.children.push(resolve(d, scope, fromRoot, s.name, out));
        });
        out.built[id] = node;
      } else if (out.built[id] || rootCache['__tree_' + id]) {
        node.children = (out.built[id] || rootCache['__tree_' + id]).children;
        node.inherited = true;
      }
      if (lt === 'singleton' || node.flags.indexOf('captive') >= 0) rootCache['__tree_' + id] = node;
      return node;
    }

    function renderNode(n, depth, prev) {
      var same = prev && prev[n.name] === n.inst;
      var html = '<li class="lt-node' + (n.flags.indexOf('captive') >= 0 ? ' captive' : '') + '" style="padding-left:' + (depth * 1.1) + 'rem">' +
        '<span class="lt-lt ' + n.lt + '">' + LT_LABEL[n.lt] + '</span> ' +
        '<code>' + n.name + '</code> <b class="lt-inst">#' + n.inst + '</b>' +
        (same ? ' <span class="lt-tag same">和上一个请求是同一个实例</span>' : '') +
        (n.flags.indexOf('captive') >= 0 ? ' <span class="lt-tag bad">Captive：Scoped 被 Singleton 抓住，实际成了 Singleton</span>' : '') +
        (n.flags.indexOf('held') >= 0 ? ' <span class="lt-tag warn">Transient 被 Singleton 持有，活到进程结束</span>' : '') +
        '</li>';
      n.children.forEach(function (c) { html += renderNode(c, depth + 1, prev); });
      return html;
    }

    function collect(n, map) { map[n.name] = n.inst; n.children.forEach(function (c) { collect(c, map); }); return map; }

    function fire() {
      var scope = {};
      var out = { built: {} };
      var col = el('div', 'lt-col');
      var idx = requests.length + 1;
      col.appendChild(el('div', 'lt-col-head', '请求 ' + idx + ' <span>新建一个 scope</span>'));
      var prev = requests.length ? requests[requests.length - 1].map : null;
      try {
        var trees = cfg.roots.map(function (r) { return resolve(r, scope, false, 'Controller', out); });
        var map = {};
        trees.forEach(function (t) { collect(t, map); });
        var ul = el('ul', 'lt-tree');
        ul.innerHTML = '<li class="lt-node"><code>Controller</code> <b class="lt-inst">#' + (++counter) + '</b> <span class="lt-tag">每请求新建</span></li>' +
          trees.map(function (t) { return renderNode(t, 1, prev); }).join('');
        col.appendChild(ul);
        col.appendChild(el('div', 'lt-col-foot', '请求结束 → scope 被 Dispose：这个请求里的 Scoped / Transient 实例一起释放；Singleton 留着。'));
        requests.push({ map: map });
        cols.appendChild(col);
        paintVerdict(map, prev);
      } catch (e) {
        if (!e.captive) throw e;
        col.appendChild(el('div', 'lt-exc',
          '<b>InvalidOperationException</b><br>Cannot consume scoped service <code>' + e.service +
          '</code> from singleton <code>' + e.parent + '</code>.'));
        col.appendChild(el('div', 'lt-col-foot', '这是 ValidateScopes 在<strong>第一次解析</strong>时抛的。开发环境默认开启，所以这类错误在本机第一次请求就会炸出来；生产环境默认关闭——把上面的勾去掉再发一次，看它在生产会怎样。'));
        requests.push({ map: {} });
        cols.appendChild(col);
        verdict.className = 'lt-verdict show bad';
        verdict.innerHTML = '<strong>开发环境救了你。</strong>Singleton 的构造函数要一个 Scoped 参数，容器只能从根容器解析——ValidateScopes 检测到这一点直接拒绝。修法不是改成 Singleton，是让 Singleton 拿 <code>IServiceScopeFactory</code>，在需要时 <code>CreateScope()</code> 自己开一个作用域。';
      }
    }

    function paintVerdict(map, prev) {
      if (!prev) {
        verdict.className = 'lt-verdict show wait';
        verdict.innerHTML = '<strong>第一个请求什么都看不出来。</strong>所有实例都是新的，编号都不重复。<b>再发一个请求</b>，然后对照编号：哪些变了，哪些没变。';
        return;
      }
      var same = [], diff = [], captive = false;
      Object.keys(map).forEach(function (k) {
        if (prev[k] === map[k]) same.push(k); else diff.push(k);
      });
      cfg.services.forEach(function (s) {
        if (lifetime[s.id] === 'scoped' && rootCache[s.id]) captive = true;
      });
      if (captive) {
        verdict.className = 'lt-verdict show bad';
        verdict.innerHTML = '<strong>生产环境里它不报错，只是悄悄错。</strong>那个 Scoped 服务的编号在两个请求里一样——它被 Singleton 抓住了（Captive Dependency）。如果它是 <code>DbContext</code>，后果是：所有请求共用一个 DbContext，change tracker 越来越大、并发访问抛 <code>InvalidOperationException: A second operation was started on this context</code>、一个用户的未提交更改混进另一个用户的 SaveChanges。这是 .NET 面试里最经典的 DI 事故，原文见 <a href="https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes#scoped">Service lifetimes — Scoped</a>。';
        return;
      }
      verdict.className = 'lt-verdict show good';
      verdict.innerHTML = '<strong>跨请求不变的：</strong>' + (same.length ? same.map(function (k) { return '<code>' + k + '</code>'; }).join('、') : '没有') +
        '　<strong>每个请求都换新的：</strong>' + (diff.length ? diff.map(function (k) { return '<code>' + k + '</code>'; }).join('、') : '没有') +
        '<br>再看<strong>同一个请求里</strong>出现两次的服务：Scoped 两处编号相同（一个请求一份），Transient 两处编号不同（每次要都 new）。这两条加起来就是三种生命周期的全部定义。';
    }

    function reset() {
      counter = 0; rootCache = {}; requests = [];
      cols.innerHTML = ''; verdict.className = 'lt-verdict'; verdict.innerHTML = '';
    }

    controls.querySelector('.lt-fire').addEventListener('click', fire);
    controls.querySelector('.lt-reset').addEventListener('click', reset);

    paintReg();
  }

  function init() { document.querySelectorAll('.lifetimes[data-lifetimes]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

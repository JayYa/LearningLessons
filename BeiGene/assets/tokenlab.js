/* Reusable JWT lab: issue → tamper → expire → revoke, with a server whose checks you can toggle.
 *
 * Usage in a lesson:
 *   <div class="tokenlab" data-tokenlab='{
 *     "label": "...",
 *     "secret": "server-secret",
 *     "ttlMinutes": 15,
 *     "claims": {"sub":"u1001","name":"...","role":"reviewer"},
 *     "checks": [ {"id":"deny","label":"查 jti 黑名单","on":false},
 *                 {"id":"ver","label":"比对用户 token 版本","on":false} ],
 *     "scenarios": [ {"title":"...","steps":["...","..."],"guess":"..."} ]
 *   }'></div>
 *   <script src="../assets/tokenlab.js"></script>
 *
 * Design notes:
 *  - Two columns: 客户端 holds one token and can edit its payload (but has no server secret);
 *    服务器 holds the secret, a clock, a denylist, a per-user version, and a list of checks.
 *  - Every request shows the verification chain in order (签名 → exp → 黑名单 → 版本) so the
 *    learner sees WHICH check caught it, and which checks were skipped because they are off.
 *  - The signature is a demo hash (FNV-1a over header.payload + secret), not HMAC-SHA256.
 *    The property that matters for teaching is preserved: any change to payload or secret
 *    changes the signature, and the client cannot recompute it without the secret.
 *  - Nothing is automated. The scenario list only tells the learner what to click, so that the
 *    pause before clicking is a retrieval act (guess the status code first).
 *  - Avoid apostrophes inside the JSON; the attribute is single-quoted.
 */
(function () {
  function b64url(str) {
    var bytes = unescape(encodeURIComponent(str));
    return btoa(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return decodeURIComponent(escape(atob(s)));
  }
  function fnv(str, seed) {
    var h = seed >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('00000000' + h.toString(16)).slice(-8);
  }
  function sign(headerB64, payloadB64, secret) {
    var input = headerB64 + '.' + payloadB64 + '|' + secret;
    return fnv(input, 2166136261) + fnv(input, 0x9747b28c);
  }
  function fmt(min) { return 'T+' + min + 'min'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var data;
    try { data = JSON.parse(root.getAttribute('data-tokenlab')); }
    catch (e) { root.textContent = 'Tokenlab data malformed: ' + e.message; return; }

    var HEADER = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    var server = {
      secret: data.secret || 'server-secret',
      now: 0,                               // minutes since lesson start
      denylist: {},                         // jti -> exp
      version: {},                          // sub -> int
      ttl: data.ttlMinutes || 15,
      checks: {},
      issued: 0,
      requests: 0
    };
    (data.checks || []).forEach(function (c) { server.checks[c.id] = !!c.on; });
    var subject = (data.claims && data.claims.sub) || 'u1';
    server.version[subject] = 1;

    var client = { token: null };           // the single token the client holds

    // ---------- skeleton ----------
    root.innerHTML =
      '<div class="tl-head"><span class="label">' + esc(data.label || 'Token 实验室') + '</span>' +
      '<span class="tl-clock"></span></div>' +
      '<div class="tl-cols">' +
        '<div class="tl-col tl-client"><h4>客户端（浏览器 / App）</h4>' +
          '<p class="tl-legend">token = <span class="h">header</span>.<span class="p">payload</span>.<span class="s">signature</span>（base64url，可解码，签名部分是演示哈希）</p>' +
          '<div class="tl-token empty">还没有 token。先在右边登录。</div>' +
          '<textarea class="tl-payload" spellcheck="false" disabled></textarea>' +
          '<div class="tl-row">' +
            '<button class="tl-btn tl-tamper" disabled>① 篡改：把改过的 payload 塞回 token（签名不动）</button>' +
          '</div>' +
          '<div class="tl-row">' +
            '<label>客户端猜的密钥 <input type="text" class="tl-guess" value="guess123"></label>' +
            '<button class="tl-btn tl-resign" disabled>② 用猜的密钥重签</button>' +
          '</div>' +
          '<div class="tl-row"><button class="tl-btn primary tl-send" disabled>③ 发请求 GET /tickets（带 Authorization: Bearer）</button></div>' +
        '</div>' +
        '<div class="tl-col tl-server"><h4>服务器</h4>' +
          '<div class="tl-state"></div>' +
          '<div class="tl-row">' +
            '<button class="tl-btn tl-login">登录（签发 token）</button>' +
            '<button class="tl-btn tl-tick" data-min="5">时间 +5 min</button>' +
            '<button class="tl-btn tl-tick" data-min="20">时间 +20 min</button>' +
          '</div>' +
          '<div class="tl-row"><button class="tl-btn danger tl-revoke" disabled>注销 / 撤销这个 token</button></div>' +
          '<ul class="tl-checks">' +
            '<li class="fixed"><input type="checkbox" checked disabled>验签（永远做）</li>' +
            '<li class="fixed"><input type="checkbox" checked disabled>检查 exp（永远做）</li>' +
            (data.checks || []).map(function (c) {
              return '<li><input type="checkbox" data-check="' + esc(c.id) + '"' + (c.on ? ' checked' : '') + '>' + esc(c.label) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="tl-log"><h4>请求日志（状态码 · 验证链）</h4><ol></ol><p class="empty">还没有请求。</p></div>' +
      (data.scenarios && data.scenarios.length ?
        '<div class="tl-scen"><h4>照着做，每步先猜状态码</h4><ol class="outer">' +
          data.scenarios.map(function (s) {
            return '<li><strong>' + esc(s.title) + '</strong>' +
              '<ol class="inner">' + s.steps.map(function (st) { return '<li>' + st + '</li>'; }).join('') + '</ol>' +
              (s.guess ? '<span class="guess">先猜：' + esc(s.guess) + '</span>' : '') + '</li>';
          }).join('') + '</ol></div>' : '');

    var q = function (sel) { return root.querySelector(sel); };
    var clockEl = q('.tl-clock'), tokenEl = q('.tl-token'), payloadEl = q('.tl-payload'),
        tamperBtn = q('.tl-tamper'), resignBtn = q('.tl-resign'), sendBtn = q('.tl-send'),
        guessEl = q('.tl-guess'), stateEl = q('.tl-state'), loginBtn = q('.tl-login'),
        revokeBtn = q('.tl-revoke'), logOl = q('.tl-log ol'), logEmpty = q('.tl-log .empty');

    // ---------- rendering ----------
    function paintClock() { clockEl.textContent = '服务器时钟 ' + fmt(server.now); }
    function paintState() {
      var deny = Object.keys(server.denylist);
      stateEl.innerHTML =
        '密钥 <b>' + esc(server.secret) + '</b>（客户端看不到）<br>' +
        '用户 ' + esc(subject) + ' 的 token 版本 <b>' + server.version[subject] + '</b><br>' +
        'jti 黑名单 <b>' + (deny.length ? deny.map(function (j) { return j + '(到 ' + fmt(server.denylist[j]) + ')'; }).join(', ') : '空') + '</b>';
    }
    function paintToken() {
      if (!client.token) {
        tokenEl.className = 'tl-token empty'; tokenEl.textContent = '还没有 token。先在右边登录。';
        payloadEl.value = ''; payloadEl.disabled = true;
        tamperBtn.disabled = resignBtn.disabled = sendBtn.disabled = revokeBtn.disabled = true;
        return;
      }
      var p = client.token.split('.');
      tokenEl.className = 'tl-token';
      tokenEl.innerHTML = '<span class="h">' + p[0] + '</span><span class="dot">.</span><span class="p">' + p[1] + '</span><span class="dot">.</span><span class="s">' + p[2] + '</span>';
      payloadEl.disabled = false;
      tamperBtn.disabled = resignBtn.disabled = sendBtn.disabled = revokeBtn.disabled = false;
    }
    function setPayloadText(obj) { payloadEl.value = JSON.stringify(obj, null, 2); }

    // ---------- server side ----------
    function issue() {
      server.issued++;
      var claims = {};
      Object.keys(data.claims || {}).forEach(function (k) { claims[k] = data.claims[k]; });
      claims.iat = server.now;
      claims.exp = server.now + server.ttl;
      claims.jti = 'j' + server.issued;
      claims.ver = server.version[subject];
      var pb = b64url(JSON.stringify(claims));
      client.token = HEADER + '.' + pb + '.' + sign(HEADER, pb, server.secret);
      setPayloadText(claims);
      paintToken(); paintState();
      addLog(null, '登录成功，签发 ' + claims.jti + '（exp = ' + fmt(claims.exp) + '，ver = ' + claims.ver + '）', '');
    }
    function revoke() {
      if (!client.token) return;
      var p = client.token.split('.');
      var claims; try { claims = JSON.parse(unb64url(p[1])); } catch (e) { claims = {}; }
      if (claims.jti) server.denylist[claims.jti] = claims.exp == null ? server.now + server.ttl : claims.exp;
      server.version[subject] = server.version[subject] + 1;
      paintState();
      addLog(null, '服务器：' + (claims.jti || '?') + ' 进黑名单；用户 ' + subject + ' 的版本升到 ' + server.version[subject] + '。<br><em>注意：客户端手里那串字符串一个字都没变。</em>', '');
    }
    function verify(token) {
      var chain = [], claims = null, fail = null;
      var p = (token || '').split('.');
      if (p.length !== 3) return { ok: false, chain: [['格式', 'fail', '不是三段']], claims: null };
      var expected = sign(p[0], p[1], server.secret);
      if (p[2] !== expected) { chain.push(['签名', 'fail', '和服务器用自己密钥算出的不一致']); return { ok: false, chain: chain, claims: null }; }
      chain.push(['签名', 'pass', '']);
      try { claims = JSON.parse(unb64url(p[1])); } catch (e) { chain.push(['payload', 'fail', '不是合法 JSON']); return { ok: false, chain: chain, claims: null }; }
      if (typeof claims.exp !== 'number' || claims.exp <= server.now) { chain.push(['exp', 'fail', '已过期（exp ' + (claims.exp == null ? '缺失' : fmt(claims.exp)) + ' ≤ 现在 ' + fmt(server.now) + '）']); return { ok: false, chain: chain, claims: claims }; }
      chain.push(['exp', 'pass', '']);
      if (server.checks.deny) {
        if (claims.jti && server.denylist[claims.jti] != null) { chain.push(['黑名单', 'fail', claims.jti + ' 已被撤销']); return { ok: false, chain: chain, claims: claims }; }
        chain.push(['黑名单', 'pass', '']);
      } else chain.push(['黑名单', 'skip', '未检查']);
      if (server.checks.ver) {
        var cur = server.version[claims.sub];
        if (cur == null || claims.ver !== cur) { chain.push(['版本', 'fail', 'token 版本 ' + claims.ver + ' ≠ 当前 ' + cur]); return { ok: false, chain: chain, claims: claims }; }
        chain.push(['版本', 'pass', '']);
      } else chain.push(['版本', 'skip', '未检查']);
      return { ok: true, chain: chain, claims: claims };
    }

    // ---------- log ----------
    function addLog(status, text, chainHtml) {
      logEmpty.style.display = 'none';
      var li = document.createElement('li');
      if (status == null) {
        li.innerHTML = '<span class="code">—</span> ' + text;
      } else {
        li.className = status === 200 ? 'ok' : 'no';
        li.innerHTML = '<span class="code">' + status + '</span> ' + chainHtml + '<span class="note">' + text + '</span>';
      }
      logOl.appendChild(li);
      li.scrollIntoView({ block: 'nearest' });
    }
    function chainToHtml(chain) {
      return '<span class="chain">' + chain.map(function (c) {
        var cls = c[1];
        var mark = cls === 'pass' ? '✓' : cls === 'fail' ? '✗' : '–';
        return '<span class="' + cls + '">' + c[0] + ' ' + mark + (c[2] ? '（' + esc(c[2]) + '）' : '') + '</span>';
      }).join(' → ') + '</span>';
    }

    // ---------- client actions ----------
    function tamper() {
      var obj; try { obj = JSON.parse(payloadEl.value); } catch (e) { alert('payload 不是合法 JSON：' + e.message); return; }
      var p = client.token.split('.');
      client.token = p[0] + '.' + b64url(JSON.stringify(obj)) + '.' + p[2];
      paintToken();
      addLog(null, '客户端改了 payload 并重新 base64url 编码；签名沿用旧的（没有密钥，算不出新的）。', '');
    }
    function resign() {
      var obj; try { obj = JSON.parse(payloadEl.value); } catch (e) { alert('payload 不是合法 JSON：' + e.message); return; }
      var pb = b64url(JSON.stringify(obj));
      client.token = HEADER + '.' + pb + '.' + sign(HEADER, pb, guessEl.value);
      paintToken();
      addLog(null, '客户端用猜的密钥「' + esc(guessEl.value) + '」重签。' + (guessEl.value === server.secret ? '<strong>猜中了服务器密钥——这就是密钥泄露。</strong>' : ''), '');
    }
    function send() {
      server.requests++;
      var r = verify(client.token);
      var status = r.ok ? 200 : 401;
      var text = r.ok
        ? '请求 #' + server.requests + '：服务器把 payload 里的 claims 装成 <code>HttpContext.User</code>（sub=' + esc(r.claims.sub) + ', role=' + esc(r.claims.role) + '），交给授权。'
        : '请求 #' + server.requests + '：认证失败，Challenge → 401，带 <code>WWW-Authenticate: Bearer</code>。';
      addLog(status, text, chainToHtml(r.chain));
    }

    // ---------- wiring ----------
    loginBtn.addEventListener('click', issue);
    revokeBtn.addEventListener('click', revoke);
    tamperBtn.addEventListener('click', tamper);
    resignBtn.addEventListener('click', resign);
    sendBtn.addEventListener('click', send);
    Array.prototype.forEach.call(root.querySelectorAll('.tl-tick'), function (b) {
      b.addEventListener('click', function () {
        server.now += parseInt(b.getAttribute('data-min'), 10);
        Object.keys(server.denylist).forEach(function (j) { if (server.denylist[j] <= server.now) delete server.denylist[j]; });
        paintClock(); paintState();
        addLog(null, '时钟拨到 ' + fmt(server.now) + '。已过期的黑名单条目自动清掉（它们对应的 token 反正过不了 exp）。', '');
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll('input[data-check]'), function (cb) {
      cb.addEventListener('change', function () {
        server.checks[cb.getAttribute('data-check')] = cb.checked;
        addLog(null, '服务器开关：' + esc(cb.parentNode.textContent.trim()) + ' → ' + (cb.checked ? '开' : '关'), '');
      });
    });

    paintClock(); paintState(); paintToken();
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.tokenlab[data-tokenlab]'), build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Tương tác của trang. Chữ hiển thị lấy từ #page-data (đúng ngôn ngữ của trang, do CMS quản lý). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = {};
  try { D = JSON.parse(document.getElementById('page-data').textContent) || {}; } catch (e) {}
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fill(tpl, v) { return String(tpl || '').replace(/\{(\w+)\}/g, function (_, k) { return v[k] != null ? v[k] : ''; }); }

  // ---------- giao diện sáng / tối
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---------- menu ngôn ngữ (liên kết sang /, /en/, /ja/)
  var lb = document.querySelector('.lang-btn'), lm = document.querySelector('.lang-menu');
  function lmOpen(o) {
    lm.hidden = !o; lb.setAttribute('aria-expanded', o ? 'true' : 'false');
    if (o) { var c = lm.querySelector('[aria-current="page"]') || lm.querySelector('a'); if (c) c.focus(); }
  }
  if (lb && lm) {
    lb.addEventListener('click', function (e) { e.stopPropagation(); lmOpen(lm.hidden); });
    document.addEventListener('click', function (e) { if (!lm.hidden && !e.target.closest('.lang-dd')) lmOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lm.hidden) { lmOpen(false); lb.focus(); } });
    lm.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var it = $$('a', lm), i = it.indexOf(document.activeElement);
      it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus();
    });
  }

  // ---------- tiến trình cuộn + header
  var prog = document.querySelector('.scroll-prog'), nav = document.querySelector('header.nav'), tick = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    if (nav) nav.classList.toggle('scrolled', scrollY > 10);
    tick = false;
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ---------- link đang xem
  var links = $$('.links a');
  var navIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) navIO.observe(s); });

  // ---------- xuất hiện khi cuộn (so le theo nhóm anh em) + đếm số
  ['.section-head', '.sol', '.core', '.pb-head', '.pb-cons>div', '.pb-row', '.calc-in', '.calc-out', '.two>.card', '.mock', '.cta-band',
    '.steps', '.done>*', '.ctrl>.card', '.faq', '.contact'].forEach(function (sel) {
    var count = new Map();
    $$(sel).forEach(function (el) {
      var p = el.parentNode, n = count.get(p) || 0; count.set(p, n + 1);
      el.classList.add('rv'); el.style.setProperty('--d', (n * .09) + 's');
    });
  });
  $$('.days').forEach(function (c) { c.classList.add('seq'); $$(':scope>*', c).forEach(function (k, i) { k.style.setProperty('--i', i); }); });
  $$('.st').forEach(function (s, i) { s.style.setProperty('--i', i); });
  function countUp(b) {
    var txt = b.textContent, m = txt.match(/\d[\d.,]*/); if (!m) return;
    var raw = m[0], sep = /[.,]/.test(raw) ? raw.match(/[.,]/)[0] : '', n = parseInt(raw.replace(/[.,]/g, ''), 10);
    var pre = txt.slice(0, m.index), post = txt.slice(m.index + raw.length), t0 = null;
    function fmt(v) { var s = String(v); return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s; }
    function f(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 700, 1); b.textContent = pre + fmt(Math.round(n * (1 - Math.pow(1 - p, 3)))) + post; if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; el.classList.add('in'); io.unobserve(el);
      if (el.classList.contains('stats') && !reduce) $$('.stat b', el).forEach(countUp);
    });
  }, { threshold: 0, rootMargin: '0px' });
  $$('.rv,.seq,.stats').forEach(function (el) { io.observe(el); });

  // ---------- form để lại liên hệ
  var F = D.form || {};
  var lead = document.getElementById('lead');
  function selectInterest(v) { var r = lead && $$('input[name="need"]', lead).filter(function (x) { return x.value === v; })[0]; if (r) r.checked = true; }
  if (lead) {
    var btn = lead.querySelector('.lead-btn'), status = lead.querySelector('.lead-status'), done = document.querySelector('.lead-done');
    $$('.fld', lead).forEach(function (f, i) { f.style.animationDelay = (.25 + i * .06) + 's'; });
    btn.style.animationDelay = '.6s';
    var rules = {
      name: function (v) { return v ? '' : F.err_name; },
      company: function (v) { return v ? '' : F.err_company; },
      email: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : F.err_email; },
      phone: function (v) { return !v ? F.err_phone : (/^[+()\d\s.-]{8,20}$/.test(v) ? '' : F.err_phone_invalid); }
    };
    function check(el) {
      var r = rules[el.name]; if (!r) return true;
      var msg = r(el.value.trim()) || '', f = el.closest('.fld');
      f.classList.remove('err'); void f.offsetWidth; if (msg) f.classList.add('err');
      f.querySelector('small').textContent = msg;
      return !msg;
    }
    $$('input,textarea', lead).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { var f = el.closest('.fld'); if (f && f.classList.contains('err')) check(el); });
    });
    function finish(msg) { if (msg) document.getElementById('leadDoneMsg').textContent = msg; lead.hidden = true; done.hidden = false; }
    lead.addEventListener('submit', function (e) {
      e.preventDefault(); status.textContent = '';
      var bad = $$('input[name]:not([type=radio]),textarea', lead).filter(function (el) { return el.name !== 'website' && !check(el); });
      if (bad.length) { bad[0].focus(); return; }
      if (lead.website.value) return; // bot
      var data = {}; new FormData(lead).forEach(function (v, k) { if (k !== 'website') data[k] = String(v).trim(); });
      data.source = location.href; data.locale = D.locale;
      var endpoint = lead.getAttribute('data-endpoint');
      if (!endpoint) {
        var body = 'Họ tên: ' + data.name + '\nCông ty: ' + data.company + '\nĐiện thoại: ' + data.phone + '\nEmail: ' + (data.email || '-') +
          '\nLĩnh vực quan tâm: ' + (data.need || '-') + '\nƯớc tính chi phí ẩn: ' + (data.estimate || '-') + '\nNgôn ngữ trang: ' + data.locale;
        location.href = 'mailto:' + (D.email || '') + '?subject=' + encodeURIComponent('[Pythera] Yêu cầu tư vấn từ ' + data.company) + '&body=' + encodeURIComponent(body);
        finish(F.mailto_opened); return;
      }
      btn.disabled = true; btn.firstChild.textContent = F.sending_label;
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw 0; finish(); })
        .catch(function () { status.innerHTML = F.send_failed; })
        .then(function () { btn.disabled = false; btn.firstChild.textContent = F.submit_label; });
    });
  }
  // card lĩnh vực chọn sẵn lựa chọn trong form
  $$('[data-need]').forEach(function (a) { a.addEventListener('click', function () { selectInterest(a.getAttribute('data-need')); }); });

  // ---------- hero phân luồng theo loại hình đơn vị
  var H = D.hero || {}, auds = H.audiences || [], sols = $$('.sol[data-key]');
  function renderAud(key, swap) {
    var a = auds.filter(function (x) { return x.key === key; })[0]; if (!a) return;
    var hH = document.getElementById('heroH'), hL = document.getElementById('heroL');
    if (hH) hH.textContent = a.title;
    if (hL) hL.textContent = a.lead;
    if (swap) [hH, hL].forEach(function (e) { if (!e) return; e.classList.remove('swap'); void e.offsetWidth; e.classList.add('swap'); });
    $$('.aud [data-aud]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-aud') === key ? 'true' : 'false'); });
    $$('.hero-vis').forEach(function (v) { v.hidden = v.getAttribute('data-aud') !== key; });
    sols.forEach(function (s) { s.classList.toggle('match', (a.sectors || []).indexOf(s.getAttribute('data-key')) > -1); });
  }
  $$('.aud [data-aud]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-aud'); renderAud(k, true);
      var a = auds.filter(function (x) { return x.key === k; })[0]; if (a) selectInterest(a.interest);
    });
  });
  if (auds.length) renderAud(auds[0].key, false);

  // ---------- khung trước / sau ở hero
  var ba = document.querySelector('.ba'), BA = H.ba;
  if (ba && BA && BA.tabs && BA.tabs.length) {
    var tabs = $$('.seg button', ba), sw = document.getElementById('baSw'), list = document.getElementById('baList'),
      outEl = document.getElementById('baOut'), stateEl = document.getElementById('baState'), cur = 0, touched = false;
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    function render() {
      var d = BA.tabs[cur], on = sw.checked, items = (on ? d.after : d.before) || [];
      ba.classList.toggle('after', on);
      stateEl.textContent = on ? BA.state_after : BA.state_before;
      list.innerHTML = items.map(function (t, i) { return '<li style="--i:' + i + '"' + (!on && i === items.length - 1 ? ' class="bad"' : '') + '>' + esc(t) + '</li>'; }).join('');
      outEl.innerHTML = on ? '<b>' + esc(d.after_badge || '') + '</b> · ' + esc(d.after_out || '') : esc(d.before_out || '');
      outEl.style.animation = 'none'; void outEl.offsetWidth; outEl.style.animation = '';
    }
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        touched = true; cur = +b.getAttribute('data-k');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        render();
      });
    });
    sw.addEventListener('change', function () { touched = true; render(); });
    render();
    setTimeout(function () { if (!touched) { sw.checked = true; render(); } }, 1600);
  }

  // ---------- máy tính chi phí ẩn
  var C = D.calc || {}, cP = document.getElementById('cPeople');
  if (cP) {
    var cH = document.getElementById('cHours'), cR = document.getElementById('cRate'), cA = document.getElementById('cAuto'), est = document.getElementById('leadEstimate');
    var sep = C.thousands_sep || '.';
    function fn(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
    function vn(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
    function calc() {
      var p = +cP.value, h = +cH.value, r = +cR.value, au = +cA.value;
      var hours = p * h * 48, days = hours / 8, money = hours * r / 1000, gh = hours * au / 100, gm = money * au / 100;
      set('oPeople', fill(C.fmt_people, { n: p }));
      set('oHours', fill(C.fmt_hours, { n: h }));
      set('oRate', fill(C.fmt_rate, { n: fn(r * 1000) }));
      set('oAuto', au + '%');
      set('rHours', fn(hours)); set('rDays', fn(days)); set('rMoney', fn(money));
      set('rGain', fill(C.fmt_gain, { h: fn(gh), m: fn(gm) }));
      set('rFormula', fill(C.fmt_formula, { p: p, h: h }));
      if (est) est.value = p + ' người × ' + h + ' giờ/tuần ≈ ' + vn(hours) + ' giờ/năm ≈ ' + vn(money) + ' triệu đồng/năm; tự động hoá ' + au + '% ≈ lấy lại ' + vn(gh) + ' giờ/năm';
    }
    [cP, cH, cR, cA].forEach(function (i) { i.addEventListener('input', calc); });
    calc();
  }
})();

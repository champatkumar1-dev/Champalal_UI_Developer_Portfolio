(function () {
    const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const nav = $('#nav'), top = $('#top'), bar = $('#progress'), burger = $('#burger'), menu = $('#menu');
    $('#yr').textContent = new Date().getFullYear();
    function onScroll() {
        const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
        nav.classList.toggle('stuck', y > 40); top.classList.toggle('show', y > 500); bar.style.width = (h > 0 ? y / h * 100 : 0) + '%'
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    burger.onclick = () => { burger.classList.toggle('open'); menu.classList.toggle('open') };
    $$('#menu a').forEach(a => a.onclick = () => { burger.classList.remove('open'); menu.classList.remove('open') });
    top.onclick = e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }) };
    // reveal + skill bars + counters
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; const t = e.target; t.classList.add('in');
        $$('[data-w]', t).forEach(i => i.style.width = i.dataset.w + '%');
        $$('[data-count]', t).forEach(c => { const to = +c.dataset.count; let n = 0; const st = Math.max(1, Math.ceil(to / 50)); const iv = setInterval(() => { n = Math.min(to, n + st); c.textContent = n; if (n >= to) clearInterval(iv) }, 30) });
        io.unobserve(t)
    }), { threshold: .15 });
    $$('.reveal').forEach(el => io.observe(el));
    // typing
    const ty = $('#typed'); if (ty) {
        const w = ['UI/UX Designer', 'Front-End Developer', 'Web Designer', 'Shopify Expert', 'Freelancer']; let i = 0, j = 0, del = false;
        (function tick() {
            const s = w[i]; ty.textContent = s.slice(0, j); if (!del && j === s.length) { del = true; return setTimeout(tick, 1400) }
            if (del && j === 0) { del = false; i = (i + 1) % w.length } j += del ? -1 : 1; setTimeout(tick, del ? 45 : 90)
        })()
    }
    // portfolio filter
    const fb = $$('.filters button'); fb.forEach(b => b.onclick = () => {
        fb.forEach(x => x.classList.remove('active')); b.classList.add('active');
        $$('#grid .pcard').forEach(c => { const ok = b.dataset.f === 'all' || c.dataset.cat === b.dataset.f; c.classList.toggle('hide', !ok); if (ok) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')) } })
    });
    // contact form -> opens email app (no backend needed)
    const f = $('#cform'); if (f) f.onsubmit = e => {
        e.preventDefault(); const d = new FormData(f);
        const body = `Name: ${d.get('name')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')}\n\n${d.get('msg')}`;
        location.href = `mailto:champatkumar1@gmail.com?subject=${encodeURIComponent(d.get('subject'))}&body=${encodeURIComponent(body)}`;
        $('#fmsg').textContent = 'Opening your email app… you can also WhatsApp me directly!'
    };
})();
(function () {
    const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 350)); setTimeout(() => $('#loader') && $('#loader').classList.add('done'), 2500);
    // split hero name
    $$('.split').forEach(el => { const t = el.textContent; el.textContent = '';[...t].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i); s.textContent = c === ' ' ? '\u00a0' : c; el.appendChild(s) }) });
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (fine) {
        const d = $('#cur-dot'), r = $('#cur-ring'); let x = 0, y = 0, rx = 0, ry = 0; document.body.classList.add('cur-on');
        addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px,${y}px)` });
        (function l() { rx += (x - rx) * .15; ry += (y - ry) * .15; r.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(l) })();
        addEventListener('mousedown', () => r.classList.add('down')); addEventListener('mouseup', () => r.classList.remove('down'));
        document.addEventListener('mouseover', e => { r.classList.toggle('hov', !!e.target.closest('a,button,input,textarea,select,.pcard,.svc')) });
        // 3D tilt + spotlight
        document.addEventListener('mousemove', e => {
            const c = e.target.closest('.pcard,.svc,.step'); if (!c) return; const b = c.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
            c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%'); if (!c.classList.contains('step')) { c.classList.add('tilt'); c.style.transform = `perspective(800px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg) translateY(-6px)` }
        });
        document.addEventListener('mouseout', e => { const c = e.target.closest('.pcard,.svc'); if (c && !c.contains(e.relatedTarget)) { c.style.transform = ''; c.classList.remove('tilt') } });
        // magnetic buttons
        $$('.btn,.fab,.brand').forEach(b => { b.classList.add('mag'); b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)` }); b.addEventListener('mouseleave', () => b.style.transform = '') })
    }
    // parallax blobs + hero photo on scroll
    addEventListener('scroll', () => { const y = scrollY; $$('.blob').forEach((b, i) => b.style.translate = `0 ${y * (i ? -.12 : .15)}px`); const p = $('.hero .photo'); if (p && y < 900) p.style.translate = `0 ${y * .06}px` }, { passive: true });
    // enquiry modal
    const m = $('#modal'), open = () => m.classList.add('open'), close = () => m.classList.remove('open');
    $('#enqBtn').onclick = open; $('#mClose').onclick = close; m.onclick = e => { if (e.target === m) close() }; addEventListener('keydown', e => { if (e.key === 'Escape') close() });
    $('#eform').onsubmit = e => {
        e.preventDefault(); const d = new FormData(e.target); const t = `Name: ${d.get('name')}\nPhone: ${d.get('phone')}\nService: ${d.get('svc')}\n\n${d.get('msg')}`;
        window.open(`https://wa.me/918290438145?text=${encodeURIComponent('New Enquiry\n' + t)}`, '_blank'); close(); e.target.reset()
    };
    // page transition on internal links
    $$('a[href$=".html"]').forEach(a => a.addEventListener('click', e => { if (e.ctrlKey || e.metaKey || a.target) return; e.preventDefault(); document.body.style.transition = 'opacity .3s'; document.body.style.opacity = 0; setTimeout(() => location.href = a.href, 300) }));
    addEventListener('pageshow', e => { if (e.persisted) document.body.style.opacity = 1 });
})();
(function () {
    const ids = ['home', 'about', 'resume', 'contact'], links = {};
    document.querySelectorAll('#menu a[href^="index.html#"]').forEach(a => links[a.hash.slice(1)] = a);
    if (!document.getElementById('home')) return;
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { Object.values(links).forEach(a => a.classList.remove('active')); const k = e.target.id; links[k] && links[k].classList.add('active') } }), { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'about', 'skills', 'resume', 'contact'].forEach(i => { const el = document.getElementById(i); el && so.observe(el) });
})();
(function () {
    const b = [...document.querySelectorAll('.stabs button')]; if (!b.length) return;
    b.forEach(x => x.onclick = () => {
        b.forEach(y => y.classList.remove('active')); x.classList.add('active');
        document.querySelectorAll('.skc').forEach(c => {
            const ok = x.dataset.s === 'all' || c.dataset.g === x.dataset.s; c.classList.toggle('hide', !ok);
            if (ok) { c.classList.add('in'); c.querySelectorAll('[data-w]').forEach(i => i.style.width = i.dataset.w + '%') }
        })
    })
})();

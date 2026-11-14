(function () {
  var ID = 'nl-badge-frame';
  function hide() {
    var f = document.getElementById(ID);
    if (f) { f.style.setProperty('display', 'none', 'important'); f.remove(); }
  }
  hide();
  new MutationObserver(hide).observe(document.documentElement, { childList: true, subtree: true });
})();


/*
  GALERIJA: ovde dodaješ slike, koliko god ih ima.
  src = putanja do slike (npr. "assets/galerija/01.jpg"), alt = kratak opis.
  Prvih 5 se prikazuju u mreži na računaru, sve ostale se vide u lightbox-u.
  Dok je src prazan, prikazuje se placeholder.
*/
var GALLERY = [
  { src: "assets/galerija/12.jpg", alt: "Uvodna reč na Investicionoj akademiji" },
  { src: "assets/galerija/01.jpg", alt: "Naša delegacija kao gost na konferenciji Vlade Đukanovića" },
  { src: "assets/galerija/03.jpg", alt: "Pokloni naših sponzora za pobednike takmičenja na Investicionoj akademiji" },
  { src: "assets/galerija/04.jpg", alt: "Atmosfera pred početak Investicione akademije" },
  { src: "assets/galerija/05.jpg", alt: "Pokloni za naše goste iz Eclectica Capitala, Nikolu Stakića i Ognjena Kapora" },
  { src: "assets/galerija/02.jpg", alt: "Predavanje osnivača Ličnih finansija Đorđa Ostojića na Investicionoj akademiji" },
  { src: "assets/galerija/06.jpg", alt: "Naš gost iznenađenja Ilija Protić, CFA" },
  { src: "assets/galerija/07.jpg", alt: "Naš predsednik u poseti Njujorku" },
  { src: "assets/galerija/08.jpg", alt: "Atmosfera na Investicionoj akademiji" },
  { src: "assets/galerija/09.jpg", alt: "Osveženje za učesnike Investicione akademije" },
  { src: "assets/galerija/10.jpg", alt: "Svečano zatvaranje Investicione akademije" },
  { src: "assets/galerija/11.jpg", alt: "Registracija učesnika Investicione akademije" }
];

(function(){
  /* Premium Scroll Reveal animacije */
  document.addEventListener("DOMContentLoaded", function() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  });

  /* Project Tabs */
  var tabs = document.querySelectorAll('.tabs button');
  var panes = document.querySelectorAll('.tab-pane');
  tabs.forEach(function(b, i) {
    b.addEventListener('click', function() {
      tabs.forEach(function(x) { x.setAttribute('aria-selected', x === b); });
      panes.forEach(function(p, j) { p.classList.toggle('active', i === j); });
    });
  });

  /* FAQ */
  var Q=[
    ["Da li mi treba predznanje?","Nije neophodno. Akademija je dizajnirana tako da te vodi od osnovnih finansijskih pojmova do naprednog modelovanja."],
    ["Da li je klub samo za studente FON-a?","Klub je primarno fokusiran na studente FON-a, ali su naši otvoreni događaji dostupni svima koji žele da uče."],
    ["Koliko članova primate?","Broj članova nije ograničen, uvek smo otvoreni za motivisane ljude koji žele da se posvete usavršavanju."],
    ["Koliko često se prijavljuje?","Selekcija se održava jednom godišnje, na početku jesenjeg semestra."],
    ["Da li se ulaže pravi novac?","Ne. Tokom takmičenja koristimo virtuelne portfolije (paper trading) kako bismo testirali strategije bez rizika."]
  ];
  var qa = document.getElementById('qa');
  qa.innerHTML = Q.map(function(q){
    return '<div class="q"><div class="q-head"><div class="t">'+q[0]+'</div><button aria-expanded="false" aria-label="Otvori odgovor"></button></div><div class="a-wrap"><div class="a"><p>'+q[1]+'</p></div></div></div>';
  }).join('');
  qa.querySelectorAll('.q').forEach(function(q){
    q.querySelector('.q-head').addEventListener('click', function(){
      var o = q.classList.toggle('open');
      q.querySelector('button').setAttribute('aria-expanded', o);
    });
  });

  /* ===== GALERIJA ===== */
  var gal = document.getElementById('gal');
  var N = GALLERY.length;
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }
  function media(item, lazy){
    return item.src
      ? '<img src="'+esc(item.src)+'" alt="'+esc(item.alt)+'" decoding="async"'+(lazy?' loading="lazy"':'')+'>'
      : '<div class="ph">'+esc(item.alt)+'</div>';
  }
  var zoomIc = '<span class="gal-zoom" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5"/></svg></span>';
  gal.innerHTML = GALLERY.map(function(item, i){
    var more = (i === 4 && N > 5) ? '<span class="gal-more">+'+(N-5)+'<small>fotografija</small></span>' : '';
    return '<figure class="reveal"><button class="gal-open" type="button" data-i="'+i+'" aria-label="Otvori fotografiju: '+esc(item.alt)+'">'+media(item, i > 7)+more+zoomIc+'</button></figure>';
  }).join('');

  /* Mobilni slider: progres + strelice */
  var ctrl = document.getElementById('gal-ctrl');
  var bar = ctrl.querySelector('.gc-bar span'), cnt = ctrl.querySelector('.gc-count');
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function step(){ var f = gal.children[0]; return f ? f.getBoundingClientRect().width + 12 : 0; }
  function curIdx(){
    var max = gal.scrollWidth - gal.clientWidth;
    if (gal.scrollLeft >= max - 4) return N - 1;
    var s = step(); return s ? Math.round(gal.scrollLeft / s) : 0;
  }
  var ticking = false;
  function updateSlider(){
    ticking = false;
    var i = curIdx();
    cnt.textContent = pad(i + 1) + ' / ' + pad(N);
    bar.style.width = ((i + 1) / N * 100) + '%';
  }
  gal.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(updateSlider); } }, { passive: true });
  ctrl.querySelectorAll('.gc-btn').forEach(function(b){
    b.addEventListener('click', function(){ var t = Math.max(0, Math.min(N - 1, curIdx() + Number(b.dataset.dir))); gal.scrollTo({ left: t * step(), behavior: 'smooth' }); });
  });
  updateSlider();

  /* Lightbox */
  var lb = document.getElementById('lb'), fig = lb.querySelector('.lb-fig'), cap = lb.querySelector('.lb-cap'),
      count = lb.querySelector('.lb-count'), thumbs = lb.querySelector('.lb-thumbs'), closeBtn = lb.querySelector('.lb-close');
  var cur = 0, lastFocus = null;
  thumbs.innerHTML = GALLERY.map(function(item, i){
    return '<button type="button" data-i="'+i+'" aria-label="Fotografija '+(i+1)+'">'+(item.src ? '<img src="'+esc(item.src)+'" alt="" loading="lazy">' : '<div class="ph">'+(i+1)+'</div>')+'</button>';
  }).join('');
  var thumbBtns = thumbs.querySelectorAll('button');

  function show(i){
    cur = (i + N) % N;
    var item = GALLERY[cur];
    fig.innerHTML = media(item, false);
    cap.textContent = item.alt;
    count.innerHTML = '<b>' + pad(cur + 1) + '</b> / ' + pad(N);
    thumbBtns.forEach(function(t, j){ t.setAttribute('aria-current', j === cur); });
    var tb = thumbBtns[cur];
    thumbs.scrollTo({ left: tb.offsetLeft - thumbs.clientWidth / 2 + tb.offsetWidth / 2, behavior: 'smooth' });
    /* preload susednih slika */
    [cur + 1, cur - 1].forEach(function(k){ var it = GALLERY[(k + N) % N]; if (it.src) { var im = new Image(); im.src = it.src; } });
  }
  function open(i){
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function(){ closeBtn.focus(); }, 50);
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  gal.addEventListener('click', function(e){
    var b = e.target.closest('.gal-open'); if (b) open(Number(b.dataset.i));
  });
  thumbs.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (b) show(Number(b.dataset.i));
  });
  lb.querySelector('.lb-prev').addEventListener('click', function(){ show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function(){ show(cur + 1); });
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function(e){ if (e.target === lb || e.target === fig || e.target.classList.contains('lb-stage')) close(); });
  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'Tab') {
      var f = lb.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  /* swipe na telefonu */
  var sx = 0, sy = 0;
  fig.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  fig.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
  });
})();

/* PROCES: linija se crta kroz centre koraka (racuna se iz stvarnih pozicija) */
(function(){
  var stage = document.getElementById('stage'), svg = document.getElementById('curve');
  if (!stage || !svg) return;
  var glow = svg.querySelector('.glow'), line = svg.querySelector('.line'), grad = svg.querySelector('#curveGrad');
  var nodes = stage.querySelectorAll('.step .nd');
  var mq = window.matchMedia('(max-width: 960px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var played = false;

  function f(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }
  function build(P){
    var d = 'M' + f(P[0]);
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + f(c1) + ' ' + f(c2) + ' ' + f(p2);
    }
    return d;
  }
  function draw(){
    if (mq.matches) return;
    var r = stage.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var pts = Array.prototype.map.call(nodes, function(n){
      var b = n.getBoundingClientRect();
      return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
    });
    var last = pts[pts.length - 1];
    var x0 = -r.left - 20, x1 = vw - r.left + 20;
    var P = [[x0, pts[0][1] + 120]].concat(pts, [[x1, last[1] - 70]]);
    var d = build(P);
    svg.setAttribute('viewBox', '0 0 ' + r.width.toFixed(1) + ' ' + r.height.toFixed(1));
    glow.setAttribute('d', d); line.setAttribute('d', d);
    grad.setAttribute('x1', x0); grad.setAttribute('x2', x1);
    if (!played && !reduce) {
      var len = line.getTotalLength();
      [line, glow].forEach(function(p){ p.style.transition = 'none'; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    }
  }
  function play(){
    if (played) return; played = true;
    stage.classList.add('drawn');
    if (reduce || mq.matches) { [line, glow].forEach(function(p){ p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); return; }
    line.getBoundingClientRect();
    [line, glow].forEach(function(p){
      p.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.65,0,.35,1) .2s';
      p.style.strokeDashoffset = 0;
    });
    line.addEventListener('transitionend', function(){
      [line, glow].forEach(function(p){ p.style.transition = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    }, { once: true });
  }

  var raf = 0;
  function schedule(){ cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  draw();
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(stage);

  new IntersectionObserver(function(entries, obs){
    entries.forEach(function(e){ if (e.isIntersecting) { setTimeout(play, 250); obs.disconnect(); } });
  }, { threshold: 0.35 }).observe(stage);
})();

/* MOBILNI MENI: ekran potamni (fade), burger se pretvara u X na istom mestu */
(function(){
  var mm = document.getElementById('mmenu'); if (!mm) return;
  var openers = document.querySelectorAll('.burger[aria-controls="mmenu"]'), closeBtn = mm.querySelector('.mm-close'), last = null;
  function place(btn){
    var r = btn.getBoundingClientRect();
    closeBtn.style.left = r.left + 'px'; closeBtn.style.top = r.top + 'px';
    closeBtn.style.width = r.width + 'px'; closeBtn.style.height = r.height + 'px';
  }
  function open(btn){
    last = btn; place(btn);
    closeBtn.classList.remove('x');
    mm.classList.add('open'); mm.inert = false; mm.setAttribute('aria-hidden', 'false');
    openers.forEach(function(b){ b.setAttribute('aria-expanded', 'true'); });
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ closeBtn.classList.add('x'); }); });
    setTimeout(function(){ closeBtn.focus({ preventScroll: true }); }, 300);
  }
  function close(){
    if (!mm.classList.contains('open')) return;
    closeBtn.classList.remove('x');
    mm.classList.remove('open'); mm.inert = true; mm.setAttribute('aria-hidden', 'true');
    openers.forEach(function(b){ b.setAttribute('aria-expanded', 'false'); });
    document.documentElement.style.overflow = '';
    if (last) last.focus({ preventScroll: true });
  }
  openers.forEach(function(b){ b.addEventListener('click', function(){ open(b); }); });
  closeBtn.addEventListener('click', close);
  /* Linkovi iz menija: meni se prvo zatvori (skine se zaključan skrol), pa tek onda skrolujemo do sekcije (vidi goTo dole) */
  mm.addEventListener('click', function(e){
    var a = e.target.closest('a'), href = a && a.getAttribute('href');
    if (href && href.charAt(0) === '#' && href.length > 1 && document.getElementById(decodeURIComponent(href.slice(1)))) {
      e.preventDefault(); e.stopPropagation();
      var hash = href; last = null; close();
      requestAnimationFrame(function(){ window.__goTo(hash); });
      return;
    }
    if (a || e.target === mm) close();
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  window.addEventListener('resize', function(){ if (mm.classList.contains('open') && last) place(last); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function(e){ if (e.matches) close(); });
})();

/* STICKY NAVBAR: radi tek kad se prođe hero. Skrol gore = pojavi se, skrol dole = nestane */
(function(){
  var bar = document.getElementById('topbar'), hero = document.querySelector('.hero');
  if (!bar || !hero) return;
  var lastY = window.scrollY, shown = false, ticking = false;
  function set(v){
    if (v === shown) return;
    shown = v;
    bar.classList.toggle('show', v);
    bar.inert = !v;
  }
  function update(){
    ticking = false;
    var y = window.scrollY, end = hero.offsetHeight - 80, d = y - lastY;
    if (y < end) set(false);
    else if (d > 4) set(false);
    else if (d < -4) set(true);
    if (Math.abs(d) > 4) lastY = y;
  }
  window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* HERO: crtanje linija i ulazak teksta */
(function(){
  var svg=document.getElementById('hero-svg'); if(!svg) return;
  var paths=Array.prototype.slice.call(svg.querySelectorAll('path'));
  var h1=document.querySelector('.hero h1'), lead=document.querySelector('.hero .lead');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DURATION=4000, STAGGER=20;
  var IDLE_MS=5000, IDLE_PHASE=220;
  /* Na telefonu (do 600px) desktop linije se ne animiraju: tamo radi poseban, lak SVG (.waves-m) preko CSS-a */
  var phone=window.matchMedia('(max-width: 600px)'), started=false;
  /* Tablet (do 960px ili ekran na dodir bez miša): linije se nacrtaju i posle toga miruju, bez plutanja */
  var tablet=window.matchMedia('(max-width: 960px), (hover: none) and (pointer: coarse)');

  function idle(el,i){
    el.animate([{transform:'translateY(0)'},{transform:'translateY('+(-14-i*0.6)+'px)'}],
      {duration:IDLE_MS,delay:i*IDLE_PHASE,direction:'alternate',iterations:Infinity,easing:'ease-in-out'});
  }
  function startDesktop(){
    if(started || phone.matches) return; started=true;
    paths.forEach(function(p,i){
      var len=p.getTotalLength();
      p.style.strokeDasharray=len+' '+len;
      p.style.strokeDashoffset=-len;
      var draw=p.animate([{strokeDashoffset:-len},{strokeDashoffset:0}],
        {duration:reduce?0:DURATION,delay:reduce?0:STAGGER*i,easing:'linear',fill:'forwards'});
      if(!reduce) draw.finished.then(function(){ if(!tablet.matches) idle(p,i); });
    });
  }
  startDesktop();
  if(phone.addEventListener) phone.addEventListener('change', startDesktop);

  function show(){ setTimeout(function(){h1&&h1.classList.add('show')},100);
                   setTimeout(function(){lead&&lead.classList.add('show')},3000); }
  if(document.readyState==='complete') show(); else window.addEventListener('load',show);
})();

/* EDUKACIJA: korica se otvara dok se skroluje, knjiga se blago naginje za mišem */
(function(){
  var st=document.getElementById('book'); if(!st) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { st.style.setProperty('--p', 1); return; }
  var cur=0, tgt=0, rx=0, ry=0, trx=0, tRy=0, raf=0;
  function target(){
    var r=st.getBoundingClientRect(), vh=window.innerHeight;
    var c=r.top + r.height/2; var t=(vh*.64 - c)/(vh*.26); t=Math.max(0, Math.min(1, t));
    if (window.scrollY + vh >= document.documentElement.scrollHeight - 4) t=1; /* dno stranice: knjiga uvek otvorena */
    tgt=t*t*(3-2*t);
  }
  function tick(){
    cur+=(tgt-cur)*.09; rx+=(trx-rx)*.1; ry+=(tRy-ry)*.1;
    st.style.setProperty('--p', cur.toFixed(4));
    st.style.setProperty('--rx', rx.toFixed(2)+'deg');
    st.style.setProperty('--ry', ry.toFixed(2)+'deg');
    if (Math.abs(tgt-cur)>.0008 || Math.abs(trx-rx)>.01 || Math.abs(tRy-ry)>.01) raf=requestAnimationFrame(tick); else raf=0;
  }
  function kick(){ if(!raf) raf=requestAnimationFrame(tick); }
  window.addEventListener('scroll', function(){ target(); kick(); }, { passive: true });
  window.addEventListener('resize', function(){ target(); kick(); });
  if (window.matchMedia('(hover: hover)').matches) {
    st.addEventListener('pointermove', function(e){
      var r=st.getBoundingClientRect();
      tRy=((e.clientX-r.left)/r.width-.5)*10; trx=-((e.clientY-r.top)/r.height-.5)*8; kick();
    });
    st.addEventListener('pointerleave', function(){ trx=0; tRy=0; kick(); });
  }
  target(); kick();
})();

/* SKROL DO SEKCIJA: svi linkovi tipa href="#sekcija" skroluju preko JS-a.
   Radi isto i lokalno i na domenu (hosting koji ubacuje <base>, iframe, zaključan skrol posle menija...) */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function goTo(hash){
    /* logo (#top): uvek na sam vrh stranice, bez #top u adresi */
    if (hash === '#top') {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
      return true;
    }
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return false;
    var y = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    try { history.pushState(null, '', hash); } catch (err) {}
    return true;
  }
  window.__goTo = goTo;
  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a'); if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href.length < 2) return;
    if (goTo(href)) e.preventDefault();
  });
  /* Učitavanje stranice: telefon ne sme da "zapamti" staru poziciju skrola,
     pa se stranica uvek otvara od vrha (sa navbarom). Izuzetak je link na konkretnu sekciju (#tim, #faq...). */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var h = location.hash;
  if (h === '#top') { try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {} h = ''; }
  function initialScroll(){
    var el = h.length > 1 && document.getElementById(decodeURIComponent(h.slice(1)));
    window.scrollTo(0, el ? el.getBoundingClientRect().top + window.pageYOffset : 0);
  }
  if (h.length <= 1) window.scrollTo(0, 0);
  window.addEventListener('load', function(){ setTimeout(initialScroll, 60); });
  window.addEventListener('pageshow', function(e){ if (e.persisted && h.length <= 1) window.scrollTo(0, 0); });
})();

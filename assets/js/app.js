/* Kev__Photos — accueil 2026 (JS natif, sans jQuery ni AOS) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero : diaporama en fondu ---------- */
  var slides = [].slice.call(document.querySelectorAll('.hero__slide'));
  var dots = [].slice.call(document.querySelectorAll('#heroDots i'));
  var current = 0;
  var STEP = 5000;

  function preload(src) { var i = new Image(); i.src = src; }
  slides.forEach(function (s) { if (s.dataset.src) preload(s.dataset.src); });

  function showSlide(n) {
    var next = slides[n];
    if (next.dataset.src) {
      next.style.backgroundImage = "url('" + next.dataset.src + "')";
      next.removeAttribute('data-src');
    }
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    next.classList.add('is-active');
    // relance l'animation de la barre de progression
    void dots[n].offsetWidth;
    dots[n].classList.add('is-active');
    current = n;
  }

  if (!reduceMotion && slides.length > 1) {
    var heroTimer = setInterval(function () { showSlide((current + 1) % slides.length); }, STEP);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(heroTimer); heroTimer = null; }
      else if (!heroTimer) { heroTimer = setInterval(function () { showSlide((current + 1) % slides.length); }, STEP); }
    });
  }

  /* ---------- Photo « Qui suis-je » : alternance en fondu ---------- */
  var bioImg = document.getElementById('bioImg');
  if (bioImg && !reduceMotion) {
    var bioPics = [
      'assets/img/models/kevinGuillaume/kev__photos.jpg',
      'assets/img/models/kevinGuillaume/kev__photos_2.jpg'
    ];
    bioPics.forEach(preload);
    var bioIdx = 0;
    setInterval(function () {
      bioIdx = (bioIdx + 1) % bioPics.length;
      bioImg.classList.add('is-swapping');
      setTimeout(function () {
        bioImg.src = bioPics[bioIdx];
        bioImg.classList.remove('is-swapping');
      }, 800);
    }, 6000);
  }

  /* ---------- Lien actif (scrollspy) ---------- */
  var links = [].slice.call(document.querySelectorAll('[data-link]'));
  var sections = ['home', 'biographie', 'categories', 'models']
    .map(function (id) { return document.getElementById(id); });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Carrousel des modèles ---------- */
  var rail = document.getElementById('rail');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');

  if (rail && prev && next) {
    function step() {
      var card = rail.querySelector('.model');
      return card ? card.getBoundingClientRect().width + 16 : 300;
    }
    function updateArrows() {
      var maxScroll = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= maxScroll;
    }
    prev.addEventListener('click', function () { rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    rail.addEventListener('scroll', function () { requestAnimationFrame(updateArrows); }, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    // Le tactile conserve le défilement natif; la souris peut faire glisser le rail.
    var dragging = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragging = true; moved = 0; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) rail.classList.add('is-dragging');
      rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      setTimeout(function () { rail.classList.remove('is-dragging'); }, 0);
    });
  }
})();
/* Kev__Photos — pages catégories / modèles 2026 (JS natif, sans dépendance) */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Révélations au scroll ---------- */
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(function (el, i) { el.style.setProperty('--rd', (i % 4) * 0.07 + 's'); io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Photos : ratio réel + apparition douce ---------- */
  [].forEach.call(document.querySelectorAll('.shot img'), function (img) {
    function done() {
      var fig = img.closest('.shot');
      if (fig && img.naturalWidth && img.naturalHeight) {
        fig.style.setProperty('--ar', (img.naturalWidth / img.naturalHeight).toFixed(4));
      }
      img.classList.add('is-loaded');
    }
    if (img.complete) { done(); }
    else {
      img.addEventListener('load', done);
      img.addEventListener('error', function () { img.classList.add('is-loaded'); });
    }
  });

  /* ---------- Header, progression, retour en haut ---------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var totop = document.getElementById('totop');
  if (header && progress && totop) {
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle('is-solid', y > 40);
      if (!body.classList.contains('menu-open') && !body.classList.contains('lb-open')) {
        header.classList.toggle('is-hidden', y > lastY && y > 400);
      }
      totop.classList.toggle('is-visible', y > 600);
      progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }
  if (totop) totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  if (burger && menu) {
    function setMenu(open) {
      body.classList.toggle('menu-open', open);
      body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open && header) header.classList.remove('is-hidden');
    }

    burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('.menu__nav a');
      if (a) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Visionneuse ---------- */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  var lbLink = document.getElementById('lbLink');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var openers = [].slice.call(document.querySelectorAll('.shot__open'));
  if (lb && lbImg && lbCount && lbLink && lbClose && lbPrev && lbNext && openers.length) {
    var index = 0;
    var lastFocus = null;

  function preload(i) {
    var o = openers[(i + openers.length) % openers.length];
    if (!o) return;
    var im = new Image();
    im.src = o.querySelector('img').getAttribute('src');
  }

  function show(i) {
    index = (i + openers.length) % openers.length;
    var btn = openers[index];
    var thumb = btn.querySelector('img');

    lbImg.classList.remove('is-ready');
    lbImg.onload = function () { lbImg.classList.add('is-ready'); };
    lbImg.src = thumb.getAttribute('src');
    lbImg.alt = thumb.alt;
    if (lbImg.complete) lbImg.classList.add('is-ready');

    lbCount.textContent = (index + 1) + ' / ' + openers.length;
    var href = btn.dataset.href, name = btn.dataset.name;
    if (href && name) {
      lbLink.hidden = false;
      lbLink.href = href;
      lbLink.textContent = name + ' ↗';
    } else {
      lbLink.hidden = true;
    }
    preload(index + 1);
    preload(index - 1);
  }

  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked', 'lb-open');
    document.getElementById('lbClose').focus();
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-locked', 'lb-open');
    if (lastFocus) lastFocus.focus();
  }
  function isOpen() { return lb.classList.contains('is-open'); }

  openers.forEach(function (btn, i) {
    btn.addEventListener('click', function () { openLb(i); });
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { show(index - 1); });
  lbNext.addEventListener('click', function () { show(index + 1); });

  // clic sur le fond = fermer
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb__fig')) closeLb();
  });

  document.addEventListener('keydown', function (e) {
    if (isOpen()) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'Tab') {
        // garde le focus dans la visionneuse
        var f = [].slice.call(lb.querySelectorAll('button, a[href]:not([hidden])'));
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  // balayage tactile (gauche / droite) et glissement vers le bas pour fermer
  var sx = 0, sy = 0, tracking = false;
  lb.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    tracking = true; sx = e.clientX; sy = e.clientY;
  });
  lb.addEventListener('pointerup', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLb();
  });
  lb.addEventListener('pointercancel', function () { tracking = false; });
  }

  /* ---------- Protection légère des photos ---------- */
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
})();

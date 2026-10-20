// tasteskill / base.js — the small amount of script the motion helpers in base.css need.
// Put this line in <head> so the hidden states only apply when scripting works:
//   <script>document.documentElement.classList.add('js')</script>
// Then load this file at the end of <body> (or with defer).

// Reveal once when an element enters the viewport. Never replays, never leaves content hidden.
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
  targets.forEach((el) => io.observe(el));
  // Si se salta por la página (un link del menú, un scroll rápido), lo que ya quedó atrás o a la vista se muestra igual.
  let ticking = false;
  const sweep = () => {
    ticking = false;
    targets.forEach((el) => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-in'); io.unobserve(el); } });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }, { passive: true });
  // safety net: if anything is still hidden a few seconds after load (observer never fired), show it
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Optional, for "colour by chapter": each chapter paints its own full-bleed ground in CSS
// (style="background: var(--field-2); color: var(--field-2-ink)"), so the colour changes exactly at
// section edges. This only lets a fixed header take the ink of the chapter under it. Give each chapter
// data-ink="#hex" and style the header with color: var(--header-ink, var(--ink)).
// Never recolour the whole page from an observer: mid-change, a paragraph sits on two colours.
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink);
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();

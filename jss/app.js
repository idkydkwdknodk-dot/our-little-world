/* ════════════════════════════════════
   our-little-world — app.js
════════════════════════════════════ */

'use strict';

/* ─── Elements ─── */
const landing          = document.getElementById('landing');
const openBtn          = document.getElementById('open-btn');
const envelope         = document.getElementById('envelope');
const transitionOverlay = document.getElementById('transition-overlay');
const typingText       = document.getElementById('typing-text');
const mainSite         = document.getElementById('main-site');
const readLetterBtn    = document.getElementById('read-letter-btn');
const letterOverlay    = document.getElementById('letter-overlay');
const closeLetterBtn   = document.getElementById('close-letter-btn');
const secretFlower     = document.getElementById('secret-flower');
const stickyNote       = document.getElementById('sticky-note');
const closeSticky      = document.getElementById('close-sticky');
const musicHello       = document.getElementById('music-hello');
const musicLetter      = document.getElementById('music-letter');

/* ─── Audio helpers ─── */
function fadeOut(audio, duration = 1200) {
  const step = audio.volume / (duration / 30);
  const timer = setInterval(() => {
    if (audio.volume > step) {
      audio.volume = Math.max(0, audio.volume - step);
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(timer);
    }
  }, 30);
}

function fadeIn(audio, targetVol = 0.7, duration = 1400) {
  audio.volume = 0;
  audio.play().catch(() => {});
  const step = targetVol / (duration / 30);
  const timer = setInterval(() => {
    if (audio.volume < targetVol - step) {
      audio.volume = Math.min(targetVol, audio.volume + step);
    } else {
      audio.volume = targetVol;
      clearInterval(timer);
    }
  }, 30);
}

/* ─── Typing animation ─── */
function typeWriter(text, el, speed = 80) {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/* ─── Landing → Site flow ─── */
openBtn.addEventListener('click', async () => {

  /* 1. Envelope opens */
  envelope.classList.add('open');

  /* 2. Short pause then fade landing */
  await delay(700);
  landing.classList.add('fade-out');

  /* 3. Show transition overlay */
  transitionOverlay.classList.remove('hidden');

  /* 4. Start music */
  await delay(600);
  fadeIn(musicHello);

  /* 5. Type "Welcome." */
  await delay(200);
  await typeWriter('Welcome.', typingText, 90);

  /* 6. Hold a beat */
  await delay(1600);

  /* 7. Fade overlay out, show main site */
  transitionOverlay.classList.add('fade-out');
  mainSite.classList.remove('hidden');

  /* 8. Remove landing from DOM after transition */
  await delay(1000);
  landing.remove();
  transitionOverlay.remove();

  /* 9. Show secret flower */
  secretFlower.classList.remove('hidden-init');
  secretFlower.style.opacity = '1';
  secretFlower.style.pointerEvents = 'auto';

  /* 10. Start scroll reveal */
  initReveal();
});

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/* ─── Scroll reveal ─── */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const ending    = document.querySelector('.ending-inner');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  /* Ending gets its own staggered observer */
  if (ending) {
    const endingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ending.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });
    endingObserver.observe(ending);
  }
}

/* ─── Letter ─── */
readLetterBtn.addEventListener('click', () => {
  letterOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  /* Music crossfade */
  fadeOut(musicHello, 1000);
  setTimeout(() => fadeIn(musicLetter, 0.65), 800);
});

closeLetterBtn.addEventListener('click', closeLetter);
letterOverlay.addEventListener('click', (e) => {
  if (e.target === letterOverlay) closeLetter();
});

function closeLetter() {
  letterOverlay.classList.add('hidden');
  document.body.style.overflow = '';

  /* Music crossfade back */
  fadeOut(musicLetter, 1000);
  setTimeout(() => {
    musicHello.volume = 0;
    fadeIn(musicHello, 0.7, 1200);
  }, 800);
}

/* ─── Secret Flower ─── */
secretFlower.addEventListener('click', () => {
  stickyNote.classList.toggle('hidden');
});

closeSticky.addEventListener('click', (e) => {
  e.stopPropagation();
  stickyNote.classList.add('hidden');
});

/* ─── Keyboard: close letter on Escape ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !letterOverlay.classList.contains('hidden')) {
    closeLetter();
  }
});

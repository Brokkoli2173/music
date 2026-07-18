/* ==========================================================================
   MELIS BULUT — INTERACTIONS
   Vanilla JS only. No dependencies, no build step.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav background on scroll ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    const toggleNav = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    toggleNav();
    window.addEventListener('scroll', toggleNav, { passive: true });
  }

  /* ---- Scroll-reveal for content blocks ---- */
  const revealTargets = document.querySelectorAll(
    '.about__text, .about__portrait, .experience__card, .testimonial-card, ' +
    '.process__steps li, .faq__item, .proof__caption, .repertoire, .final-cta__headline'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---- Signature waveform draw-in ---- */
  const wavePaths = document.querySelectorAll('.wave-path');
  const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        waveObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  wavePaths.forEach(path => waveObserver.observe(path));

  /* ---- Audio sample player ---- */
  const audioToggle = document.getElementById('audioToggle');
  const audioSample = document.getElementById('audioSample');
  const audioProgress = document.getElementById('audioProgress');
  const audioLabel = audioToggle ? audioToggle.querySelector('.audio-player__label') : null;
  const audioIcon = audioToggle ? audioToggle.querySelector('.audio-player__icon') : null;

  if (audioToggle && audioSample) {
    audioToggle.addEventListener('click', () => {
      if (audioSample.paused) {
        audioSample.play().catch(() => {
          // Fails gracefully if assets/audio/sample.mp3 has not been added yet.
          if (audioLabel) audioLabel.textContent = 'Audio wird bald verfügbar sein';
        });
      } else {
        audioSample.pause();
      }
    });

    audioSample.addEventListener('play', () => {
      audioToggle.setAttribute('aria-pressed', 'true');
      if (audioIcon) audioIcon.textContent = '❚❚';
      if (audioLabel) audioLabel.textContent = 'Wird abgespielt …';
    });

    audioSample.addEventListener('pause', () => {
      audioToggle.setAttribute('aria-pressed', 'false');
      if (audioIcon) audioIcon.textContent = '▶';
      if (audioLabel) audioLabel.textContent = 'Live-Ausschnitt anhören';
    });

    audioSample.addEventListener('ended', () => {
      if (audioProgress) audioProgress.style.width = '0%';
    });

    audioSample.addEventListener('timeupdate', () => {
      if (!audioSample.duration || !audioProgress) return;
      const pct = (audioSample.currentTime / audioSample.duration) * 100;
      audioProgress.style.width = pct + '%';
    });
  }

});

/* app.js — Random Activity Selector with slot-machine animation */

(function () {
  'use strict';

  /* ── Particle Background ── */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() < 0.5 ? '#e94560' : '#a855f7'
    };
  }

  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: 100 }, createParticle);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  initParticles();
  drawParticles();

  /* ── Slot Machine ── */
  const ITEM_HEIGHT = 160; // px — must match CSS .slot-item height
  const SPIN_DURATION = 2200; // ms
  const MIN_ROTATIONS = 3;

  let isSpinning = false;
  let currentActivity = null;

  function buildSlotItems() {
    const track = document.getElementById('slot-track');
    // Repeat the list several times so the scroll has enough items
    const repeats = 6;
    let html = '';
    for (let i = 0; i < repeats; i++) {
      for (const act of activities) {
        html += `<div class="slot-item">${escapeHtml(act.name)}</div>`;
      }
    }
    track.innerHTML = html;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function spinActivity() {
    if (isSpinning) return;
    isSpinning = true;

    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Spinning…';

    // Hide previous result
    const resultCard = document.getElementById('result-card');
    resultCard.classList.remove('visible');

    // Pick a random activity
    const targetIndex = Math.floor(Math.random() * activities.length);
    currentActivity = activities[targetIndex];

    const track = document.getElementById('slot-track');

    // We scroll the track so the chosen item lands in the center.
    // Each "rotation" = activities.length items.
    // We land on the item in the 3rd repetition to give room to scroll.
    const landingOffset = (MIN_ROTATIONS * activities.length + targetIndex) * ITEM_HEIGHT;
    const totalItems = track.children.length;
    const maxOffset = (totalItems - 1) * ITEM_HEIGHT;
    const finalOffset = Math.min(landingOffset, maxOffset - ITEM_HEIGHT);

    // Reset position instantly
    track.style.transition = 'none';
    track.style.transform = 'translateY(0)';

    // Force reflow
    track.getBoundingClientRect();

    // Animate with requestAnimationFrame
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = easeOutQuint(progress);
      const currentOffset = eased * finalOffset;

      track.style.transition = 'none';
      track.style.transform = `translateY(-${currentOffset}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap exactly to the target item center
        track.style.transform = `translateY(-${finalOffset}px)`;
        finishSpin();
      }
    }

    requestAnimationFrame(animate);
  }

  function finishSpin() {
    isSpinning = false;

    const btn = document.getElementById('spin-btn');
    btn.disabled = false;
    btn.innerHTML = '<span>✨</span> Pick for Me!';

    showResult(currentActivity);
  }

  function showResult(activity) {
    const card = document.getElementById('result-card');
    const nameEl = document.getElementById('result-name');
    const descEl = document.getElementById('result-description');
    const revealBtn = document.getElementById('reveal-btn');

    nameEl.textContent = activity.name;

    if (!activity.secret) {
      descEl.className = '';
      descEl.textContent = activity.description;
      revealBtn.style.display = 'none';
    } else {
      descEl.className = 'secret-placeholder';
      descEl.innerHTML = '<span class="lock-icon">🔒</span> This description is a secret!';
      revealBtn.style.display = 'inline-flex';
    }

    card.classList.remove('visible');
    // Re-trigger animation
    void card.offsetWidth;
    card.classList.add('visible');

    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function revealSecret() {
    if (!currentActivity) return;
    const descEl = document.getElementById('result-description');
    const revealBtn = document.getElementById('reveal-btn');

    descEl.className = '';
    descEl.textContent = currentActivity.description;
    revealBtn.style.display = 'none';
  }

  // Build slot items on load
  buildSlotItems();

  // Expose functions needed by HTML onclick
  window.spinActivity = spinActivity;
  window.revealSecret = revealSecret;
})();

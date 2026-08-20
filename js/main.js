(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Typed lines ---------- */
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    const lines = [
      "I build things that work, not demos.",
      "while (learning) { build(something_real); }",
      "Done is better than perfect.",
    ];

    if (reduceMotion) {
      typedEl.textContent = lines[0];
    } else {
      let lineIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = lines[lineIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
          setTimeout(tick, 38 + Math.random() * 30);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            setTimeout(tick, 400);
            return;
          }
          setTimeout(tick, 16);
        }
      };
      tick();
    }
  }

  /* ---------- Background particle network ---------- */
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let particles = [];
  let mouse = { x: null, y: null };

  const ACCENT = "79, 195, 247";
  const STEEL = "58, 96, 115";

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = Math.min(90, Math.floor((width * height) / 16000));
    particles = Array.from({ length: density }, () => spawn());
  }

  function spawn() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    const linkDist = Math.min(150, width / 8);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const force = (130 - d) / 130;
          p.x += (dx / d) * force * 0.6;
          p.y += (dy / d) * force * 0.6;
        }
      }

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = `rgba(${STEEL}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, 0.75)`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true }
  );
  window.addEventListener("pointerleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  requestAnimationFrame(step);
})();

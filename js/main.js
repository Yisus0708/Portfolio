(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. FOOTER CURRENT YEAR
     ========================================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. NAVBAR SCROLLED STATE & SCROLL SPY
     ========================================================================== */
  const topbar = document.getElementById("topbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const scrollProgressBar = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");
  const progressRingFill = document.querySelector(".progress-ring-fill");

  const circumference = 2 * Math.PI * 20; // r=20 -> ~125.66
  if (progressRingFill) {
    progressRingFill.style.strokeDasharray = `${circumference}`;
    progressRingFill.style.strokeDashoffset = `${circumference}`;
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) : 0;

    // Scroll progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent * 100}%`;
    }

    // Topbar background blur toggle
    if (topbar) {
      if (scrollY > 30) {
        topbar.classList.add("scrolled");
      } else {
        topbar.classList.remove("scrolled");
      }
    }

    // Back to top visibility and circle progress
    if (backToTopBtn && progressRingFill) {
      if (scrollY > 350) {
        backToTopBtn.classList.add("visible");
        const offset = circumference - (scrollPercent * circumference);
        progressRingFill.style.strokeDashoffset = `${offset}`;
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Scroll spy for navigation
    let currentSectionId = "";
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 120;
      const sectionHeight = sec.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileClose = document.getElementById("mobile-close");
  const mobileBackdrop = document.getElementById("mobile-nav-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function openMobileNav() {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.classList.add("open");
    mobileToggle.classList.add("active");
    mobileToggle.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.classList.remove("open");
    mobileToggle.classList.remove("active");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      if (mobileNav.classList.contains("open")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileNav);
  mobileLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

  /* ==========================================================================
     4. CARD SPOTLIGHT MOUSE-TRACKING EFFECT
     ========================================================================== */
  const spotlightCards = document.querySelectorAll(".spotlight-card");

  function handleCardMouseMove(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty("--mouse-x", `${x}px`);
    this.style.setProperty("--mouse-y", `${y}px`);
  }

  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", handleCardMouseMove, { passive: true });
  });

  /* ==========================================================================
     5. TOAST NOTIFICATION SYSTEM & EMAIL COPY
     ========================================================================== */
  const toastContainer = document.getElementById("toast-container");

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2900);
  }

  const copyEmailBtns = document.querySelectorAll(".copy-email-btn");
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = btn.getAttribute("data-email") || "jesucantillo30@gmail.com";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }
        showToast("¡Email copiado al portapapeles!");
      } catch (err) {
        showToast("Email: " + email);
      }
    });
  });

  /* ==========================================================================
     6. PROJECT CATEGORY FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".projects-grid .card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ==========================================================================
     7. METRICS COUNTER ANIMATION
     ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  let animatedCounters = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 1200;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  }

  const metricsSection = document.querySelector(".metrics-bar");
  if (metricsSection && "IntersectionObserver" in window && !reduceMotion) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedCounters) {
            animatedCounters = true;
            runCounters();
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    metricsObserver.observe(metricsSection);
  } else {
    runCounters();
  }

  /* ==========================================================================
     8. REVEAL-ON-SCROLL ANIMATIONS
     ========================================================================== */
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ==========================================================================
     9. HERO TYPED LINES (TYPEWRITER EFFECT)
     ========================================================================== */
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    const lines = [
      "Construyo cosas que funcionan, no demos.",
      "while (learning) { build(something_real); }",
      "FastAPI + Gemini API + Alto Rendimiento.",
      "Hecho es mejor que perfecto.",
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
            setTimeout(tick, 1800);
            return;
          }
          setTimeout(tick, 45 + Math.random() * 25);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            setTimeout(tick, 450);
            return;
          }
          setTimeout(tick, 20);
        }
      };
      tick();
    }
  }

  /* ==========================================================================
     10. INTERACTIVE TERMINAL WIDGET (JESUS CLI v2.4)
     ========================================================================== */
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const terminalScreen = document.getElementById("terminal-screen");
  const terminalTabs = document.querySelectorAll(".t-tab");
  const terminalContents = document.querySelectorAll(".t-content");
  const commandChips = document.querySelectorAll(".terminal-chips .chip");

  // Tab Switching
  terminalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      terminalTabs.forEach((t) => t.classList.remove("active"));
      terminalContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.classList.add("active");
    });
  });

  // CLI Command Logic
  const commandHistory = [];
  let historyIndex = -1;

  const cliCommands = {
    help: () => `
      <div class="t-line success">=== COMANDOS DISPONIBLES ===</div>
      <div class="t-line"><span class="badge-cmd">projects</span> : Lista de proyectos en producción</div>
      <div class="t-line"><span class="badge-cmd">skills</span> : Tecnologías y fortalezas técnicas</div>
      <div class="t-line"><span class="badge-cmd">philosophy</span> : Filosofía de ingeniería y desarrollo</div>
      <div class="t-line"><span class="badge-cmd">about</span> : Quién soy y qué hago</div>
      <div class="t-line"><span class="badge-cmd">contact</span> : Información de contacto directo</div>
      <div class="t-line"><span class="badge-cmd">hire</span> : ¿Por qué trabajar conmigo?</div>
      <div class="t-line"><span class="badge-cmd">time</span> : Hora actual del sistema</div>
      <div class="t-line"><span class="badge-cmd">clear</span> : Limpiar la pantalla</div>
    `,
    about: () => `
      <div class="t-line accent">Jesus Cantillo — Ingeniero Backend e IA Aplicada</div>
      <div class="t-line output">Especializado en diseñar APIs de alto rendimiento con FastAPI/Flask e integrar modelos de lenguaje avanzados (Gemini API) en flujos de producción.</div>
    `,
    projects: () => `
      <div class="t-line accent">--- PROYECTOS PRODUCTIVOS ---</div>
      <div class="t-line output">1. <strong style="color:#00f0ff">Mentia</strong>: EdTech con feedback en tiempo real de código mediante Gemini & FastAPI.</div>
      <div class="t-line output">2. <strong style="color:#00f0ff">MILA</strong>: Asistente de voz multimodal para control de SO en PyQt6.</div>
      <div class="t-line output">3. <strong style="color:#00f0ff">Medical Records Automation</strong>: Pipeline ETL de PDFs a Excel con Gemini Multimodal.</div>
      <div class="t-line output">4. <strong style="color:#00f0ff">RAG Sales Agent</strong>: Agente conversacional con recuperación semántica de vehículos.</div>
      <div class="t-line dim">👉 Explora más abajo en la sección de proyectos.</div>
    `,
    skills: () => `
      <div class="t-line success">--- STACK TECNOLÓGICO Y HABILIDADES ---</div>
      <div class="t-line output">⚡ <strong>Backend:</strong> Python, FastAPI, Flask, PostgreSQL, MySQL, MongoDB, Docker</div>
      <div class="t-line output">🧠 <strong>IA/ML:</strong> Gemini API, RAG, Embeddings, Ingeniería de Prompts, Multimodal</div>
      <div class="t-line output">🛠 <strong>Herramientas:</strong> JavaScript, React, PyQt6, Git, Linux, Postman</div>
    `,
    stack: () => cliCommands.skills(),
    philosophy: () => `
      <div class="t-line accent">“Construyo cosas que funcionan, no demos.”</div>
      <div class="t-line output">Priorizo la estabilidad, el valor real para el usuario final y la entrega continua sobre la sobreingeniería teórica.</div>
    `,
    hire: () => `
      <div class="t-line success">🚀 ¿Por qué colaborar conmigo?</div>
      <div class="t-line output">✔ Capacidad probada de llevar modelos de IA a flujos productivos reales.</div>
      <div class="t-line output">✔ Código limpio, estructurado y documentado.</div>
      <div class="t-line output">✔ Enfoque autónomo, proactivo y orientado a resolver problemas de negocio.</div>
      <div class="t-line dim">Escribe <span class="badge-cmd">contact</span> o presiona 'Hablemos' para iniciar conversación.</div>
    `,
    contact: () => `
      <div class="t-line accent">--- CANALES DE CONTACTO ---</div>
      <div class="t-line output">✉️ Email: <a href="mailto:jesucantillo30@gmail.com" style="color:#00f0ff">jesucantillo30@gmail.com</a></div>
      <div class="t-line output">🐙 GitHub: <a href="https://github.com/Yisus0708" target="_blank" style="color:#00f0ff">github.com/Yisus0708</a></div>
      <div class="t-line output">📷 Instagram: <a href="https://www.instagram.com/jxsx__x0" target="_blank" style="color:#00f0ff">@jxsx__x0</a></div>
    `,
    time: () => {
      const now = new Date();
      return `<div class="t-line output">🕒 Hora local: ${now.toLocaleTimeString()} (${now.toLocaleDateString()})</div>`;
    },
    sudo: () => `<div class="t-line error">Permiso concedido temporalmente: ¡Bienvenido Superusuario! ✨</div>`,
    quote: () => `<div class="t-line accent">“Todo experto fue alguna vez un principiante que se negó a rendirse.”</div>`,
    clear: () => {
      if (terminalScreen) {
        terminalScreen.innerHTML = "";
      }
      return null;
    },
  };

  function executeCliCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd || !terminalScreen) return;

    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    // Echo input
    const inputEcho = document.createElement("div");
    inputEcho.className = "t-line";
    inputEcho.innerHTML = `<span class="t-prompt">visitor@jc:~$</span> <span style="color:#fff">${cmdRaw}</span>`;
    terminalScreen.appendChild(inputEcho);

    // Run command
    if (cliCommands[cmd]) {
      const resultHtml = cliCommands[cmd]();
      if (resultHtml) {
        const outputDiv = document.createElement("div");
        outputDiv.innerHTML = resultHtml;
        terminalScreen.appendChild(outputDiv);
      }
    } else {
      const errDiv = document.createElement("div");
      errDiv.className = "t-line error";
      errDiv.innerHTML = `Comando no reconocido: '<strong>${cmdRaw}</strong>'. Escribe <span class="badge-cmd">help</span> para ver la lista de comandos.`;
      terminalScreen.appendChild(errDiv);
    }

    // Scroll to bottom
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      if (val.trim()) {
        executeCliCommand(val);
        terminalInput.value = "";
      }
    });

    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || "";
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
      }
    });
  }

  // Clickable command suggestion chips
  commandChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      if (cmd) {
        // Switch to CLI tab if not active
        const cliTab = document.querySelector('.t-tab[data-tab="cli"]');
        if (cliTab && !cliTab.classList.contains("active")) {
          cliTab.click();
        }
        executeCliCommand(cmd);
      }
    });
  });

  /* ==========================================================================
     11. BACKGROUND INTERACTIVE PARTICLE CANVAS
     ========================================================================== */
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  const CYAN_RGB = "0, 240, 255";
  const BLUE_RGB = "56, 189, 248";
  const INDIGO_RGB = "129, 140, 248";

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(85, Math.max(35, Math.floor((width * height) / 18000)));
    particles = Array.from({ length: count }, () => createParticle());
  }

  function createParticle() {
    const palette = [CYAN_RGB, BLUE_RGB, INDIGO_RGB];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.6 + 0.6,
      color: palette[Math.floor(Math.random() * palette.length)],
      pulseSpeed: Math.random() * 0.03 + 0.01,
      alpha: Math.random() * 0.5 + 0.3,
    };
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    const linkDistance = Math.min(145, width / 7);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Mouse interactive force
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }
      }

      // Draw particle connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < linkDistance) {
          const lineAlpha = (1 - dist / linkDistance) * 0.22;
          ctx.strokeStyle = `rgba(${p.color}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(renderCanvas);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
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

  resizeCanvas();
  requestAnimationFrame(renderCanvas);
})();

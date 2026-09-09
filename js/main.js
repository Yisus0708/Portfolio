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
      <div class="t-line"><span class="badge-cmd">mila</span> : Iniciar asistente virtual de voz/IA</div>
      <div class="t-line"><span class="badge-cmd">time</span> : Hora actual del sistema</div>
      <div class="t-line"><span class="badge-cmd">clear</span> : Limpiar la pantalla</div>
    `,
    mila: () => {
      const milaTab = document.querySelector('.t-tab[data-tab="ai-chat"]');
      if (milaTab) milaTab.click();
      return `<div class="t-line accent">🎙️ Activando interfaz del Asistente MILA...</div>`;
    },
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
     11. CYBERPUNK AMBIENT MUSIC & SOUND FX (WEB AUDIO API SYNTHESIZER)
     ========================================================================== */
  let audioCtx = null;
  let ambientMasterGain = null;
  let ambientFilter = null;
  let ambientRunning = false;
  let chordTimer = null;
  let melodyTimer = null;
  let currentChordIndex = 0;
  let soundEnabled = localStorage.getItem("jc_sound_fx") === "on";

  const audioToggleBtn = document.getElementById("audio-fx-toggle");
  const audioIconOff = document.querySelector(".audio-icon-off");
  const audioIconOn = document.querySelector(".audio-icon-on");

  // Atmospheric Cyberpunk Lo-Fi Chords
  const ambientChords = [
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
    [116.54, 146.83, 174.61, 220.00],         // Bbmaj7
    [98.00, 116.54, 146.83, 174.61, 220.00],  // Gm9
    [130.81, 164.81, 196.00, 246.94, 293.66]  // Cadd9
  ];

  // Ambient Pentatonic Melody Notes (Hz)
  const melodyNotes = [293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  function initAudioEngine() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Warm analog low-pass filter
      ambientFilter = audioCtx.createBiquadFilter();
      ambientFilter.type = "lowpass";
      ambientFilter.frequency.setValueAtTime(820, audioCtx.currentTime);
      ambientFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

      // Master ambient gain node
      ambientMasterGain = audioCtx.createGain();
      ambientMasterGain.gain.setValueAtTime(0, audioCtx.currentTime);

      ambientFilter.connect(ambientMasterGain);
      ambientMasterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playPadChord(freqs, duration) {
    if (!ambientRunning || !audioCtx) return;
    const now = audioCtx.currentTime;

    freqs.forEach((freq, idx) => {
      try {
        const osc = audioCtx.createOscillator();
        const voiceGain = audioCtx.createGain();

        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        // Subtle detune for lush analog chorus warmth
        const detune = (idx - 2) * 6;
        osc.detune.setValueAtTime(detune, now);
        osc.frequency.setValueAtTime(freq, now);

        // Smooth breathing envelope
        voiceGain.gain.setValueAtTime(0.0001, now);
        voiceGain.gain.linearRampToValueAtTime(0.022, now + 1.6);
        voiceGain.gain.setValueAtTime(0.022, now + duration - 1.8);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(voiceGain);
        voiceGain.connect(ambientFilter);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    });
  }

  function playMelodyNote() {
    if (!ambientRunning || !audioCtx) return;
    const now = audioCtx.currentTime;
    const noteFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];

    try {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.016, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(noteGain);
      noteGain.connect(ambientFilter);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch (e) {}

    // Schedule next melody note randomly
    if (ambientRunning) {
      const nextTime = 1600 + Math.random() * 2200;
      melodyTimer = setTimeout(playMelodyNote, nextTime);
    }
  }

  function startAmbientMusic() {
    if (ambientRunning) return;
    initAudioEngine();
    ambientRunning = true;

    // Fade in master volume
    const now = audioCtx.currentTime;
    ambientMasterGain.gain.cancelScheduledValues(now);
    ambientMasterGain.gain.setValueAtTime(ambientMasterGain.gain.value, now);
    ambientMasterGain.gain.linearRampToValueAtTime(0.85, now + 1.5);

    function stepChord() {
      if (!ambientRunning) return;
      const chord = ambientChords[currentChordIndex];
      playPadChord(chord, 5.2);
      currentChordIndex = (currentChordIndex + 1) % ambientChords.length;
      chordTimer = setTimeout(stepChord, 4600);
    }

    stepChord();
    melodyTimer = setTimeout(playMelodyNote, 1200);
  }

  function stopAmbientMusic() {
    if (!ambientRunning) return;
    ambientRunning = false;
    clearTimeout(chordTimer);
    clearTimeout(melodyTimer);

    if (audioCtx && ambientMasterGain) {
      const now = audioCtx.currentTime;
      ambientMasterGain.gain.cancelScheduledValues(now);
      ambientMasterGain.gain.setValueAtTime(ambientMasterGain.gain.value, now);
      ambientMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }
  }

  function updateAudioButtonUI() {
    if (!audioToggleBtn) return;
    if (soundEnabled) {
      audioToggleBtn.classList.add("active");
      if (audioIconOff) audioIconOff.classList.add("hidden");
      if (audioIconOn) audioIconOn.classList.remove("hidden");
      audioToggleBtn.title = "Música ambiental (reproduciendo - clic para pausar)";
    } else {
      audioToggleBtn.classList.remove("active");
      if (audioIconOff) audioIconOff.classList.remove("hidden");
      if (audioIconOn) audioIconOn.classList.add("hidden");
      audioToggleBtn.title = "Música ambiental (clic para reproducir)";
    }
    const cmdSoundStatus = document.getElementById("cmd-sound-status");
    if (cmdSoundStatus) {
      cmdSoundStatus.textContent = soundEnabled ? "Estado: Reproduciendo (🎵)" : "Estado: En silencio (🔇)";
    }
  }
  updateAudioButtonUI();

  // Subtle SFX for buttons
  function playTone(freq, type, duration, gainStart = 0.03) {
    if (!soundEnabled) return;
    try {
      initAudioEngine();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainStart, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playPip() { playTone(980, "sine", 0.03, 0.025); }
  function playTick() { playTone(1300, "sine", 0.015, 0.02); }

  function playOpen() {
    try {
      playTone(480, "sine", 0.07, 0.04);
      setTimeout(() => playTone(880, "sine", 0.09, 0.04), 45);
    } catch (e) {}
  }

  function playClose() {
    try {
      playTone(880, "sine", 0.06, 0.035);
      setTimeout(() => playTone(440, "sine", 0.08, 0.035), 40);
    } catch (e) {}
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem("jc_sound_fx", soundEnabled ? "on" : "off");
      updateAudioButtonUI();
      if (soundEnabled) {
        startAmbientMusic();
        showToast("🎵 Música ambiental cyberpunk activada");
      } else {
        stopAmbientMusic();
        showToast("🔇 Música ambiental pausada");
      }
    });
  }

  // Add click sound to interactive buttons
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, .btn, .nav-link, .chip, .t-tab, .composer-chip");
    if (target && target !== audioToggleBtn) {
      playPip();
    }
  }, { passive: true });

  /* ==========================================================================
     12. HERO TERMINAL AI ASSISTANT TAB (MILA)
     ========================================================================== */
  const aiChatScreen = document.getElementById("ai-chat-screen");
  const aiChatForm = document.getElementById("ai-chat-form");
  const aiChatInput = document.getElementById("ai-chat-input");
  const aiPromptChips = document.querySelectorAll(".ai-prompts-chips .ai-chip");

  const aiKnowledge = {
    rag: `Para diseñar un pipeline RAG en producción aplico una arquitectura en 4 capas:
1. <strong>Preprocesamiento:</strong> Chunking con solapamiento semántico (500 tokens con overlap de 50) preservando headers de Markdown y metadatos estructurados.
2. <strong>Indexación:</strong> Generación de embeddings con Gemini <em>text-embedding-004</em> almacenados en <strong>PostgreSQL + pgvector</strong> con índices HNSW para búsqueda coseno a escala de milisegundos.
3. <strong>Filtrado & Caching:</strong> Caché semántico en memoria para preguntas frecuentes (ahorrando hasta 65% de costo en tokens).
4. <strong>Generación Conectada:</strong> Inyección dinámica del Top-K contexto relevante con esquemas JSON estrictos para garantizar respuestas fundamentadas y sin alucinaciones.`,

    fastapi: `Elijo <strong>FastAPI</strong> sobre Django o Flask para APIs de alto rendimiento por 4 razones técnicas:
• <strong>Concurrencia Asíncrona nativa:</strong> Maneja miles de requests concurrentes con <code>async/await</code> sin bloquear el event loop (crucial para llamadas a LLMs con tiempos de respuesta variables).
• <strong>Tipado y Validación con Pydantic v2:</strong> Validaciones compiladas en Rust que reducen la latencia de serialización en un 80%.
• <strong>Documentación OpenAPI automática:</strong> Generación instantánea de contratos Swagger e interfaces interactivas.
• <strong>Inyección de Dependencias:</strong> Arquitectura limpia para sesiones de BD, autenticación JWT y rate limiting modular.`,

    seguridad: `La seguridad en aplicaciones con IA requiere una estrategia multicapa:
• <strong>Defensa contra Prompt Injection:</strong> Separación estricta entre System Instructions del sistema y datos de usuario en delimitadores XML/Markdown aislados.
• <strong>Structured Outputs:</strong> Forzar respuestas en esquemas JSON tipados para evitar ejecución de payloads o desvíos conversacionales.
• <strong>Control de Presupuesto y Tokens:</strong> Rate limiting por usuario con Redis (token bucket algorithm) y ventanas de timeout de 8 segundos.
• <strong>Privacidad de Datos:</strong> Sanitización de PII (Información Personal Identificable) antes de interactuar con APIs externas.`,

    contratar: `¿Por qué elegir a Jesus Cantillo para su equipo?
1. <strong>Enfoque en Producción:</strong> Cero proyectos de juguete o tutoriales vacíos. Todo su portafolio (Mentia, MILA, automatización de historiales médicos) son soluciones creadas para usuarios reales.
2. <strong>Especialización dual:</strong> Domina tanto la ingeniería backend robusta (PostgreSQL, FastAPI, Docker) como la integración práctica de Inteligencia Artificial (Gemini API, RAG, embeddings).
3. <strong>Autonomía y Ejecución:</strong> Capacidad comprobada para llevar una idea desde el diseño arquitectónico hasta la implementación y puesta en marcha con código limpio, tipado y mantenible.`,

    default: `¡Hola! Soy <strong>MILA</strong>, el asistente virtual de Jesus Cantillo. Puedo detallar su arquitectura técnica, experiencia en FastAPI y flujos con IA. Puedes consultar sobre <strong>"Pipeline RAG"</strong>, <strong>"FastAPI vs Otros"</strong>, <strong>"Seguridad en IA"</strong> o escribir directamente al correo <a href="mailto:jesucantillo30@gmail.com" style="color:#00f0ff">jesucantillo30@gmail.com</a>.`
  };

  function appendAiMessage(htmlContent, isUser = false) {
    if (!aiChatScreen) return;
    const wrap = document.createElement("div");
    wrap.className = `ai-bubble-wrap ${isUser ? "user" : "bot"}`;
    wrap.innerHTML = isUser
      ? `<div class="ai-bubble">${htmlContent}</div>`
      : `<span class="ai-avatar">🎙️</span><div class="ai-bubble">${htmlContent}</div>`;
    aiChatScreen.appendChild(wrap);
    aiChatScreen.scrollTop = aiChatScreen.scrollHeight;
  }

  function handleAiQuery(query) {
    if (!query.trim()) return;
    appendAiMessage(query, true);
    playPip();

    // Show thinking indicator
    const thinkingWrap = document.createElement("div");
    thinkingWrap.className = "ai-bubble-wrap bot thinking-indicator";
    thinkingWrap.innerHTML = `<span class="ai-avatar">🎙️</span><div class="ai-bubble"><span class="tab-dot-ai"></span> MILA está procesando la consulta...</div>`;
    aiChatScreen.appendChild(thinkingWrap);
    aiChatScreen.scrollTop = aiChatScreen.scrollHeight;

    setTimeout(() => {
      if (thinkingWrap.parentNode) thinkingWrap.parentNode.removeChild(thinkingWrap);

      const qLower = query.toLowerCase();
      let response = aiKnowledge.default;

      if (qLower.includes("rag") || qLower.includes("recuper") || qLower.includes("vector") || qLower.includes("embedding")) {
        response = aiKnowledge.rag;
      } else if (qLower.includes("fastapi") || qLower.includes("django") || qLower.includes("flask") || qLower.includes("framework")) {
        response = aiKnowledge.fastapi;
      } else if (qLower.includes("seguridad") || qLower.includes("rate") || qLower.includes("injection") || qLower.includes("proteger")) {
        response = aiKnowledge.seguridad;
      } else if (qLower.includes("contrat") || qLower.includes("equipo") || qLower.includes("por que") || qLower.includes("por qué") || qLower.includes("elegir")) {
        response = aiKnowledge.contratar;
      }

      appendAiMessage(response, false);
      playTick();
    }, 500);
  }

  if (aiChatForm && aiChatInput) {
    aiChatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = aiChatInput.value;
      if (text.trim()) {
        handleAiQuery(text);
        aiChatInput.value = "";
      }
    });
  }

  aiPromptChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const promptText = chip.getAttribute("data-prompt");
      if (promptText) {
        handleAiQuery(promptText);
      }
    });
  });

  /* ==========================================================================
     13. ARCHITECTURE PIPELINE FLOW VISUALIZER (ABOUT SECTION)
     ========================================================================== */
  const pipelineSteps = document.querySelectorAll(".flow-step");
  const pdpBadge = document.getElementById("pdp-badge");
  const pdpTitle = document.getElementById("pdp-title");
  const pdpText = document.getElementById("pdp-text");
  const pdpTags = document.getElementById("pdp-tags");

  const pipelineSpecs = {
    gateway: {
      badge: "Etapa 01: Gateway de Entrada & Enrutamiento",
      title: "FastAPI Asíncrono con Pydantic v2 y Rate Limiting",
      text: "Cada solicitud entrante se valida mediante esquemas estrictos de Pydantic v2 garantizando tipos de datos válidos antes de alcanzar la lógica de negocio. Se aplican políticas de rate limiting por IP/token con Redis y manejo centralizado de excepciones con respuestas HTTP semánticas estándar RFC 7807.",
      tags: ["Non-blocking async/await", "Validación en microsegundos", "CORS & JWT Seguro", "OpenAPI Docs Automática"]
    },
    rag: {
      badge: "Etapa 02: Búsqueda Semántica & Context Assembly",
      title: "Recuperación Vectorial Híbrida sobre PostgreSQL / pgvector",
      text: "En lugar de enviar prompts ciegos, el sistema realiza búsqueda semántica mediante pgvector con índice HNSW y filtrado contextual. Las consultas repetidas se resuelven contra un caché semántico en memoria reduciendo un 65% el consumo de tokens y recortando la latencia por debajo de 15ms.",
      tags: ["pgvector HNSW", "Embeddings Gemini", "Caché Semántico", "Re-ranking de Contexto"]
    },
    llm: {
      badge: "Etapa 03: Inferencia & Orquestación con Gemini 1.5",
      title: "Motor de Inferencia con Structured Outputs Tipados",
      text: "El modelo de lenguaje opera bajo esquemas de salida JSON tipados para erradicar alucinaciones sintácticas. Se ajustan dinámicamente parámetros de temperatura (0.1 - 0.3) y ventanas de contexto de hasta 1M de tokens para razonamiento multimodal sobre documentos extensos.",
      tags: ["Structured JSON Output", "Gemini 1.5 Flash / Pro", "Guardrails de Seguridad", "Retry con Exponential Backoff"]
    },
    storage: {
      badge: "Etapa 04: Persistencia Transaccional & Telemetría",
      title: "Persistencia Transaccional ACID & Monitoreo",
      text: "Los resultados, registros de auditoría y métricas operativas se persisten en PostgreSQL con SQLAlchemy y pool de conexiones asyncpg. Las trazas de latencia y uso de cuotas se auditan continuamente para garantizar estabilidad 24/7 en producción.",
      tags: ["PostgreSQL ACID", "Asyncpg Connection Pool", "Auditoría de Inferencia", "Health Checks & Logs"]
    }
  };

  pipelineSteps.forEach((step) => {
    step.addEventListener("click", () => {
      pipelineSteps.forEach((s) => {
        s.classList.remove("active");
        s.setAttribute("aria-selected", "false");
      });
      step.classList.add("active");
      step.setAttribute("aria-selected", "true");

      const stepKey = step.getAttribute("data-step");
      const data = pipelineSpecs[stepKey];
      if (data && pdpBadge && pdpTitle && pdpText && pdpTags) {
        pdpBadge.textContent = data.badge;
        pdpTitle.textContent = data.title;
        pdpText.textContent = data.text;
        pdpTags.innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
      }
    });
  });

  /* ==========================================================================
     14. PROJECT ARCHITECTURE DEEP-DIVE MODAL MANAGER
     ========================================================================== */
  const archModal = document.getElementById("arch-modal");
  const archModalEmoji = document.getElementById("arch-modal-emoji");
  const archModalTitle = document.getElementById("arch-modal-title");
  const archModalSubtitle = document.getElementById("arch-modal-subtitle");
  const archModalBody = document.getElementById("arch-modal-body");
  const archGithubLink = document.getElementById("arch-github-link");
  const archCloseBtn = document.getElementById("arch-close-btn");
  const archModalCloseAction = document.getElementById("arch-modal-close-action");
  const openArchButtons = document.querySelectorAll(".open-arch-modal");

  const projectArchitectures = {
    mentia: {
      emoji: "🧠",
      title: "Mentia — Arquitectura de Sistema",
      subtitle: "FastAPI · Gemini API · PostgreSQL · AST Parser",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "IDE / Web Client", role: "Envío de código en vivo" },
        { name: "FastAPI Gateway", role: "Auth, Rate Limit & Async I/O" },
        { name: "AST Parser", role: "Análisis Sintáctico Estático" },
        { name: "Gemini 1.5 Flash", role: "Diagnóstico Pedagógico" },
        { name: "PostgreSQL DB", role: "Historial de Aprendizaje" }
      ],
      specs: [
        { k: "Latencia Promedio", v: "< 420 ms (streaming habilitado)" },
        { k: "Estrategia LLM", v: "Gemini 1.5 Flash con System Instructions especializadas" },
        { k: "Base de Datos", v: "PostgreSQL con SQLAlchemy Async" },
        { k: "Validación", v: "Pydantic v2 para contratos de entrada/salida" }
      ],
      challenges: [
        "Eliminación de alucinaciones en recomendaciones de código forzando esquema de salida JSON estructurado.",
        "Prevención de sobrecostos de inferencia mediante filtrado sintáctico previo con AST en Python antes de llamar al LLM.",
        "Manejo de picos concurrentes de estudiantes mediante arquitectura asíncrona no bloqueante."
      ]
    },
    mila: {
      emoji: "🎙️",
      title: "MILA — Asistente de Voz para SO",
      subtitle: "PyQt6 · Reconocimiento por Voz · Gemini API · Subprocess Controller",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "Mic Input Stream", role: "Captura de audio local" },
        { name: "Speech-to-Text", role: "Conversión de voz a comando" },
        { name: "Gemini Agent", role: "Clasificación de Intención" },
        { name: "PyQt6 Controller", role: "Ejecución de automatizaciones" },
        { name: "OS Subprocesses", role: "Control de archivos & apps" }
      ],
      specs: [
        { k: "Interfaz", v: "PyQt6 Nativa con renderizado reactivo" },
        { k: "Motor de Intención", v: "Google Gemini con Function Calling" },
        { k: "Seguridad", v: "Sandbox de ejecución de comandos del SO" },
        { k: "Latencia de Respuesta", v: "< 600 ms desde fin de voz" }
      ],
      challenges: [
        "Evitar congelamiento de la GUI de PyQt6 aislando la captura de voz y las llamadas de API en QThreads independientes.",
        "Validación estricta de rutas de archivos antes de ejecutar cualquier operación de lectura o escritura en el disco.",
        "Compatibilidad fluida con comandos del sistema operativo local Windows/Linux."
      ]
    },
    medical: {
      emoji: "🏥",
      title: "Medical Records Automation — Pipeline ETL",
      subtitle: "Flask · Gemini Multimodal Vision · Google Drive API · Pandas",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "Google Drive API", role: "Monitoreo y descarga de PDFs" },
        { name: "PDF Splitter & Prep", role: "Extracción de páginas clave" },
        { name: "Gemini Multimodal", role: "OCR Vision de alta fidelidad" },
        { name: "Normalizer (Pandas)", role: "Limpieza y estructura tabular" },
        { name: "DB / Excel Export", role: "Entrega a personal médico" }
      ],
      specs: [
        { k: "Ahorro de Tiempo", v: "85% reducción en digitación manual" },
        { k: "Tasa de Acierto OCR", v: "> 98.4% en tipografía médica compleja" },
        { k: "Procesamiento", v: "Batching desatendido en background" },
        { k: "Formatos Soportados", v: "PDF escaneado, TIFF, PNG clínico" }
      ],
      challenges: [
        "Normalización de terminología clínica ambigua mediante diccionario de mapeo médico.",
        "Manejo de documentos clínicos de baja resolución o escaneos inclinados aprovechando la visión multimodal de Gemini.",
        "Cero fugas de información sensible garantizando almacenamiento transitorio efímero."
      ]
    },
    "rag-sales": {
      emoji: "🚗",
      title: "RAG Sales Agent — IA Conversacional",
      subtitle: "Gemini 1.5 · pgvector · Búsqueda Semántica · Lead Qualification",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "Chat Webhook", role: "Mensaje entrante del cliente" },
        { name: "Embeddings Generator", role: "Vectorización de la consulta" },
        { name: "pgvector Index", role: "Búsqueda Top-K en inventario" },
        { name: "Gemini Context RAG", role: "Generación de respuesta persuasiva" },
        { name: "CRM Webhook", role: "Lead cualificado & cita agendada" }
      ],
      specs: [
        { k: "Índice Vectorial", v: "pgvector con HNSW (Cosine Distance)" },
        { k: "Velocidad de Búsqueda", v: "< 18 ms sobre miles de ítems" },
        { k: "Cualificación de Leads", v: "Extracción automática de presupuesto e interés" },
        { k: "Tasa de Conversión", v: "Aumento del 34% en citas comerciales" }
      ],
      challenges: [
        "Manejo de inventario altamente dinámico con sincronización continua de embeddings vectoriales.",
        "Diseño de prompts de ventas que respondan con veracidad sobre disponibilidad y precios reales sin inventar datos.",
        "Detección oportuna del momento de cierre para transferir el lead calificado a un agente humano."
      ]
    }
  };

  function openProjectModal(projectKey) {
    const data = projectArchitectures[projectKey];
    if (!data || !archModal) return;

    if (archModalEmoji) archModalEmoji.textContent = data.emoji;
    if (archModalTitle) archModalTitle.textContent = data.title;
    if (archModalSubtitle) archModalSubtitle.textContent = data.subtitle;
    if (archGithubLink) archGithubLink.href = data.github;

    if (archModalBody) {
      const diagramHtml = `
        <div class="arch-section-title"><span>Flow de Arquitectura &amp; Datos</span></div>
        <div class="arch-diagram-box">
          <div class="arch-flow-diagram">
            ${data.diagram.map((node, i) => `
              <div class="arch-node">
                <div class="arch-node-name">${node.name}</div>
                <div class="arch-node-role">${node.role}</div>
              </div>
              ${i < data.diagram.length - 1 ? '<div class="arch-arrow">➔</div>' : ''}
            `).join("")}
          </div>
        </div>
      `;

      const specsHtml = `
        <div class="arch-section-title"><span>Métricas de Ingeniería</span></div>
        <div class="arch-specs-grid">
          ${data.specs.map((s) => `
            <div class="arch-spec-card">
              <div class="arch-spec-k">${s.k}</div>
              <div class="arch-spec-v">${s.v}</div>
            </div>
          `).join("")}
        </div>
      `;

      const challengesHtml = `
        <div class="arch-section-title"><span>Desafíos Técnicos Resueltos</span></div>
        <div class="arch-ch-list">
          ${data.challenges.map((ch) => `
            <div class="arch-ch-item">
              <span class="arch-ch-icon">✔</span>
              <span>${ch}</span>
            </div>
          `).join("")}
        </div>
      `;

      archModalBody.innerHTML = diagramHtml + specsHtml + challengesHtml;
    }

    try { playOpen(); } catch (e) {}
    try {
      if (typeof archModal.showModal === "function") {
        archModal.showModal();
      } else {
        archModal.setAttribute("open", "");
      }
    } catch (e) {
      archModal.setAttribute("open", "");
    }
  }

  function closeProjectModal() {
    if (archModal && (archModal.open || archModal.hasAttribute("open"))) {
      try { playClose(); } catch (e) {}
      try {
        if (typeof archModal.close === "function") {
          archModal.close();
        } else {
          archModal.removeAttribute("open");
        }
      } catch (e) {
        archModal.removeAttribute("open");
      }
    }
  }

  openArchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const proj = btn.getAttribute("data-project");
      if (proj) openProjectModal(proj);
    });
  });

  if (archCloseBtn) archCloseBtn.addEventListener("click", closeProjectModal);
  if (archModalCloseAction) archModalCloseAction.addEventListener("click", closeProjectModal);
  if (archModal) {
    archModal.addEventListener("click", (e) => {
      if (e.target === archModal) closeProjectModal();
    });
  }

  /* ==========================================================================
     15. COMMAND PALETTE (CTRL+K / CMD+K) CONTROLLER
     ========================================================================== */
  const cmdDialog = document.getElementById("cmd-palette-dialog");
  const cmdInput = document.getElementById("cmd-palette-input");
  const cmdTrigger = document.getElementById("cmd-palette-trigger");
  const cmdCloseBtn = document.getElementById("cmd-close-btn");
  const cmdResults = document.getElementById("cmd-palette-results");
  let cmdItems = [];
  let selectedIndex = 0;

  function refreshCmdItems() {
    if (!cmdResults) return;
    cmdItems = Array.from(cmdResults.querySelectorAll(".cmd-item:not(.hidden)"));
    if (selectedIndex >= cmdItems.length) selectedIndex = 0;
    cmdItems.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  }

  function openCmdPalette() {
    if (!cmdDialog) return;
    try { playOpen(); } catch (e) {}
    try {
      if (typeof cmdDialog.showModal === "function") {
        cmdDialog.showModal();
      } else {
        cmdDialog.setAttribute("open", "");
      }
    } catch (e) {
      cmdDialog.setAttribute("open", "");
    }
    if (cmdInput) {
      cmdInput.value = "";
      setTimeout(() => cmdInput.focus(), 50);
    }
    if (cmdResults) {
      cmdResults.querySelectorAll(".cmd-item, .cmd-group-label").forEach((el) => el.classList.remove("hidden"));
    }
    selectedIndex = 0;
    refreshCmdItems();
  }

  function closeCmdPalette() {
    if (cmdDialog && (cmdDialog.open || cmdDialog.hasAttribute("open"))) {
      try { playClose(); } catch (e) {}
      try {
        if (typeof cmdDialog.close === "function") {
          cmdDialog.close();
        } else {
          cmdDialog.removeAttribute("open");
        }
      } catch (e) {
        cmdDialog.removeAttribute("open");
      }
    }
  }

  if (cmdTrigger) cmdTrigger.addEventListener("click", openCmdPalette);
  const mobileCmdTrigger = document.getElementById("mobile-cmd-trigger");
  if (mobileCmdTrigger) {
    mobileCmdTrigger.addEventListener("click", () => {
      closeMobileNav();
      setTimeout(openCmdPalette, 150);
    });
  }
  if (cmdCloseBtn) cmdCloseBtn.addEventListener("click", closeCmdPalette);
  if (cmdDialog) {
    cmdDialog.addEventListener("click", (e) => {
      if (e.target === cmdDialog) closeCmdPalette();
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdDialog && cmdDialog.open) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
  });

  // Filter items in command palette
  if (cmdInput && cmdResults) {
    cmdInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const allItems = cmdResults.querySelectorAll(".cmd-item");
      allItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
      selectedIndex = 0;
      refreshCmdItems();
    });

    cmdInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        playTick();
        if (cmdItems.length > 0) {
          selectedIndex = (selectedIndex + 1) % cmdItems.length;
          refreshCmdItems();
          cmdItems[selectedIndex].scrollIntoView({ block: "nearest" });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        playTick();
        if (cmdItems.length > 0) {
          selectedIndex = (selectedIndex - 1 + cmdItems.length) % cmdItems.length;
          refreshCmdItems();
          cmdItems[selectedIndex].scrollIntoView({ block: "nearest" });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (cmdItems[selectedIndex]) {
          cmdItems[selectedIndex].click();
        }
      }
    });
  }

  // Command palette execution handler
  if (cmdResults) {
    cmdResults.addEventListener("click", (e) => {
      const item = e.target.closest(".cmd-item");
      if (!item) return;

      const action = item.getAttribute("data-action");
      closeCmdPalette();

      if (action === "copy-email") {
        const email = "jesucantillo30@gmail.com";
        navigator.clipboard?.writeText(email).then(() => {
          showToast("¡Email copiado al portapapeles!");
        }).catch(() => showToast("Email: " + email));
      } else if (action === "toggle-audio") {
        if (audioToggleBtn) audioToggleBtn.click();
      } else if (action === "open-ai") {
        const aiTab = document.querySelector('.t-tab[data-tab="ai-chat"]');
        if (aiTab) aiTab.click();
        window.location.hash = "#home";
      } else if (action === "open-arch") {
        const proj = item.getAttribute("data-project");
        if (proj) openProjectModal(proj);
      } else if (action === "nav") {
        const target = item.getAttribute("data-target");
        if (target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      } else if (action === "link") {
        const url = item.getAttribute("data-url");
        if (url) window.open(url, "_blank");
      }
    });
  }

  /* ==========================================================================
     16. CONTACT MESSAGE COMPOSER
     ========================================================================== */
  const composerChips = document.querySelectorAll(".composer-chip");
  const composerSubject = document.getElementById("composer-subject");
  const composerBody = document.getElementById("composer-body");
  const contactDirectBtn = document.getElementById("contact-direct-btn");
  const copyDraftBtn = document.getElementById("copy-draft-btn");

  const contactTemplates = {
    hiring: {
      subject: "Oportunidad Laboral — Ingeniero Backend / IA",
      body: "Hola Jesus, revisé tu portafolio y proyectos en FastAPI e integración con Gemini. Nos gustaría conversar sobre una vacante/oportunidad en nuestro equipo técnico."
    },
    project: {
      subject: "Propuesta de Proyecto — Arquitectura Backend & APIs",
      body: "Hola Jesus, tengo un proyecto en mente que requiere una arquitectura backend sólida, diseño de base de datos y APIs RESTful. ¿Podríamos agendar una videollamada para revisar detalles?"
    },
    ai: {
      subject: "Consultoría / Implementación de IA & RAG",
      body: "Hola Jesus, queremos implementar un sistema de IA (RAG / embeddings / automatización con LLMs) para nuestra empresa y nos interesa tu experiencia técnica."
    },
    coffee: {
      subject: "Conexión Técnica / Saludo de Networking",
      body: "Hola Jesus, vi tu trabajo en GitHub y tus proyectos con Gemini y FastAPI. Me gustaría conectar en networking para futuros proyectos o intercambiar ideas técnicas."
    }
  };

  composerChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      composerChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const intent = chip.getAttribute("data-intent") || "hiring";
      const tmpl = contactTemplates[intent];
      if (tmpl && composerSubject && composerBody && contactDirectBtn) {
        composerSubject.textContent = tmpl.subject;
        composerBody.textContent = `"${tmpl.body}"`;

        const encodedSubject = encodeURIComponent(tmpl.subject);
        const encodedBody = encodeURIComponent(tmpl.body);
        contactDirectBtn.href = `mailto:jesucantillo30@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
      }
    });
  });

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener("click", () => {
      const subj = composerSubject ? composerSubject.textContent : "";
      const body = composerBody ? composerBody.textContent.replace(/^"|"$/g, "") : "";
      const fullText = `Asunto: ${subj}\n\n${body}`;

      navigator.clipboard?.writeText(fullText).then(() => {
        showToast("¡Borrador de mensaje copiado!");
      }).catch(() => {
        showToast("Mensaje listo para enviar");
      });
    });
  }

  /* ==========================================================================
     17. BACKGROUND INTERACTIVE PARTICLE CANVAS
     ========================================================================== */
  function initBackgroundCanvas() {
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
  }

  initBackgroundCanvas();
})();

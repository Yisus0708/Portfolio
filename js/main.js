(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. PANTALLA DE CARGA / PRELOADER (Inspirado en camilamarrugo.com)
     ========================================================================== */
  const preloader = document.getElementById("site-preloader");
  const preloaderBar = document.getElementById("preloader-bar");

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 15;
    if (progress > 95) progress = 95;
    if (preloaderBar) preloaderBar.style.width = `${progress}%`;
  }, 90);

  function dismissPreloader() {
    clearInterval(progressInterval);
    if (preloaderBar) preloaderBar.style.width = "100%";
    setTimeout(() => {
      if (preloader) preloader.classList.add("fade-out");
    }, 300);
  }

  if (document.readyState === "complete") {
    dismissPreloader();
  } else {
    window.addEventListener("load", dismissPreloader);
    setTimeout(dismissPreloader, 2500);
  }

  /* ==========================================================================
     2. CAJÓN DE NAVEGACIÓN DESPLEGABLE / MENU DRAWER (Inspirado en camilamarrugo.com)
     ========================================================================== */
  const navMenuBtn = document.getElementById("nav-menu-btn");
  const menuDrawer = document.getElementById("menu-drawer");
  const menuCloseBtn = document.getElementById("menu-close-btn");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.add("open");
    menuDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (navMenuBtn) navMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove("open");
    menuDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (navMenuBtn) {
      navMenuBtn.setAttribute("aria-expanded", "false");
      navMenuBtn.focus();
    }
  }

  if (navMenuBtn) navMenuBtn.addEventListener("click", openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeDrawer);
  if (menuBackdrop) menuBackdrop.addEventListener("click", closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuDrawer && menuDrawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     3. INDICADOR FLOTANTE DE SIGUIENTE SECCIÓN (Sello distintivo de camilamarrugo.com)
     ========================================================================== */
  const nextIndicator = document.getElementById("next-section-indicator");
  const nextIndicatorBtn = document.getElementById("next-indicator-btn");
  const nextIndicatorText = document.getElementById("next-indicator-text");

  const orderedSections = [
    { id: "hero", nextLabel: "Sobre mí", nextTarget: "#about" },
    { id: "about", nextLabel: "Rigor & Filosofía", nextTarget: "#elegance" },
    { id: "elegance", nextLabel: "Proyectos", nextTarget: "#projects" },
    { id: "projects", nextLabel: "Habilidades Técnicas", nextTarget: "#skills" },
    { id: "skills", nextLabel: "Consola & MILA", nextTarget: "#terminal-section" },
    { id: "terminal-section", nextLabel: "GitHub & Métricas", nextTarget: "#stats" },
    { id: "stats", nextLabel: "Contacto", nextTarget: "#contact" },
    { id: "contact", nextLabel: "Volver al Inicio", nextTarget: "#hero" }
  ];

  let currentTargetId = "#about";

  function updateNextSection() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    if (scrollY + windowH >= docH - 120) {
      if (nextIndicatorText) nextIndicatorText.textContent = "Volver al Inicio";
      currentTargetId = "#hero";
      return;
    }

    let activeIndex = 0;
    orderedSections.forEach((sec, idx) => {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop - 180;
        if (scrollY >= top) {
          activeIndex = idx;
        }
      }
    });

    const currentConf = orderedSections[activeIndex] || orderedSections[0];
    currentTargetId = currentConf.nextTarget;
    if (nextIndicatorText) {
      nextIndicatorText.textContent = currentConf.nextLabel;
    }
  }

  if (nextIndicatorBtn) {
    nextIndicatorBtn.addEventListener("click", () => {
      const targetEl = document.querySelector(currentTargetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* ==========================================================================
     4. CABECERA, BARRA DE PROGRESO Y BOTÓN VOLVER ARRIBA
     ========================================================================== */
  const topbar = document.getElementById("topbar");
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

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent * 100}%`;
    }

    if (topbar) {
      if (scrollY > 40) {
        topbar.classList.add("scrolled");
      } else {
        topbar.classList.remove("scrolled");
      }
    }

    if (backToTopBtn && progressRingFill) {
      if (scrollY > 450) {
        backToTopBtn.classList.add("visible");
        const offset = circumference - (scrollPercent * circumference);
        progressRingFill.style.strokeDashoffset = `${offset}`;
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    updateNextSection();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================================
     5. SISTEMA DE NOTIFICACIONES TOAST
     ========================================================================== */
  const toastContainer = document.getElementById("toast-container");

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  /* ==========================================================================
     6. BOTONES PARA COPIAR CORREO ELECTRÓNICO
     ========================================================================== */
  const copyEmailBtns = document.querySelectorAll(".copy-email-btn");
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email") || "jesucantillo30@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("✓ Correo copiado: " + email);
      }).catch(() => {
        showToast("Correo: " + email);
      });
    });
  });

  /* ==========================================================================
     7. ESCRITURA ANIMADA / FILOSOFÍA DE DESARROLLO
     ========================================================================== */
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    const quotes = [
      "while(aprendiendo) { construir(algo_real); }",
      "Hecho es mejor que perfecto.",
      "Construyo software que funciona en producción, no solo demos.",
      "Arquitecturas escalables. Cero tutoriales vacíos."
    ];
    let qIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function tickTypewriter() {
      const current = quotes[qIdx];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 30 : 60;
      if (!isDeleting && charIdx === current.length) {
        speed = 2600;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        qIdx = (qIdx + 1) % quotes.length;
        speed = 500;
      }
      setTimeout(tickTypewriter, speed);
    }
    if (!reduceMotion) setTimeout(tickTypewriter, 1000);
  }

  /* ==========================================================================
     8. MÚSICA AMBIENTAL SUAVE (Web Audio API)
     ========================================================================== */
  const audioToggle = document.getElementById("audio-fx-toggle");
  const audioIconOff = document.querySelector(".audio-icon-off");
  const audioIconOn = document.querySelector(".audio-icon-on");
  const cmdSoundStatus = document.getElementById("cmd-sound-status");

  let audioCtx = null;
  let isPlayingAudio = false;
  let synthNodes = [];

  function createAmbientDrone() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const chords = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 3);
    masterGain.connect(audioCtx.destination);

    synthNodes = chords.map((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq + (i * 0.4), audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return { osc, gain };
    });
    synthNodes.push({ masterGain });
  }

  function stopAmbientDrone() {
    if (synthNodes.length > 0 && audioCtx) {
      const master = synthNodes.find(n => n.masterGain);
      if (master && master.masterGain) {
        master.masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        setTimeout(() => {
          synthNodes.forEach(n => { if (n.osc) n.osc.stop(); });
          synthNodes = [];
        }, 1300);
      }
    }
  }

  function toggleAudio() {
    isPlayingAudio = !isPlayingAudio;
    if (isPlayingAudio) {
      createAmbientDrone();
      if (audioToggle) audioToggle.classList.add("playing");
      if (audioIconOff) audioIconOff.classList.add("hidden");
      if (audioIconOn) audioIconOn.classList.remove("hidden");
      if (cmdSoundStatus) cmdSoundStatus.textContent = "Reproduciendo sonido ambiental";
      showToast("🎵 Música ambiental activada");
    } else {
      stopAmbientDrone();
      if (audioToggle) audioToggle.classList.remove("playing");
      if (audioIconOff) audioIconOff.classList.remove("hidden");
      if (audioIconOn) audioIconOn.classList.add("hidden");
      if (cmdSoundStatus) cmdSoundStatus.textContent = "Silenciado";
      showToast("Música silenciada");
    }
  }

  if (audioToggle) audioToggle.addEventListener("click", toggleAudio);

  /* ==========================================================================
     9. FILTROS DE PROYECTOS
     ========================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        if (filter === "all" || cat.includes(filter)) {
          card.style.display = "flex";
          setTimeout(() => card.classList.add("active"), 10);
        } else {
          card.style.display = "none";
          card.classList.remove("active");
        }
      });
    });
  });

  /* ==========================================================================
     10. DATOS DE ARQUITECTURA DE PROYECTOS & MODAL DE FICHA TÉCNICA
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
    mila: {
      emoji: "🎙️",
      title: "M.I.L.A — Mi Inteligencia de Lenguaje Avanzada",
      subtitle: "PyQt6 · Reconocimiento por Voz · Visión Artificial · Gemini API · Automatización del SO",
      github: "https://github.com/Yisus0708/MILA",
      diagram: [
        { name: "Flujo de Audio", role: "Captura de micrófono" },
        { name: "Reconocimiento de Voz", role: "Voz a texto en milisegundos" },
        { name: "Motor Gemini / Ollama", role: "Clasificación de intención" },
        { name: "Controlador PyQt6", role: "Renderizado reactivo en QThread" },
        { name: "Subprocesos del SO", role: "Manipulación de archivos y apps" }
      ],
      specs: [
        { k: "Arquitectura de la GUI", v: "PyQt6 desacoplada con QThreads concurrentes" },
        { k: "Modelos Compatibles", v: "Google Gemini 1.5 + Inferencia local con Ollama" },
        { k: "Latencia de Respuesta", v: "< 600 ms tras detección de fin de voz" },
        { k: "Seguridad de Ejecución", v: "Sanitización estricta de rutas y comandos de consola" }
      ],
      challenges: [
        "Aislamiento de tareas de audio e inferencia en hilos independientes para evitar cualquier congelamiento en la UI de PyQt6.",
        "Mapeo de intenciones complejas del usuario en comandos atómicos de sistema operativo con confirmación previa.",
        "Compatibilidad multiplataforma garantizando ejecución fluida en Windows y Linux."
      ]
    },
    arquitectura: {
      emoji: "🎓",
      title: "Pipeline de Calificaciones — Arquitectura Medallion",
      subtitle: "Python 3.10+ · PostgreSQL · Capas Bronze, Silver y Gold · ETL de Extremo a Extremo",
      github: "https://github.com/Yisus0708/arquitectura",
      diagram: [
        { name: "Ingesta Cruda", role: "Extracción de registros escolares" },
        { name: "Capa Bronze", role: "Almacenamiento crudo e inmutable" },
        { name: "Capa Silver", role: "Limpieza, deduplicación y tipado" },
        { name: "Capa Gold", role: "Vistas analíticas de rendimiento" },
        { name: "Base de Datos PostgreSQL", role: "Persistencia transaccional ACID" }
      ],
      specs: [
        { k: "Patrón de Diseño", v: "Arquitectura Medallion (Bronze &rarr; Silver &rarr; Gold)" },
        { k: "Motor de Base de Datos", v: "PostgreSQL con esquemas estructurados" },
        { k: "ORM y Pipeline", v: "Python 3.10+, SQLAlchemy y scripts ETL modulares" },
        { k: "Control de Calidad", v: "Validación de restricciones escolares y pruebas de integridad" }
      ],
      challenges: [
        "Normalización de notas y registros académicos heterogéneos sin pérdida de trazabilidad histórica.",
        "Modelado de vistas en capa Gold preparadas para analítica predictiva de deserción escolar.",
        "Ejecución eficiente de lotes masivos de datos manteniendo consistencia transaccional completa."
      ]
    },
    vivaidiomas: {
      emoji: "🏛️",
      title: "VivaIdiomas Colombia — Asistente RAG Local",
      subtitle: "FastAPI · LangChain · Ollama (100% Local) · ChromaDB · Backend en Python",
      github: "https://github.com/Yisus0708/vivaidiomas-rag",
      diagram: [
        { name: "Cliente Web / Chat", role: "Consulta del aspirante" },
        { name: "Gateway FastAPI", role: "Enrutamiento asíncrono y streaming" },
        { name: "Base Vectorial ChromaDB", role: "Búsqueda vectorial Top-K de pensum" },
        { name: "Modelo Ollama Local", role: "Generación de respuesta 100% local" },
        { name: "Flujo de Respuesta", role: "Entrega interactiva con latencia mínima" }
      ],
      specs: [
        { k: "Privacidad", v: "100% Local — Cero datos enviados a servicios en la nube" },
        { k: "Base Vectorial", v: "ChromaDB con embeddings semánticos en español" },
        { k: "Orquestación", v: "LangChain + FastAPI Asíncrono con Server-Sent Events" },
        { k: "Interfaz Web", v: "Vanilla JS reactivo con CSS3 de alta fidelidad" }
      ],
      challenges: [
        "Indexación semántica precisa de cursos, niveles y precios para responder sin inventar información institucional.",
        "Optimización de prompts para modelos locales ligeros en Ollama manteniendo rigor conversacional.",
        "Implementación de respuestas con streaming para respuesta perceptual inmediata al usuario."
      ]
    },
    "ocr-pdf": {
      emoji: "📄",
      title: "OCR Inteligente & PDF Semántico",
      subtitle: "Python 3.12 · PyMuPDF · Tesseract OCR · Búsqueda Espacial · Chat QA Visual",
      github: "https://github.com/Yisus0708/OCR-PDF",
      diagram: [
        { name: "Carga de Documentos", role: "Recepción de PDFs clínicos y legales" },
        { name: "PyMuPDF + OCR", role: "Extracción con coordenadas Bounding Box" },
        { name: "Indexador Vectorial", role: "Embeddings por fragmento espacial" },
        { name: "Motor Conversacional", role: "Preguntas y respuestas fundamentadas" },
        { name: "Grounding Visual", role: "Resaltado exacto sobre el documento" }
      ],
      specs: [
        { k: "Grounding Visual", v: "Búsqueda espacial con Bounding Boxes coordenadas exactas" },
        { k: "Extracción", v: "PyMuPDF para PDFs digitales + Tesseract para escaneos" },
        { k: "Asistente QA", v: "Chat conversacional con citas visuales auditables" },
        { k: "Entorno de Ejecución", v: "Python 3.12 100% local" }
      ],
      challenges: [
        "Alineación precisa entre el texto extraído por OCR y sus coordenadas físicas en el lienzo del PDF.",
        "Soporte de documentos extensos de múltiples páginas sin desbordar el consumo de memoria RAM.",
        "Resaltado en tiempo real en la interfaz para que el usuario verifique la fuente de cada afirmación."
      ]
    },
    neuronforge: {
      emoji: "⚡",
      title: "NeuronForge — Redes Neuronales desde Cero",
      subtitle: "Python Puro · NumPy · Matemáticas de IA · Grafos Computacionales Propios",
      github: "https://github.com/Yisus0708/neuronforge",
      diagram: [
        { name: "Vectores de Entrada", role: "Datos de entrenamiento crudos" },
        { name: "Capas de Tensores", role: "Matrices de pesos y bias inicializados" },
        { name: "Propagación Directa", role: "Activaciones (ReLU, Sigmoid, Softmax)" },
        { name: "Propagación Hacia Atrás", role: "Cálculo analítico del gradiente" },
        { name: "Optimizador", role: "Descenso de gradiente (SGD, Adam)" }
      ],
      specs: [
        { k: "Filosofía", v: "Cero librerías externas de deep learning (sin PyTorch ni TensorFlow)" },
        { k: "Fundamentos", v: "Álgebra lineal, cálculo diferencial multivariable y NumPy" },
        { k: "Transparencia", v: "Visualización paso a paso de matrices de gradientes" },
        { k: "Origen", v: "Desarrollado en Barranquilla, Colombia (2026)" }
      ],
      challenges: [
        "Derivación matemática manual de funciones de pérdida y propagación inversa sin errores numéricos.",
        "Evitar gradientes desvanecidos (vanishing gradients) mediante inicializaciones numéricas robustas (He/Xavier).",
        "Diseño de una arquitectura modular basada en clases orientadas a objetos limpia y comprensible."
      ]
    },
    mentia: {
      emoji: "🧠",
      title: "Mentia — Plataforma EdTech de Revisión de Código",
      subtitle: "FastAPI · Gemini API · PostgreSQL · Analizador Sintáctico AST",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "Cliente Web / IDE", role: "Envío de código en vivo" },
        { name: "Gateway FastAPI", role: "Autenticación, Rate Limit e I/O Asíncrono" },
        { name: "Analizador AST", role: "Análisis Sintáctico Estático de Código" },
        { name: "Modelo Gemini 1.5", role: "Diagnóstico Pedagógico Contextual" },
        { name: "Base de Datos PostgreSQL", role: "Historial de Aprendizaje y Métricas" }
      ],
      specs: [
        { k: "Latencia Promedio", v: "< 420 ms con streaming habilitado" },
        { k: "Estrategia LLM", v: "Gemini 1.5 Flash con System Instructions especializadas" },
        { k: "Base de Datos", v: "PostgreSQL con SQLAlchemy Asíncrono" },
        { k: "Validación", v: "Pydantic v2 para contratos de entrada/salida tipados" }
      ],
      challenges: [
        "Eliminación de alucinaciones en recomendaciones forzando esquemas de salida JSON estructurados.",
        "Prevención de sobrecostos de inferencia mediante filtrado sintáctico previo con AST en Python.",
        "Manejo de picos concurrentes de estudiantes mediante arquitectura asíncrona no bloqueante."
      ]
    },
    medical: {
      emoji: "🏥",
      title: "Automatización de Historias Clínicas — Pipeline ETL",
      subtitle: "Flask · Visión Multimodal con Gemini · API de Google Drive · Pandas",
      github: "https://github.com/Yisus0708",
      diagram: [
        { name: "API de Google Drive", role: "Monitoreo y descarga de PDFs clínicos" },
        { name: "Procesador de PDFs", role: "Extracción y segmentación de páginas" },
        { name: "Visión Multimodal", role: "OCR Vision de alta fidelidad con Gemini" },
        { name: "Normalizador Pandas", role: "Limpieza y estructura tabular de datos" },
        { name: "Exportación a Base de Datos", role: "Entrega a personal médico en Excel/BD" }
      ],
      specs: [
        { k: "Ahorro de Tiempo", v: "85% reducción en digitación manual de expedientes" },
        { k: "Tasa de Acierto OCR", v: "> 98.4% en tipografía médica compleja" },
        { k: "Modo de Procesamiento", v: "Lotes desatendidos en segundo plano" },
        { k: "Formatos Compatibles", v: "PDF escaneado, TIFF, PNG clínico" }
      ],
      challenges: [
        "Normalización de terminología clínica ambigua mediante diccionario de mapeo médico.",
        "Manejo de documentos clínicos de baja resolución aprovechando la visión multimodal de Gemini.",
        "Cero fugas de información sensible garantizando almacenamiento transitorio efímero."
      ]
    },
    familybot: {
      emoji: "🏠",
      title: "FamilyBot — Asistente de Gestión Familiar",
      subtitle: "JavaScript · Node.js · Express · Gemini API · CSS3 Moderno",
      github: "https://github.com/Yisus0708/FamilyBot",
      diagram: [
        { name: "Aplicación Web Móvil", role: "Interfaz compartida por los miembros" },
        { name: "Servidor Express", role: "API de rutas y lógica de estado" },
        { name: "Asistente Gemini AI", role: "Planificación de compras y gastos" },
        { name: "Servicio de Datos", role: "Persistencia de tareas y presupuestos" },
        { name: "Centro de Notificaciones", role: "Recordatorios de agenda semanal" }
      ],
      specs: [
        { k: "Módulos Integrados", v: "Horarios, gastos compartidos, tareas, mascotas y compras" },
        { k: "Asistente con IA", v: "Recomendaciones de recetas y optimización de presupuesto" },
        { k: "Ecosistema Técnico", v: "Node.js + Express + Gemini API" },
        { k: "Diseño Responsivo", v: "Enfoque prioritario para dispositivos móviles" }
      ],
      challenges: [
        "Diseño de interfaz simple e intuitiva accesible para todas las edades de la familia.",
        "Integración de la IA con el contexto vivo de gastos y productos de la lista de compras.",
        "Sincronización en tiempo real de actividades y recordatorios semanales."
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
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Flujo de Arquitectura y Datos</div>
        <div class="arch-flow-diagram">
          ${data.diagram.map((node, i) => `
            <div class="arch-node">
              <div class="arch-node-name">${node.name}</div>
              <div class="arch-node-role">${node.role}</div>
            </div>
            ${i < data.diagram.length - 1 ? '<div class="arch-arrow">&rarr;</div>' : ''}
          `).join("")}
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Especificaciones Técnicas Clave</div>
        <div class="arch-specs-grid">
          ${data.specs.map(s => `
            <div class="arch-spec-card">
              <div class="arch-spec-k">${s.k}</div>
              <div class="arch-spec-v">${s.v}</div>
            </div>
          `).join("")}
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Decisiones y Desafíos de Ingeniería Superados</div>
        <div class="arch-challenges">
          ${data.challenges.map(c => `
            <div style="display: flex; gap: 8px;">
              <span style="color: var(--gold-primary);">&bull;</span>
              <span>${c}</span>
            </div>
          `).join("")}
        </div>
      `;
      archModalBody.innerHTML = diagramHtml;
    }

    if (typeof archModal.showModal === "function") {
      archModal.showModal();
    } else {
      archModal.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    if (archModal && (archModal.open || archModal.hasAttribute("open"))) {
      if (typeof archModal.close === "function") {
        archModal.close();
      } else {
        archModal.removeAttribute("open");
      }
      document.body.style.overflow = "";
    }
  }

  openArchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pKey = btn.getAttribute("data-project");
      if (pKey) openProjectModal(pKey);
    });
  });

  if (archCloseBtn) archCloseBtn.addEventListener("click", closeProjectModal);
  if (archModalCloseAction) archModalCloseAction.addEventListener("click", closeProjectModal);

  if (archModal) {
    archModal.addEventListener("click", (e) => {
      const rect = archModal.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) closeProjectModal();
    });
  }

  /* ==========================================================================
     11. CONSOLA CLI & ASISTENTE VIRTUAL MILA
     ========================================================================== */
  const terminalScreen = document.getElementById("terminal-screen");
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const chips = document.querySelectorAll(".terminal-chips .chip");
  const terminalTabs = document.querySelectorAll(".t-tab");

  terminalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      terminalTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetTab = tab.getAttribute("data-tab");
      document.querySelectorAll(".t-content").forEach(tc => tc.classList.remove("active"));
      const el = document.getElementById(`tab-${targetTab}`);
      if (el) el.classList.add("active");
    });
  });

  function appendTerminalLine(text, type = "output") {
    if (!terminalScreen) return;
    const line = document.createElement("div");
    line.className = `t-line ${type}`;
    line.innerHTML = text;
    terminalScreen.appendChild(line);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function handleTerminalCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    appendTerminalLine(`<span class="t-prompt">visitante@jc:~$</span> ${raw}`, "command");

    switch (cmd) {
      case "help":
      case "ayuda":
        appendTerminalLine("Comandos disponibles:<br>&bull; <span class='badge-cmd'>proyectos</span> (o <span class='badge-cmd'>projects</span>) — Lista proyectos en producción.<br>&bull; <span class='badge-cmd'>habilidades</span> (o <span class='badge-cmd'>skills</span>) — Muestra tecnologías dominadas.<br>&bull; <span class='badge-cmd'>filosofia</span> — Filosofía de ingeniería y entrega.<br>&bull; <span class='badge-cmd'>contratar</span> (o <span class='badge-cmd'>hire</span>) — ¿Por qué incorporar a Jesus?<br>&bull; <span class='badge-cmd'>contacto</span> — Métodos de contacto directo.<br>&bull; <span class='badge-cmd'>limpiar</span> (o <span class='badge-cmd'>clear</span>) — Limpia la consola.");
        break;
      case "projects":
      case "proyectos":
        appendTerminalLine("🚀 <strong>Proyectos destacados:</strong><br>1. <strong>MILA</strong>: Asistente multimodal de escritorio (PyQt6 + Gemini).<br>2. <strong>Pipeline de Calificaciones</strong>: Arquitectura Medallion Bronze/Silver/Gold ETL.<br>3. <strong>VivaIdiomas Colombia RAG</strong>: Asistente RAG local con Ollama y FastAPI.<br>4. <strong>OCR Inteligente &amp; PDF</strong>: Digitalización espacial con Bounding Boxes.<br>5. <strong>NeuronForge</strong>: Motor de redes neuronales desde fundamentos matemáticos.");
        break;
      case "skills":
      case "habilidades":
        appendTerminalLine("🧠 <strong>Stack Tecnológico:</strong><br>&bull; <em>Backend:</em> Python 3.12, FastAPI, Flask, PostgreSQL, SQLAlchemy, REST APIs.<br>&bull; <em>IA &amp; RAG:</em> LangChain, Ollama (100% Local), Gemini API, ChromaDB, Embeddings.<br>&bull; <em>Datos &amp; Sistemas:</em> Arquitectura Medallion, Pandas, NumPy, Docker, PyQt6, Linux.");
        break;
      case "philosophy":
      case "filosofia":
      case "filosofía":
        appendTerminalLine("⚡ <em>'Hecho es mejor que perfecto.'</em><br>No construyo demos para tutoriales; diseño software que funciona en entornos reales con restricciones de latencia, seguridad y concurrencia.");
        break;
      case "hire":
      case "contratar":
        appendTerminalLine("💼 <strong>Propuesta de valor:</strong><br>&bull; Autonomía para liderar desde el diseño de datos hasta APIs en producción.<br>&bull; Capacidad probada de integrar IA local (Ollama) garantizando privacidad.<br>&bull; Enfoque pragmático orientado a resolver dolores de negocio medibles.");
        break;
      case "contact":
      case "contacto":
        appendTerminalLine("✉️ Correo: <a href='mailto:jesucantillo30@gmail.com' style='color: var(--gold-primary); text-decoration: underline;'>jesucantillo30@gmail.com</a><br>🐙 GitHub: <a href='https://github.com/Yisus0708' target='_blank' style='color: var(--gold-primary); text-decoration: underline;'>github.com/Yisus0708</a><br>🇨🇴 Ubicación: Barranquilla, Colombia");
        break;
      case "clear":
      case "limpiar":
        terminalScreen.innerHTML = "";
        appendTerminalLine("Consola reiniciada. Escribe <span class='badge-cmd'>help</span> para ver comandos.");
        break;
      default:
        appendTerminalLine(`Comando no reconocido: '<strong>${cmd}</strong>'. Prueba escribiendo <span class='badge-cmd'>help</span>.`, "dim");
        break;
    }
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      if (!val.trim()) return;
      handleTerminalCommand(val);
      terminalInput.value = "";
    });
  }

  chips.forEach((c) => {
    c.addEventListener("click", () => {
      const cmd = c.getAttribute("data-cmd");
      if (cmd) handleTerminalCommand(cmd);
    });
  });

  /* Simulación del Asistente Virtual MILA */
  const aiChatScreen = document.getElementById("ai-chat-screen");
  const aiChatForm = document.getElementById("ai-chat-form");
  const aiChatInput = document.getElementById("ai-chat-input");
  const aiChips = document.querySelectorAll(".ai-prompts-chips .ai-chip");

  const milaKnowledge = [
    {
      keywords: ["medallion", "pipeline", "datos", "arquitectura", "calificaciones"],
      response: "En el proyecto <strong>Pipeline de Calificaciones</strong> implementó la arquitectura <strong>Medallion</strong> con tres capas bien diferenciadas: <em>Bronze</em> para almacenamiento crudo e inmutable, <em>Silver</em> para limpieza, deduplicación y tipado estricto, y <em>Gold</em> con agregaciones y vistas para analítica predictiva en PostgreSQL."
    },
    {
      keywords: ["rag", "ollama", "local", "privacidad", "vivaidiomas"],
      response: "En <strong>VivaIdiomas Colombia</strong>, Jesus diseñó una arquitectura RAG <strong>100% local</strong> usando <strong>Ollama + LangChain + ChromaDB + FastAPI</strong>. Esto garantiza privacidad total porque ningún dato de clientes o de la academia sale a servidores de terceros, entregando streaming fluido."
    },
    {
      keywords: ["mila", "asistente", "voz", "vision", "pyqt6"],
      response: "<strong>M.I.L.A</strong> (Mi Inteligencia de Lenguaje Avanzada) es un asistente multimodal de escritorio desarrollado en <strong>PyQt6</strong> con subprocesos asíncronos en QThreads. Controla el sistema operativo, lee pantallas con visión artificial y responde comandos de voz en menos de 600ms."
    },
    {
      keywords: ["contratar", "perfil", "por que", "equipo", "vacante"],
      response: "Jesus destaca por su <strong>rigor de ingeniería y pragmatismo</strong>: no se limita a tutoriales, crea sistemas de software completos con arquitecturas de datos sólidas (PostgreSQL, FastAPI, Medallion) e IA aplicada de última generación lista para producción."
    }
  ];

  function appendAiMessage(text, role = "bot") {
    if (!aiChatScreen) return;
    const bubbleWrap = document.createElement("div");
    bubbleWrap.className = `ai-bubble-wrap ${role}`;

    const avatar = document.createElement("span");
    avatar.className = "ai-avatar";
    avatar.textContent = role === "bot" ? "🎙️" : "👤";

    const bubble = document.createElement("div");
    bubble.className = "ai-bubble";
    bubble.innerHTML = text;

    bubbleWrap.appendChild(avatar);
    bubbleWrap.appendChild(bubble);
    aiChatScreen.appendChild(bubbleWrap);
    aiChatScreen.scrollTop = aiChatScreen.scrollHeight;
  }

  function handleAiQuery(query) {
    if (!query.trim()) return;
    appendAiMessage(query, "user");

    const typingWrap = document.createElement("div");
    typingWrap.className = "ai-bubble-wrap bot";
    typingWrap.innerHTML = `<span class="ai-avatar">🎙️</span><div class="ai-bubble"><em>MILA analizando respuesta...</em></div>`;
    aiChatScreen.appendChild(typingWrap);
    aiChatScreen.scrollTop = aiChatScreen.scrollHeight;

    setTimeout(() => {
      if (typingWrap.parentNode) typingWrap.parentNode.removeChild(typingWrap);
      const qLower = query.toLowerCase();
      let matched = milaKnowledge.find(k => k.keywords.some(kw => qLower.includes(kw)));
      if (matched) {
        appendAiMessage(matched.response, "bot");
      } else {
        appendAiMessage("Excelente pregunta. Jesus enfoca la ingeniería en construir <strong>arquitecturas backend confiables</strong> y soluciones de IA (RAG, Medallion, Agentes) que resuelven problemas concretos de producción. Puedes consultar más detalles escribiendo a <strong>jesucantillo30@gmail.com</strong>.", "bot");
      }
    }, 700);
  }

  if (aiChatForm && aiChatInput) {
    aiChatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = aiChatInput.value;
      if (!val.trim()) return;
      handleAiQuery(val);
      aiChatInput.value = "";
    });
  }

  aiChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const p = chip.getAttribute("data-prompt");
      if (p) handleAiQuery(p);
    });
  });

  /* ==========================================================================
     12. PALETA DE COMANDOS (Ctrl+K / Cmd+K)
     ========================================================================== */
  const cmdDialog = document.getElementById("cmd-palette-dialog");
  const cmdTrigger = document.getElementById("cmd-palette-trigger");
  const cmdCloseBtn = document.getElementById("cmd-close-btn");
  const cmdInput = document.getElementById("cmd-palette-input");
  const cmdItems = document.querySelectorAll(".cmd-item");

  function openCmdPalette() {
    if (!cmdDialog) return;
    if (typeof cmdDialog.showModal === "function") {
      cmdDialog.showModal();
    } else {
      cmdDialog.setAttribute("open", "");
    }
    if (cmdInput) {
      cmdInput.value = "";
      cmdInput.focus();
    }
    filterCmdItems("");
    document.body.style.overflow = "hidden";
  }

  function closeCmdPalette() {
    if (cmdDialog && (cmdDialog.open || cmdDialog.hasAttribute("open"))) {
      if (typeof cmdDialog.close === "function") {
        cmdDialog.close();
      } else {
        cmdDialog.removeAttribute("open");
      }
      document.body.style.overflow = "";
    }
  }

  if (cmdTrigger) cmdTrigger.addEventListener("click", openCmdPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener("click", closeCmdPalette);

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdDialog && (cmdDialog.open || cmdDialog.hasAttribute("open"))) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
  });

  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", () => {
      filterCmdItems(cmdInput.value);
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      closeCmdPalette();

      if (action === "copy-email") {
        navigator.clipboard.writeText("jesucantillo30@gmail.com").then(() => {
          showToast("✓ Correo copiado: jesucantillo30@gmail.com");
        });
      } else if (action === "toggle-audio") {
        toggleAudio();
      } else if (action === "open-ai") {
        const terminalSec = document.getElementById("terminal-section");
        if (terminalSec) terminalSec.scrollIntoView({ behavior: "smooth" });
        const aiTab = document.querySelector(".t-tab[data-tab='ai-chat']");
        if (aiTab) aiTab.click();
      } else if (action === "open-arch") {
        const p = item.getAttribute("data-project");
        if (p) openProjectModal(p);
      } else if (action === "nav") {
        const target = item.getAttribute("data-target");
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (action === "link") {
        const url = item.getAttribute("data-url");
        if (url) window.open(url, "_blank");
      }
    });
  });

  /* ==========================================================================
     13. COMPOSITOR DE MENSAJES RÁPIDOS
     ========================================================================== */
  const composerChips = document.querySelectorAll(".composer-chip");
  const composerSubject = document.getElementById("composer-subject");
  const composerBody = document.getElementById("composer-body");
  const contactDirectBtn = document.getElementById("contact-direct-btn");
  const copyDraftBtn = document.getElementById("copy-draft-btn");

  const messageTemplates = {
    hiring: {
      subject: "Oportunidad Laboral — Ingeniero Backend / IA",
      body: "Hola Jesus, revisé tu portafolio y proyectos en FastAPI, Arquitectura Medallion y RAG. Nos gustaría conversar sobre una oportunidad en nuestro equipo técnico."
    },
    project: {
      subject: "Propuesta de Proyecto — Arquitectura de Datos / Medallion",
      body: "Hola Jesus, tenemos un requerimiento de ingeniería de datos y backend y nos interesó tu enfoque con arquitectura Medallion y PostgreSQL. ¿Tendrías disponibilidad para una llamada técnica?"
    },
    ai: {
      subject: "Consultoría — Implementación de RAG Local & Agentes",
      body: "Hola Jesus, queremos implementar una solución de IA local con LangChain/Ollama protegiendo la privacidad de los datos, similar a lo que hiciste en VivaIdiomas. ¿Podemos revisar alcance?"
    },
    coffee: {
      subject: "Networking Profesional — Jesus Cantillo",
      body: "Hola Jesus, me pareció excelente tu enfoque en desarrollo con IA aplicada y backend. Me gustaría conectar e intercambiar ideas de ingeniería."
    }
  };

  function updateComposer(intentKey) {
    const data = messageTemplates[intentKey];
    if (!data) return;

    if (composerSubject) composerSubject.textContent = data.subject;
    if (composerBody) composerBody.textContent = `"${data.body}"`;

    if (contactDirectBtn) {
      contactDirectBtn.href = `mailto:jesucantillo30@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
    }
  }

  composerChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      composerChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const intent = chip.getAttribute("data-intent");
      updateComposer(intent);
    });
  });

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener("click", () => {
      const sub = composerSubject ? composerSubject.textContent : "";
      const bdy = composerBody ? composerBody.textContent.replace(/^"|"$/g, "") : "";
      const fullText = `Asunto: ${sub}\n\n${bdy}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("✓ Borrador de mensaje copiado");
      });
    });
  }

  /* ==========================================================================
     14. INTERSECTION OBSERVER PARA ANIMACIONES DE REVELACIÓN
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("active"));
  }

  /* ==========================================================================
     15. LIENZO DE PARTÍCULAS AMBIENTALES
     ========================================================================== */
  const bgCanvas = document.getElementById("bg-canvas");
  if (bgCanvas && !reduceMotion) {
    const ctx = bgCanvas.getContext("2d");
    let particles = [];
    let width = bgCanvas.width = window.innerWidth;
    let height = bgCanvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.isGold = Math.random() > 0.4;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isGold
          ? `rgba(212, 175, 55, ${this.alpha})`
          : `rgba(56, 189, 248, ${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor(width / 32), 40);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

})();

(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const runningAnimations = new Set();
  function animateEntrance(element, delay = 0) {
    if (motionPreference.matches || !element || typeof element.animate !== 'function') return;
    const animation = element.animate([
      { opacity: 0, translate: '0 12px' },
      { opacity: 1, translate: '0 0' }
    ], { duration: 420, delay, easing: 'cubic-bezier(.2,.7,.2,1)' });
    runningAnimations.add(animation);
    const forget = () => runningAnimations.delete(animation);
    animation.onfinish = forget;
    animation.oncancel = forget;
  }
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) runningAnimations.forEach(animation => animation.cancel());
  });
  const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting));
  }, { threshold: 0.1 });
  document.querySelectorAll('.system-lab, .project-art').forEach(element => motionObserver.observe(element));
  function syncVisibility() {
    document.documentElement.classList.toggle('motion-paused', document.hidden);
  }
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  const architectures = {
    rag: ['Tu conocimiento. Tu infraestructura.', 'Documentos → embeddings → contexto → respuesta. Una arquitectura de IA que mantiene tus datos en local.', 'Explorar proyectos de IA', 'ai', '01'],
    data: ['Del dato crudo a una decisión clara.', 'Bronze → Silver → Gold. Pipelines Medallion que convierten datos dispersos en información estructurada.', 'Explorar ingeniería de datos', 'data', '02'],
    agents: ['Inteligencia que se convierte en acción.', 'Voz → interpretación → herramientas → acción. Asistentes que conectan IA con tareas del escritorio.', 'Explorar automatización', 'desktop', '03']
  };
  const flows = {
    rag: ['Documentos', 'Contexto + LLM', 'Respuesta con contexto', 'IA LOCAL', 'PRIVACIDAD POR DISEÑO'],
    data: ['Registros originales', 'Bronze → Silver → Gold', 'Datos listos para analizar', 'PIPELINE ETL', 'CALIDAD EN CADA CAPA'],
    agents: ['Voz o instrucción', 'IA + herramientas', 'Acción en el escritorio', 'AGENTES', 'DEL LENGUAJE A LA ACCIÓN']
  };
  let selected = 'ai';
  document.querySelectorAll('[data-lab]').forEach(button => {
    button.addEventListener('click', () => {
      const [title, description, label, category, number] = architectures[button.dataset.lab];
      selected = category;
      const flow = flows[button.dataset.lab];
      ['flow-source', 'flow-engine', 'flow-result'].forEach((id, index) => {
        document.getElementById(id).textContent = flow[index];
      });
      document.querySelector('.preview-kind').textContent = flow[3];
      document.querySelector('.preview-footnote span').textContent = flow[4];
      runningAnimations.forEach(animation => animation.cancel());
      animateEntrance(document.querySelector('.lab-details'));
      animateEntrance(document.querySelector('.architecture-preview'));
      document.querySelectorAll('[data-lab]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.getElementById('lab-title').textContent = title;
      document.getElementById('lab-description').textContent = description;
      document.getElementById('lab-link').replaceChildren(document.createTextNode(label + ' ↗'));
      document.querySelector('.lab-top > span:last-child').textContent = number + ' / 03';
    });
  });
  document.getElementById('lab-link').addEventListener('click', () => document.querySelector(`[data-filter="${selected}"]`).click());
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      runningAnimations.forEach(animation => animation.cancel());
      document.querySelectorAll('.project-card').forEach(card => {
        if (card.style.display !== 'none') animateEntrance(card);
      });
    });
  });
  const links = document.querySelectorAll('.desktop-nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
})();

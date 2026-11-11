(() => {
  'use strict';
  const architectures = {
    rag: ['Tu conocimiento. Tu infraestructura.', 'Documentos → embeddings → contexto → respuesta. Una arquitectura de IA que mantiene tus datos en local.', 'Explorar proyectos de IA', 'ai', '01'],
    data: ['Del dato crudo a una decisión clara.', 'Bronze → Silver → Gold. Pipelines Medallion que convierten datos dispersos en información estructurada.', 'Explorar ingeniería de datos', 'data', '02'],
    agents: ['Inteligencia que se convierte en acción.', 'Voz → interpretación → herramientas → acción. Asistentes que conectan IA con tareas del escritorio.', 'Explorar automatización', 'desktop', '03']
  };
  let selected = 'ai';
  document.querySelectorAll('[data-lab]').forEach(button => {
    button.addEventListener('click', () => {
      const [title, description, label, category, number] = architectures[button.dataset.lab];
      selected = category;
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
    button.addEventListener('click', () => filters.forEach(item => item.setAttribute('aria-pressed', String(item === button))));
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

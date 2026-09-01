# Jesus Cantillo — Portfolio V2.0 (Backend & Applied AI)

Un portafolio web moderno, de alto impacto y rendimiento con estética Cyberpunk/Tech minimalista, construido puramente con **HTML5 semántico, CSS3 moderno y JavaScript Vanilla** (sin dependencias pesadas ni frameworks de build).

---

## 🚀 Características Principales

- **🎮 Terminal / CLI Interactivo:** Simulador de consola con comandos en tiempo real (`projects`, `skills`, `philosophy`, `hire`, `contact`, `clear`, etc.), navegación por historial con teclas de flecha y accesos rápidos por chips.
- **✨ Tarjetas Spotlight Reactivas:** Efecto de iluminación dinámica que sigue la posición del cursor (`--mouse-x`, `--mouse-y`) en cada tarjeta del Bento grid.
- **⚡ Red de Partículas Dinámica en Canvas:** Sistema interactivo de nodos interconectados con física de atracción/repulsión y pulsaciones de luz.
- **📂 Filtros de Proyectos en Tiempo Real:** Filtrado instantáneo por categorías (*Applied AI & LLMs*, *Backend & APIs*, *Desktop & Automation*).
- **📊 Métricas & Animación de Contadores:** Contadores numéricos que se activan al entrar en vista con `IntersectionObserver`.
- **📋 Copiado al Portapapeles con 1 Clic:** Notificaciones Toast flotantes instantáneas al copiar el correo.
- **📱 100% Responsivo & Accesible:** Drawer de navegación móvil animado, scroll spy para resaltar secciones activas, barra de progreso superior y botón flotante de retorno con indicador circular.

---

## 📁 Estructura del Proyecto

```
portfolio/
├── index.html        # Estructura semántica, metadatos SEO y OpenGraph
├── css/
│   └── style.css     # Tokens de diseño, Bento grids, spotlight y animaciones
├── js/
│   └── main.js       # CLI interactivo, física de canvas, toast y filtros
└── README.md
```

---

## 💻 Vista Previa Local

Puedes abrir directamente `index.html` en tu navegador favorito o iniciar un servidor estático local:

```bash
# Con npx serve
npx serve .

# O con Python
python -m http.server 8000
```

---

## 🌐 Despliegue en GitHub Pages

1. Sube los cambios a la rama principal (`main`).
2. En GitHub ve a **Settings** > **Pages**.
3. Selecciona la fuente **Deploy from a branch** y elige `main` / `root`.
4. ¡Listo! Tu portafolio estará online en `https://Yisus0708.github.io/portfolio`.

# CRUJIENTE — Experiencia web 3D de comida rápida

Sitio web original (no es un clon de KFC) inspirado en la estética de comida rápida:
rojo intenso, negro, blanco y crema, con una escena 3D cinematográfica hecha con
**Three.js real** (no CSS falso) como protagonista del HERO.

## Cómo ejecutarlo localmente (VS Code)

Los navegadores bloquean los módulos/canvas cargados con `file://`, así que necesitas
un servidor local simple. Dos opciones:

**Opción A — Extensión "Live Server" de VS Code**
1. Instala la extensión "Live Server".
2. Clic derecho sobre `index.html` → "Open with Live Server".

**Opción B — Servidor con Node o Python**
```bash
# Con Node
npx serve .

# o con Python 3
python3 -m http.server 8080
```
Luego abre `http://localhost:8080` (o el puerto que indique la terminal).

## Estructura del proyecto

```
/index.html          → estructura de toda la página (una sola página, secciones ancladas)
/css/style.css        → estilos, paleta de color, responsive
/js/scene.js          → todas las escenas Three.js (hero, experiencia, mini-productos)
/js/main.js           → UI: loader, navbar, scroll, carrito, arranque de escenas
/assets/              → aquí van imágenes reales de producto si las agregas
/models/              → aquí van modelos .glb si reemplazas la geometría procedural
/textures/            → aquí van texturas (madera, metal, etc.) si las agregas
```

## Librerías (vía CDN, indicadas también en `index.html`)

- Three.js r160 — `https://cdnjs.cloudflare.com/ajax/libs/three.js/r160/three.min.js`
- GSAP 3.12 — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- GSAP ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- Google Fonts: Anton / Bebas Neue (display) + Manrope (texto)

No requieren instalación: se cargan directo desde el HTML.

## Sobre el pollo y el balde 3D

Para que la demo funcione de inmediato sin depender de archivos externos que
podrían no existir, el pollo y el balde se generan con **geometría procedural**
de Three.js (una esfera deformada con ruido + cilindros para el balde).

Si más adelante quieres usar modelos 3D reales:

1. Coloca los archivos en:
   - `/models/chicken.glb`
   - `/models/bucket.glb`
2. En `js/scene.js`, al final del archivo, hay un bloque comentado
   `GLTFLoader` con el código listo para cargarlos.
3. Si el archivo no existe o falla la carga, el sitio sigue funcionando
   igual gracias al fallback procedural — nunca se rompe la página.

## Rendimiento

- `pixelRatio` limitado (máx. 2 en escritorio, 1.75 en móvil).
- Partículas reducidas automáticamente en pantallas ≤ 760px.
- Mini-escenas 3D de las tarjetas de menú solo se activan en escritorio y
  se pausan cuando la tarjeta sale de pantalla (`IntersectionObserver`).
- Todas las escenas se pausan cuando la pestaña no está visible.
- `dispose()` disponible en cada escena para liberar geometrías/materiales.
- Fallback visual (sin canvas) si el navegador no soporta WebGL.

## Personalización rápida

- **Colores**: variables `:root` al inicio de `css/style.css`.
- **Textos del HERO**: sección `.hero-title` en `index.html`.
- **Precios y productos**: tarjetas `.menu-card` en `index.html`.
- **Velocidad/tiempo del ciclo de caída del pollo**: método `_scheduleDropCycle()`
  dentro de la clase `HeroScene` en `js/scene.js`.

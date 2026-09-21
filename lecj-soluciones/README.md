# LECJ — Soluciones Web y Sistemas Futuristas

Landing page para LECJ: agencia que ofrece **páginas web** y **sistemas operativos
futuristas** a medida. Estética oscura, acentos cian/violeta, tipografía
"Space Grotesk" para títulos y "Sora" para texto.

## Efecto principal: parallax con GSAP + ScrollTrigger

En la sección "Proyectos" y en el visual de "NEXUS OS", las imágenes (mockups
en SVG) se **expanden suavemente** (`scale` de 0.82 a 1.06) a medida que
entran y cruzan la pantalla, usando `scrub` para que el movimiento esté
directamente ligado a la posición del scroll (no a un tiempo fijo).

Además, cada tarjeta de proyecto tiene un atributo `data-parallax-speed`
distinto (0.85, 0.9, 1.15) que hace que se mueva a una velocidad vertical
distinta a la del resto de la página — el clásico efecto de "capas" de
parallax. Todo esto vive en `js/main.js`.

Si el usuario tiene activada la preferencia `prefers-reduced-motion`, el
parallax se desactiva automáticamente y las imágenes se muestran directamente
en su tamaño final.

## Cómo ejecutarlo localmente (VS Code)

```bash
# Con Node
npx serve .

# o con Python 3
python3 -m http.server 8080
```
Luego abre `http://localhost:8080`.

(También funciona con la extensión "Live Server" de VS Code: clic derecho en
`index.html` → "Open with Live Server".)

## Estructura

```
/index.html      → toda la estructura de la página
/css/style.css   → estilos, paleta de color, responsive
/js/main.js      → navbar, reveal del hero y el efecto parallax
/assets/         → aquí puedes reemplazar los mockups SVG por imágenes reales
```

## Librerías (CDN)

- GSAP 3.12 — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- GSAP ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- Google Fonts: Space Grotesk (display) + Sora (texto)

## Reemplazar los mockups por imágenes reales

Los "screenshots" de proyectos y del sistema NEXUS son SVG generados
directamente en `index.html` (para que el sitio funcione sin depender de
imágenes externas). Para usar capturas reales:

1. Coloca tus imágenes en `/assets/`.
2. Reemplaza el `<svg class="mockup-...">` correspondiente por una etiqueta
   `<img src="assets/tu-imagen.jpg" alt="..." />` dentro del `.parallax-media`.
3. El efecto de parallax sigue funcionando igual, porque se aplica sobre el
   contenedor `.parallax-media`, no sobre el contenido interno.

## Personalización rápida

- **Colores**: variables `:root` en `css/style.css` (`--cyan`, `--violet`, `--bg`).
- **Textos e indicadores del hero**: sección `#inicio` en `index.html`.
- **Velocidad/intensidad del parallax**: valores `data-parallax-speed` en cada
  `<figure>` y los números `0.82` / `1.06` en `js/main.js`.

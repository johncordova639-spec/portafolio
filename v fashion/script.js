// ============================================================
// DATOS PRODUCTOS
// ============================================================
const productos = {
  1: {
    nombre: "Sweatshirt Manga — Luffy",
    precio: "$29.990",
    cat: "SWEATSHIRT",
    desc: "Sweatshirt oversized con estampado manga de Luffy. Tela 100% algodón premium, gramaje 380g.",
    img: "img/prenda1.png",
    colores: ["#f5f0e8", "#1a1a1a"],
  },
  2: {
    nombre: "Hoodie Gojo — Hands",
    precio: "$34.990",
    cat: "HOODIE",
    desc: "Hoodie con diseño exclusivo de Gojo rodeado de manos. Fleece interior suave, capucha doble capa.",
    img: "img/prenda2.png",
    colores: ["#1a1a1a", "#2d2d2d"],
  },
  3: {
    nombre: "Hoodie Kaeruko — Birthday",
    precio: "$34.990",
    cat: "HOODIE",
    desc: "Hoodie edición especial Kaeruko x Crunchyroll. Estampado full back en alta definición.",
    img: "img/prenda3.png",
    colores: ["#1a1a1a", "#3d2040"],
  },
  4: {
    nombre: "Tee Sanji — One Piece",
    precio: "$22.990",
    cat: "T-SHIRT",
    desc: "Camiseta oversized con ilustración de Sanji en modo Ifrit Jambe. 100% algodón ring-spun.",
    img: "img/prenda4.png",
    colores: ["#1a1a1a", "#c8a800"],
  },
  5: {
    nombre: "Tee Zero Two — DITF",
    precio: "$22.990",
    cat: "T-SHIRT",
    desc: "Camiseta con arte de Zero Two de Darling in the FranXX. Estampado DTF resistente al lavado.",
    img: "img/prenda5.png",
    colores: ["#1a1a1a", "#8b0000"],
  },
};

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
const dot  = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");

document.addEventListener("mousemove", (e) => {
  dot.style.left  = e.clientX + "px";
  dot.style.top   = e.clientY + "px";
  setTimeout(() => {
    ring.style.left = e.clientX + "px";
    ring.style.top  = e.clientY + "px";
  }, 60);
});

document.addEventListener("mousedown", () => {
  dot.classList.add("clicking");
  ring.classList.add("clicking");
});
document.addEventListener("mouseup", () => {
  dot.classList.remove("clicking");
  ring.classList.remove("clicking");
});

document.querySelectorAll("a, button, .prod-card, .hero-card-float").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
});

// ============================================================
// NAVBAR SCROLL
// ============================================================
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// ============================================================
// CANVAS PARTÍCULAS
// ============================================================
const canvas = document.getElementById("bg-canvas");
const ctx    = canvas.getContext("2d");
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    o: Math.random() * 0.4 + 0.1,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,169,110,${p.o})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > W) p.dx *= -1;
    if (p.y < 0 || p.y > H) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ============================================================
// CARDS 3D — EFECTO MOUSE
// ============================================================
document.querySelectorAll(".prod-card").forEach((card, i) => {
  const inner = card.querySelector(".prod-card-inner");
  const shine = card.querySelector(".prod-shine");

  card.addEventListener("mousemove", (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotY   =  ((x - cx) / cx) * 12;
    const rotX   = -((y - cy) / cy) * 12;

    inner.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.03)`;

    if (shine) {
      shine.style.opacity  = "1";
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 65%)`;
    }
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    if (shine) shine.style.opacity = "0";
  });
});

// ============================================================
// HERO CARDS — PARALLAX MOUSE
// ============================================================
const heroCards = document.getElementById("heroCards");
if (heroCards) {
  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    heroCards.querySelectorAll(".hero-card-float").forEach((card, i) => {
      const depth = (i + 1) * 8;
      card.style.transform += ` translate(${dx * depth}px, ${dy * depth}px)`;
    });
  });
}

// ============================================================
// TALLAS
// ============================================================
document.querySelectorAll(".talla-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".talla-btn").forEach((b) => b.classList.remove("activa"));
    btn.classList.add("activa");
  });
});

// ============================================================
// MODAL
// ============================================================
let carritoCount = 0;

function abrirModal(id) {
  const p   = productos[id];
  const overlay = document.getElementById("modalOverlay");

  document.getElementById("modalImgSrc").src  = p.img;
  document.getElementById("modalImgSrc").alt  = p.nombre;
  document.getElementById("modalNombre").textContent = p.nombre;
  document.getElementById("modalPrecio").textContent = p.precio;
  document.getElementById("modalCat").textContent    = p.cat;
  document.getElementById("modalDesc").textContent   = p.desc;

  const coloresDiv = document.getElementById("modalColores");
  coloresDiv.innerHTML = "";
  p.colores.forEach((c) => {
    const span = document.createElement("span");
    span.className = "color-circulo";
    span.style.background = c;
    coloresDiv.appendChild(span);
  });

  overlay.classList.add("activo");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("activo");
  document.body.style.overflow = "";
}

document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalOverlay")) cerrarModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

// Agregar al carrito
document.getElementById("btnAgregar").addEventListener("click", () => {
  carritoCount++;
  document.getElementById("carritoBadge").textContent = carritoCount;
  mostrarToast("✓ AGREGADO AL CARRITO");
  cerrarModal();
});

// ============================================================
// TOAST
// ============================================================
function mostrarToast(msg) {
  const t = document.getElementById("gestureToast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ============================================================
// DRAG PARA ROTAR EN MODAL
// ============================================================
const visor    = document.getElementById("modalVisor");
const imgModal = document.getElementById("modalImg");
let dragging   = false;
let startX     = 0;
let currentRot = 0;

visor.addEventListener("mousedown", (e) => {
  dragging = true;
  startX   = e.clientX;
});
window.addEventListener("mouseup",  () => { dragging = false; });
window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const delta = e.clientX - startX;
  currentRot += delta * 0.5;
  startX      = e.clientX;
  imgModal.style.transform = `rotateY(${currentRot}deg)`;
  imgModal.style.animation = "none";
});
// ============================================================
// VIDEOS — HOVER REPRODUCE / SALE PAUSA
// ============================================================
document.querySelectorAll(".video-card").forEach((card) => {
  const video   = card.querySelector("video");
  const overlay = card.querySelector(".video-overlay");
  const playBtn = card.querySelector(".play-icon");

  // Hover → reproduce
  card.addEventListener("mouseenter", () => {
    video.play();
    overlay.style.opacity = "0.4";
    playBtn.textContent   = "⏸";
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
    overlay.style.opacity = "1";
    playBtn.textContent   = "▶";
  });

  // Click → fullscreen
  card.addEventListener("click", () => {
    if (video.requestFullscreen)          video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    video.play();
    video.muted = false;
  });
});
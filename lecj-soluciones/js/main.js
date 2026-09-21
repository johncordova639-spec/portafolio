/* ==========================================================================
   LECJ — main.js
   Navbar, reveal de hero y efecto PARALLAX con GSAP + ScrollTrigger:
   las imágenes de la galería de proyectos y del sistema NEXUS se expanden
   suavemente (scale) y se desplazan a distinta velocidad (parallax de
   profundidad) a medida que el usuario hace scroll.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HAS_GSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  const siteVideo = document.querySelector(".site-video");
  siteVideo?.addEventListener("error", () => {
    document.querySelector(".site-video-wrap")?.remove();
  });

  if (siteVideo) {
    const resumeVideo = () => {
      if (siteVideo.paused) siteVideo.play().catch(() => {});
    };

    siteVideo.addEventListener("canplay", resumeVideo, { once: true });
    window.addEventListener("scroll", resumeVideo, { passive: true });
    resumeVideo();
  } else {
    siteVideo?.pause();
  }

  /* ------------------------------------------------------------------ */
  /* NAVBAR                                                               */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const onScrollNav = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* ------------------------------------------------------------------ */
  /* HERO — entrada (una sola vez, al cargar)                              */
  /* ------------------------------------------------------------------ */
  if (HAS_GSAP) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".eyebrow", { opacity: 1, duration: 0.6 }, 0.1)
      .to(".reveal-line span", { y: 0, duration: 0.9, stagger: 0.1 }, 0.25)
      .to(".hero-sub", { opacity: 1, duration: 0.7 }, 0.7)
      .to(".hero-cta", { opacity: 1, duration: 0.6 }, 0.9)
      .to(".hero-stats", { opacity: 1, duration: 0.6 }, 1.05);
  } else {
    document.querySelectorAll(".eyebrow, .hero-sub, .hero-cta, .hero-stats").forEach((el) => (el.style.opacity = 1));
    document.querySelectorAll(".reveal-line span").forEach((el) => (el.style.transform = "translateY(0)"));
  }

  /* ------------------------------------------------------------------ */
  /* PARALLAX — galería de proyectos + visual de NEXUS OS                 */
  /* ------------------------------------------------------------------ */
  if (HAS_GSAP && !REDUCED_MOTION) {
    // 1) Cada imagen se EXPANDE suavemente (scale) mientras entra y cruza el viewport.
    gsap.utils.toArray(".parallax-media, .sistemas-visual").forEach((media) => {
      gsap.fromTo(
        media,
        { scale: 0.82 },
        {
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: media,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    });

    // 2) Parallax de profundidad: cada tarjeta de proyecto se mueve a distinta
    //    velocidad vertical según su atributo data-parallax-speed (capas).
    gsap.utils.toArray("[data-parallax-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 1;
      const distance = (1 - speed) * 160; // negativo = más lento, positivo = más rápido

      gsap.fromTo(
        el,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    });

    // 3) El texto de cada proyecto entra con un fade + leve subida, ligado al scroll.
    gsap.utils.toArray(".parallax-item figcaption").forEach((cap) => {
      gsap.fromTo(
        cap,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: cap, start: "top 85%" },
        }
      );
    });

    // 4) Servicios y valores: entrada suave al aparecer en pantalla.
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        }
      );
    });

    gsap.utils.toArray(".value-item").forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 90%" },
        }
      );
    });

    gsap.fromTo(
      ".sistemas-copy > *",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "#sistemas", start: "top 65%" },
      }
    );

    // Recalcular posiciones si la ventana cambia de tamaño (evita saltos en el parallax)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  } else {
    // Sin GSAP o con "reduce motion": mostrar todo directamente en su estado final,
    // sin animación de scroll.
    document
      .querySelectorAll(".parallax-media, .sistemas-visual, .parallax-item figcaption, .service-card, .value-item, .sistemas-copy > *")
      .forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
  }
});

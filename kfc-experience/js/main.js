/* ==========================================================================
   CRUJIENTE — main.js
   Orquesta: loader, navbar, menú móvil, animaciones de entrada, scroll
   animations, tilt 3D de tarjetas, carrito simple y arranque de escenas.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const IS_MOBILE = window.matchMedia("(max-width: 760px)").matches;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* LOADER                                                               */
  /* ------------------------------------------------------------------ */
  const loader = document.getElementById("loader");
  const loaderFill = document.querySelector(".loader-fill");
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 22;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add("hidden");
        playHeroIntro();
      }, 280);
    }
    loaderFill.style.width = progress + "%";
  }, 140);

  /* ------------------------------------------------------------------ */
  /* NAVBAR                                                               */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const onScrollNav = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
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
  /* HERO INTRO (texto + botones + fundador)                              */
  /* ------------------------------------------------------------------ */
  function playHeroIntro() {
    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      .fromTo(
        ".hero-title .line",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.12 },
        0.25
      )
      .to(".hero-sub", { opacity: 1, duration: 0.7 }, 0.75)
      .to(".hero-cta", { opacity: 1, duration: 0.6 }, 0.95)
      .to(
        ".hero-founder",
        { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.4)" },
        1.05
      );
  }

  /* ------------------------------------------------------------------ */
  /* SCROLL CUE -> baja al menú                                           */
  /* ------------------------------------------------------------------ */
  document.getElementById("scrollCue").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("orderNowBtn").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("viewMenuBtn").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  /* ------------------------------------------------------------------ */
  /* SCROLL REVEAL (promos + secciones) vía GSAP ScrollTrigger            */
  /* ------------------------------------------------------------------ */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".promo-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.08,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });
    });

    gsap.utils.toArray(".menu-card").forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
        delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: card, start: "top 90%" },
      });
    });

    gsap.from(".nosotros-copy > *", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: { trigger: "#nosotros", start: "top 70%" },
    });

    gsap.from(".founder-card", {
      opacity: 0,
      x: 30,
      duration: 0.9,
      scrollTrigger: { trigger: "#nosotros", start: "top 65%" },
    });
  }

  /* ------------------------------------------------------------------ */
  /* TILT 3D EN TARJETAS DE MENÚ                                          */
  /* ------------------------------------------------------------------ */
  if (!IS_MOBILE && !REDUCED_MOTION) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 14;
        const rotX = (0.5 - py) * 14;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* CARRITO simple                                                       */
  /* ------------------------------------------------------------------ */
  let cartCount = 0;
  const cartCountEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      cartCount += 1;
      cartCountEl.textContent = cartCount;
      showToast(`${btn.dataset.name} agregado al carrito`);
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          "#cartBtn",
          { scale: 1 },
          { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
        );
      }
    });
  });

  document.querySelectorAll(".promo-card .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cartCount += 1;
      cartCountEl.textContent = cartCount;
      showToast("Promoción agregada al carrito");
    });
  });

  document.getElementById("cartBtn").addEventListener("click", () => {
    showToast(cartCount > 0 ? `Tienes ${cartCount} producto(s) en el carrito` : "Tu carrito está vacío");
  });

  /* ------------------------------------------------------------------ */
  /* ESCENAS 3D                                                           */
  /* ------------------------------------------------------------------ */
  const heroCanvas = document.getElementById("hero-canvas");
  const experienceCanvas = document.getElementById("experience-canvas");
  const experienceSection = document.getElementById("experiencia");

  if (window.CRUJIENTE && window.CRUJIENTE.HAS_WEBGL && typeof THREE !== "undefined") {
    // HERO
    const heroScene = new window.CRUJIENTE.HeroScene(heroCanvas);

    // EXPERIENCIA (scroll-linked)
    const experienceScene = new window.CRUJIENTE.ExperienceScene(experienceCanvas, experienceSection);

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: experienceSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => experienceScene.setScrollProgress(self.progress),
      });
    } else {
      // Fallback sin GSAP: progreso manual por scroll
      window.addEventListener(
        "scroll",
        () => {
          const rect = experienceSection.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
          experienceScene.setScrollProgress(p);
        },
        { passive: true }
      );
    }

    // MINI ESCENAS dentro de las tarjetas de menú (lazy, solo desktop)
    if (!IS_MOBILE) {
      document.querySelectorAll("[data-mini-scene]").forEach((el) => {
        new window.CRUJIENTE.MiniProductScene(el);
      });
    }
  } else {
    // Fallback visual si WebGL no está disponible
    document.getElementById("hero").classList.add("no-webgl");
    if (heroCanvas) heroCanvas.style.display = "none";
    if (experienceCanvas) experienceCanvas.style.display = "none";
    document.querySelectorAll("[data-mini-scene]").forEach((el) => {
      el.style.background = "radial-gradient(circle at 40% 40%, #3a1006, #0b0a09)";
    });
    console.warn("CRUJIENTE: WebGL no disponible — usando presentación 2D de respaldo.");
  }
});

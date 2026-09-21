/* ==========================================================================
   CRUJIENTE — scene.js
   Todas las escenas Three.js del sitio:
     1. HeroScene         -> presa de pollo cayendo dentro del balde (HERO)
     2. ExperienceScene   -> balde flotando en espacio oscuro (scroll)
     3. MiniProductScene  -> piezas 3D pequeñas dentro de las tarjetas de menú

   MODELOS 3D EXTERNOS
   --------------------
   Este prototipo genera el pollo y el balde con geometría procedural para
   que la demo funcione de inmediato sin depender de archivos externos.

   Si más adelante quieres usar un modelo real (.glb), colócalo en:
     /models/chicken.glb
     /models/bucket.glb
   y descomenta el bloque "GLTFLoader" al final de este archivo. Si el
   archivo no existe, el código cae automáticamente en la geometría
   procedural (fallback), así la página nunca se rompe.
   ========================================================================== */

(function () {
  "use strict";

  const HAS_WEBGL = (function () {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  })();

  const IS_MOBILE = window.matchMedia("(max-width: 760px)").matches;
  const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.75 : 2);

  const PALETTE = {
    red: 0xd41623,
    redDark: 0x7a0d16,
    cream: 0xf3e6d0,
    gold: 0xd8a24a,
    crust: 0xc98a3c,
    crustDark: 0x8a5a24,
    black: 0x0b0a09,
  };

  /* ------------------------------------------------------------------ */
  /* Helpers de geometría procedural                                     */
  /* ------------------------------------------------------------------ */

  // Genera una "presa de pollo" abultada deformando una esfera con ruido.
  function buildChickenGeometry(radius = 1) {
    const geo = new THREE.IcosahedronGeometry(radius, 4);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n =
        Math.sin(v.x * 4.2 + v.y * 3.1) * 0.06 +
        Math.sin(v.y * 6.5 + v.z * 2.0) * 0.045 +
        Math.sin(v.z * 3.3 + v.x * 5.4) * 0.05;
      // estirar ligeramente para dar forma de "muslo"
      const stretch = 1 + Math.max(0, -v.y) * 0.35;
      v.multiplyScalar(1 + n).multiply(new THREE.Vector3(1, stretch, 1));
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function buildChickenMaterial() {
    return new THREE.MeshStandardMaterial({
      color: PALETTE.crust,
      roughness: 0.62,
      metalness: 0.05,
      emissive: new THREE.Color(PALETTE.crustDark),
      emissiveIntensity: 0.12,
    });
  }

  // Balde tipo frustum (cono truncado) con "franjas" simuladas por color.
  function buildBucketGroup() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(1.05, 0.8, 1.6, 32, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: PALETTE.red,
      roughness: 0.45,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // banda crema
    const bandGeo = new THREE.CylinderGeometry(1.07, 0.98, 0.42, 32, 1, true);
    const bandMat = new THREE.MeshStandardMaterial({
      color: PALETTE.cream,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 0.15;
    group.add(band);

    // base
    const baseGeo = new THREE.CircleGeometry(0.8, 32);
    const base = new THREE.Mesh(baseGeo, bodyMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.8;
    group.add(base);

    // borde superior
    const rimGeo = new THREE.TorusGeometry(1.05, 0.045, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: PALETTE.redDark, roughness: 0.4 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.8;
    group.add(rim);

    return group;
  }

  // Sistema de partículas reutilizable (vapor / migas / brillos)
  function buildParticles({ count, spread, size, color, opacity = 0.7 }) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  /* ------------------------------------------------------------------ */
  /* 1. HERO SCENE                                                       */
  /* ------------------------------------------------------------------ */
  class HeroScene {
    constructor(canvas) {
      this.canvas = canvas;
      this.clock = new THREE.Clock();
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.paused = false;

      this._initRenderer();
      this._initScene();
      this._initLights();
      this._buildObjects();
      this._buildSteam();
      this._buildCrumbs();
      this._bindEvents();
      this._animateLoop();
      this._scheduleDropCycle();
    }

    _initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      this.renderer.setPixelRatio(DPR);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this._resize();
    }

    _initScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(38, this._aspect(), 0.1, 100);
      this.camera.position.set(0, 0.4, 9);
      this.cameraBase = this.camera.position.clone();
    }

    _initLights() {
      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      this.scene.add(ambient);

      const key = new THREE.SpotLight(0xffe4c4, 3.2, 30, Math.PI / 6, 0.4, 1.2);
      key.position.set(3.5, 6, 4);
      this.scene.add(key);

      const rim = new THREE.PointLight(PALETTE.red, 2.4, 20, 2);
      rim.position.set(-3, 1, -2);
      this.scene.add(rim);

      const fill = new THREE.PointLight(0xfff2d9, 0.9, 15);
      fill.position.set(0, -2, 3);
      this.scene.add(fill);
    }

    _buildObjects() {
      // Balde (en perspectiva, ligeramente rotado)
      this.bucket = buildBucketGroup();
      this.bucket.position.set(0.9, -1.7, 0);
      this.bucket.rotation.y = -0.35;
      this.bucket.scale.setScalar(1.35);
      this.scene.add(this.bucket);

      // Presa de pollo (entra desde arriba)
      this.chicken = new THREE.Mesh(buildChickenGeometry(0.62), buildChickenMaterial());
      this.chicken.position.set(0.5, 9, 0.4);
      this.chicken.rotation.set(0.4, 0.2, 0.1);
      this.scene.add(this.chicken);

      // grupo "cámara cinematográfica" para desplazar todo sutilmente con el mouse
      this.parallaxGroup = new THREE.Group();
    }

    _buildSteam() {
      const count = IS_MOBILE ? 60 : 160;
      this.steam = buildParticles({
        count,
        spread: { x: 1.6, y: 1.4, z: 1.6 },
        size: IS_MOBILE ? 0.09 : 0.07,
        color: 0xfff1d8,
        opacity: 0.35,
      });
      this.steam.position.copy(this.chicken.position);
      this.scene.add(this.steam);
    }

    _buildCrumbs() {
      const count = IS_MOBILE ? 26 : 60;
      this.crumbs = buildParticles({
        count,
        spread: { x: 0.1, y: 0.1, z: 0.1 },
        size: 0.045,
        color: PALETTE.gold,
        opacity: 0,
      });
      this.crumbs.position.set(0.9, -1.1, 0.3);
      this.crumbVelocities = [];
      const c = this.crumbs.geometry.attributes.position.count;
      for (let i = 0; i < c; i++) {
        this.crumbVelocities.push(
          new THREE.Vector3((Math.random() - 0.5) * 2.4, Math.random() * 2.2, (Math.random() - 0.5) * 2.4)
        );
      }
      this.crumbActive = false;
      this.scene.add(this.crumbs);
    }

    _bindEvents() {
      window.addEventListener("resize", () => this._resize());

      if (!IS_MOBILE) {
        window.addEventListener("mousemove", (e) => {
          this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
          this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
      }

      document.addEventListener("visibilitychange", () => {
        this.paused = document.hidden;
      });
    }

    _aspect() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      return rect.width / Math.max(rect.height, 1);
    }

    _resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.renderer.setSize(rect.width, rect.height, false);
      if (this.camera) {
        this.camera.aspect = rect.width / Math.max(rect.height, 1);
        this.camera.updateProjectionMatrix();
      }
    }

    /* --- animación principal de caída, repetida en bucle elegante --- */
    _scheduleDropCycle() {
      if (typeof gsap === "undefined") return;

      const startY = 9;
      const endY = -1.15;

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2.6,
        defaults: { ease: "power2.inOut" },
      });

      gsap.set(this.chicken.position, { y: startY });
      gsap.set(this.chicken.scale, { x: 1, y: 1, z: 1 });

      tl.to(this.chicken.rotation, { y: "+=6.4", duration: 2.4, ease: "none" }, 0)
        .to(this.chicken.position, { y: endY, duration: 1.9, ease: "power1.in" }, 0.15)
        .add(() => this._onImpact(), 2.02)
        .to(this.chicken.scale, { x: 1.18, y: 0.78, z: 1.18, duration: 0.12, ease: "power1.out" }, 2.02)
        .to(this.chicken.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: "elastic.out(1,0.4)" }, 2.14)
        .to(this.bucket.rotation, { z: "+=0.05", duration: 0.14, yoyo: true, repeat: 1 }, 2.02)
        .to(this.bucket.position, { y: "-=0.08", duration: 0.12, yoyo: true, repeat: 1 }, 2.02)
        // pequeño movimiento cinematográfico de cámara tras el impacto
        .to(this.camera.position, { x: this.cameraBase.x + 0.4, z: this.cameraBase.z - 0.6, duration: 1.1, ease: "power2.out" }, 2.1)
        .to(this.camera.position, { x: this.cameraBase.x, z: this.cameraBase.z, duration: 1.3, ease: "power2.inOut" }, 3.3)
        // reset silencioso antes del próximo ciclo
        .set(this.chicken.position, { y: startY }, 5.0)
        .set(this.chicken.rotation, { y: 0.2 }, 5.0);

      this.dropTimeline = tl;
    }

    _onImpact() {
      this.crumbActive = true;
      this.crumbClock = 0;
      this.crumbs.material.opacity = 0.9;
      const positions = this.crumbs.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.setXYZ(i, 0, 0, 0);
      }
      positions.needsUpdate = true;
    }

    _updateCrumbs(dt) {
      if (!this.crumbActive) return;
      this.crumbClock += dt;
      const positions = this.crumbs.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const vel = this.crumbVelocities[i];
        const x = vel.x * this.crumbClock;
        const y = vel.y * this.crumbClock - 2.2 * this.crumbClock * this.crumbClock;
        const z = vel.z * this.crumbClock;
        positions.setXYZ(i, x, y, z);
      }
      positions.needsUpdate = true;
      this.crumbs.material.opacity = Math.max(0, 0.9 - this.crumbClock * 0.9);
      if (this.crumbClock > 1.1) this.crumbActive = false;
    }

    _updateSteam(t) {
      const positions = this.steam.geometry.attributes.position;
      const speeds = this.steam.geometry.attributes.aSpeed;
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i) + speeds.getX(i) * 0.006;
        if (y > 1.1) y = -1.1;
        positions.setY(i, y);
        positions.setX(i, positions.getX(i) + Math.sin(t + i) * 0.0009);
      }
      positions.needsUpdate = true;
      this.steam.position.y = this.chicken.position.y;
      this.steam.position.x = this.chicken.position.x;
    }

    _animateLoop() {
      const tick = () => {
        requestAnimationFrame(() => this._animateLoop());
        if (this.paused) return;
        const dt = Math.min(this.clock.getDelta(), 0.05);
        const t = this.clock.elapsedTime;

        // parallax de mouse -> cámara sutil
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;
        this.camera.position.x = this.cameraBase.x + this.mouse.x * 0.5;
        this.camera.position.y = this.cameraBase.y - this.mouse.y * 0.3;
        this.camera.lookAt(0.4, -0.2, 0);

        this.chicken.rotation.x = 0.4 + Math.sin(t * 0.6) * 0.05;
        this._updateSteam(t);
        this._updateCrumbs(dt);

        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }

    dispose() {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      this.renderer.dispose();
      if (this.dropTimeline) this.dropTimeline.kill();
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. EXPERIENCE SCENE (balde flotando + scroll)                       */
  /* ------------------------------------------------------------------ */
  class ExperienceScene {
    constructor(canvas, sectionEl) {
      this.canvas = canvas;
      this.section = sectionEl;
      this.clock = new THREE.Clock();
      this.paused = false;
      this.scrollProgress = 0;

      this._initRenderer();
      this._initScene();
      this._buildObjects();
      this._buildParticles();
      this._bindEvents();
      this._animateLoop();
    }

    _initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      this.renderer.setPixelRatio(DPR);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this._resize();
    }

    _initScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(42, this._aspect(), 0.1, 100);
      this.camera.position.set(0, 0.4, 6.5);

      const ambient = new THREE.AmbientLight(0xffffff, 0.35);
      this.scene.add(ambient);

      const spot = new THREE.SpotLight(0xffd9a0, 3.4, 25, Math.PI / 5, 0.5, 1.4);
      spot.position.set(3, 4, 4);
      this.scene.add(spot);

      const rim = new THREE.PointLight(PALETTE.red, 2.6, 18);
      rim.position.set(-3, -1, -2);
      this.scene.add(rim);
    }

    _buildObjects() {
      this.bucket = buildBucketGroup();
      this.bucket.scale.setScalar(1.6);
      this.scene.add(this.bucket);

      // un par de piezas de pollo orbitando el balde
      this.pieces = [];
      const n = IS_MOBILE ? 2 : 4;
      for (let i = 0; i < n; i++) {
        const mesh = new THREE.Mesh(buildChickenGeometry(0.34), buildChickenMaterial());
        const angle = (i / n) * Math.PI * 2;
        mesh.userData.angle = angle;
        mesh.userData.radius = 2.1 + Math.random() * 0.4;
        mesh.userData.height = (Math.random() - 0.5) * 1.4;
        this.scene.add(mesh);
        this.pieces.push(mesh);
      }
    }

    _buildParticles() {
      const count = IS_MOBILE ? 70 : 220;
      this.ambientParticles = buildParticles({
        count,
        spread: { x: 8, y: 5, z: 6 },
        size: 0.03,
        color: PALETTE.cream,
        opacity: 0.5,
      });
      this.scene.add(this.ambientParticles);
    }

    _bindEvents() {
      window.addEventListener("resize", () => this._resize());
      document.addEventListener("visibilitychange", () => {
        this.paused = document.hidden;
      });
    }

    _aspect() {
      const rect = this.canvas.getBoundingClientRect();
      return rect.width / Math.max(rect.height, 1);
    }

    _resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.renderer.setSize(rect.width, rect.height, false);
      this.camera.aspect = rect.width / Math.max(rect.height, 1);
      this.camera.updateProjectionMatrix();
    }

    setScrollProgress(p) {
      this.scrollProgress = p; // 0 -> 1
    }

    _animateLoop() {
      const tick = () => {
        requestAnimationFrame(() => this._animateLoop());
        if (this.paused) return;
        const dt = Math.min(this.clock.getDelta(), 0.05);
        const t = this.clock.elapsedTime;
        const p = this.scrollProgress;

        // cámara orbita lentamente y avanza según el scroll
        const angle = t * 0.15 + p * Math.PI * 1.1;
        const radius = 6.2 - p * 2.4;
        this.camera.position.x = Math.sin(angle) * radius;
        this.camera.position.z = Math.cos(angle) * radius;
        this.camera.position.y = 0.3 + p * 1.1 + Math.sin(t * 0.4) * 0.08;
        this.camera.lookAt(0, 0, 0);

        this.bucket.rotation.y = t * 0.2;

        this.pieces.forEach((mesh, i) => {
          const a = mesh.userData.angle + t * 0.25;
          mesh.position.set(
            Math.cos(a) * mesh.userData.radius,
            mesh.userData.height + Math.sin(t * 0.6 + i) * 0.15,
            Math.sin(a) * mesh.userData.radius
          );
          mesh.rotation.x += dt * 0.4;
          mesh.rotation.y += dt * 0.3;
        });

        this.ambientParticles.rotation.y += dt * 0.02;

        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }

    dispose() {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      this.renderer.dispose();
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. MINI PRODUCT SCENE (tarjeta de menú "Pollo Crispy")               */
  /* ------------------------------------------------------------------ */
  class MiniProductScene {
    constructor(container) {
      this.container = container;
      this.clock = new THREE.Clock();
      this.paused = false;

      const canvas = document.createElement("canvas");
      container.appendChild(canvas);
      this.canvas = canvas;

      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
      this.camera.position.set(0, 0, 4.2);

      const key = new THREE.DirectionalLight(0xffe4c4, 1.6);
      key.position.set(2, 2, 3);
      this.scene.add(key);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const rim = new THREE.PointLight(PALETTE.red, 1.4, 10);
      rim.position.set(-2, -1, -1);
      this.scene.add(rim);

      this.mesh = new THREE.Mesh(buildChickenGeometry(1.15), buildChickenMaterial());
      this.scene.add(this.mesh);

      this._resize();
      window.addEventListener("resize", () => this._resize());

      this._io = new IntersectionObserver(
        (entries) => entries.forEach((en) => (this.paused = !en.isIntersecting)),
        { threshold: 0.1 }
      );
      this._io.observe(container);

      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        this.hoverX = (e.clientX - rect.left) / rect.width - 0.5;
        this.hoverY = (e.clientY - rect.top) / rect.height - 0.5;
      });
      container.addEventListener("mouseenter", () => (this.hovering = true));
      container.addEventListener("mouseleave", () => (this.hovering = false));

      this._animate();
    }

    _resize() {
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0) return;
      this.renderer.setSize(rect.width, rect.height, false);
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
    }

    _animate() {
      const tick = () => {
        requestAnimationFrame(() => this._animate());
        if (this.paused) return;
        const dt = Math.min(this.clock.getDelta(), 0.05);
        this.mesh.rotation.y += dt * 0.5;

        const targetScale = this.hovering ? 1.12 : 1;
        this.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        if (this.hovering && this.hoverX !== undefined) {
          this.mesh.rotation.x += (this.hoverY * 0.6 - this.mesh.rotation.x) * 0.06;
        }

        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                            */
  /* ------------------------------------------------------------------ */
  window.CRUJIENTE = window.CRUJIENTE || {};
  window.CRUJIENTE.HAS_WEBGL = HAS_WEBGL;
  window.CRUJIENTE.HeroScene = HeroScene;
  window.CRUJIENTE.ExperienceScene = ExperienceScene;
  window.CRUJIENTE.MiniProductScene = MiniProductScene;
})();

/* ==========================================================================
   OPCIONAL: carga de modelos .glb reales
   --------------------------------------------------------------------------
   Si agregas los archivos /models/chicken.glb y /models/bucket.glb, puedes
   reemplazar la geometría procedural por el modelo real así:

   const loader = new THREE.GLTFLoader(); // requiere cargar GLTFLoader.js
   loader.load(
     "models/chicken.glb",
     (gltf) => scene.add(gltf.scene),
     undefined,
     (err) => console.warn("No se encontró chicken.glb, usando fallback procedural.", err)
   );

   El resto del código ya está preparado para seguir funcionando aunque este
   archivo no exista: por defecto siempre usa la geometría procedural.
   ========================================================================== */

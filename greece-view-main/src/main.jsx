import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.esm.jsx';
import { ArrowUpRight, Camera, Mail, Menu, MoveDown, X } from 'lucide-react';
import './styles.css';

const VIDEO_URL = './lv_0_20260916003309.mp4';

const sectionClass = 'px-[clamp(1.25rem,6vw,6.5rem)] py-[clamp(5.5rem,10vw,10.5rem)] max-[780px]:px-5 max-[780px]:py-[5.5rem]';
const eyebrowClass = 'm-0 flex items-center gap-[.7rem] font-mono text-[.61rem] uppercase leading-[1.4] tracking-[.13em] text-muted';
const eyebrowLineClass = 'inline-block h-px w-[2.1rem] bg-accent';
const headingClass = 'm-0 mt-6 font-serif text-[clamp(3.6rem,7.4vw,8.2rem)] font-normal leading-[.87] tracking-[-.07em]';
const revealClass = 'reveal translate-y-8 opacity-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100';

const journeys = [
  {
    number: '01',
    eyebrow: 'Hidratación · Rostro',
    title: 'Crema\nEsencial',
    description: 'Una crema nutritiva de textura ligera que devuelve confort, suavidad y luminosidad a la piel.',
    details: '50 ml  ·  Para todo tipo de piel',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1800&q=88',
    orientation: 'landscape',
  },
  {
    number: '02',
    eyebrow: 'Calma · Piel sensible',
    title: 'Loción\nSerena',
    description: 'Una loción calmante que hidrata sin peso y acompaña la piel durante todo el día.',
    details: '200 ml  ·  Con aloe y avena',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1500&q=88',
    orientation: 'portrait',
  },
  {
    number: '03',
    eyebrow: 'Nutrición · Cuerpo',
    title: 'Bálsamo,\nsin prisa',
    description: 'Un bálsamo envolvente para nutrir las zonas secas y dejar la piel flexible y radiante.',
    details: '120 ml  ·  Con manteca de karité',
    image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?auto=format&fit=crop&w=1600&q=88',
    orientation: 'wide',
  },
];

const experienceItems = [
  ['01', 'Fórmulas cuidadas', 'Ingredientes seleccionados por su eficacia y suavidad, combinados para respetar el equilibrio natural de tu piel.'],
  ['02', 'Texturas excepcionales', 'Cremas que se funden, lociones que refrescan y bálsamos que envuelven: sensaciones pensadas para disfrutar cada aplicación.'],
  ['03', 'Ingredientes honestos', 'Aloe, avena, manteca de karité y aceites botánicos: activos reconocibles que cuidan la piel sin complicarla.'],
  ['04', 'Cuidado diario', 'Una rutina sencilla y consciente, desde la limpieza hasta la hidratación, para que tu piel se sienta bien todos los días.'],
];

function ArrowLink({ children, light = false }) {
  return (
    <a
      className={`inline-flex w-fit items-center gap-[.6rem] border-b border-ink pb-[.45rem] text-[.75rem] uppercase tracking-[.08em] transition-[gap,color,border-color] duration-300 hover:gap-[.9rem] hover:border-accent hover:text-accent ${light ? 'border-[rgba(245,243,238,.7)] text-paper' : ''}`}
      href="#journeys"
    >
      <span>{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.4} />
    </a>
  );
}

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative h-[300vh] bg-[#111] text-paper max-[780px]:h-[250vh]" id="top">
      <div className="absolute inset-0 z-[1] h-full w-full overflow-hidden bg-[#111] [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:object-cover [&_canvas]:object-center [&_video]:h-full [&_video]:w-full [&_video]:object-cover [&_video]:object-center" aria-hidden="true">
        <ScrollyVideo
          src={VIDEO_URL}
          transitionSpeed={16}
          frameThreshold={0.04}
          cover
          sticky
          full
          trackScroll
          lockScroll={false}
          useWebCodecs
        />
      </div>
      <div className="sticky top-0 z-[3] h-screen overflow-hidden after:absolute after:bottom-[1.05rem] after:left-[clamp(1.25rem,4vw,4.25rem)] after:right-[clamp(1.25rem,4vw,4.25rem)] after:z-[4] after:h-px after:bg-[rgba(245,243,238,.25)] after:content-['']">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-vignette" />
        <header className="absolute left-0 top-0 z-[4] flex w-full items-center justify-between px-[clamp(1.25rem,4vw,4.25rem)] py-7 max-[780px]:p-5">
          <a className="flex items-center gap-[.8rem] text-paper" href="#top" aria-label="Inicio de Lúmina Skin">
            <span className="grid size-[1.85rem] place-items-center rounded-full border border-current font-serif text-[.68rem] tracking-[-.06em]">LS</span>
            <span className="text-[.72rem] uppercase tracking-[.16em] max-[780px]:text-[.63rem]">Lúmina Skin</span>
          </a>
          <nav className={`ml-auto mr-[2.9rem] flex items-center gap-[clamp(1.4rem,3vw,3.1rem)] font-mono text-[.59rem] uppercase tracking-[.13em] max-[780px]:absolute max-[780px]:right-5 max-[780px]:top-[4.5rem] max-[780px]:m-0 max-[780px]:flex-col max-[780px]:items-end max-[780px]:gap-[1.3rem] max-[780px]:py-[1.2rem] max-[780px]:pb-[1.4rem] ${menuOpen ? 'max-[780px]:flex' : 'max-[780px]:hidden'}`} aria-label="Navegación principal">
            {['Productos', 'La rutina', 'Contacto'].map((label, index) => (
              <a
                className="relative opacity-80 transition-opacity duration-300 hover:opacity-100 after:absolute after:bottom-[-.45rem] after:left-0 after:right-0 after:h-px after:origin-right after:scale-x-0 after:bg-paper after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
                href={['#journeys', '#experience', '#contact'][index]}
                onClick={() => setMenuOpen(false)}
                key={label}
              >
                {label}
              </a>
            ))}
          </nav>
          <button className="hidden cursor-pointer border-0 bg-transparent p-0 text-paper max-[780px]:block" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {menuOpen ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}
          </button>
        </header>

        <div className="absolute left-[clamp(1.25rem,10vw,10.5rem)] top-1/2 z-[3] -translate-y-[42%] max-[780px]:left-5 max-[780px]:right-5 max-[780px]:top-[48%]">
          <p className="mb-[1.35rem] flex items-center gap-[.7rem] font-mono text-[.61rem] uppercase leading-[1.4] tracking-[.13em] text-[rgba(245,243,238,.74)]"><span className={eyebrowLineClass} />Cuidado esencial, pensado</p>
          <h1 className="m-0 max-w-[10ch] font-serif text-[clamp(4rem,8.3vw,9.6rem)] font-normal leading-[.89] tracking-[-.066em] max-[780px]:text-[clamp(3.7rem,16vw,6.3rem)]">Tu piel, <em className="text-[#e6d7c3] italic">más</em><br />luminosa.</h1>
          <p className="mb-8 mt-[1.65rem] text-[clamp(.95rem,1.25vw,1.18rem)] leading-[1.5] tracking-[-.015em] text-[rgba(245,243,238,.8)] max-[780px]:mt-5"><span>Cremas y lociones para el cuidado</span><br className="max-[780px]:hidden" /> diario de tu piel.</p>
          <a className="inline-flex items-center gap-[1.4rem] font-mono text-[.62rem] uppercase tracking-[.15em]" href="#journeys">
            <span>Explora productos</span>
            <span className="grid size-10 place-items-center rounded-full border border-[rgba(245,243,238,.62)] transition-[background,color,transform] duration-300 hover:rotate-45 hover:bg-paper hover:text-ink"><ArrowUpRight size={17} strokeWidth={1.3} /></span>
          </a>
        </div>

        <div className="absolute bottom-9 left-[clamp(1.25rem,4vw,4.25rem)] right-[clamp(1.25rem,4vw,4.25rem)] z-[3] flex items-center justify-between font-mono text-[.56rem] uppercase tracking-[.1em] text-[rgba(245,243,238,.72)] max-[780px]:bottom-[1.7rem] max-[780px]:left-5 max-[780px]:right-5">
          <span className="max-[780px]:hidden">Piel / 100% cuidado</span>
          <div className="flex translate-x-6 items-center gap-2 max-[780px]:translate-x-0"><MoveDown className="animate-nudge" size={14} strokeWidth={1.2} /><span>Desliza para descubrir</span></div>
          <span className="text-paper">LS / 01</span>
        </div>
      </div>
    </section>
  );
}

function LoadingScreen({ ready }) {
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-paper text-ink opacity-100 transition-[opacity,visibility] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)] ${ready ? 'pointer-events-none invisible opacity-0' : ''}`} role="status" aria-live="polite" aria-label="Preparando tu rutina">
      <div className="flex w-[min(15rem,calc(100vw-2.5rem))] flex-col items-center">
        <div className="grid size-[3.1rem] place-items-center rounded-full border border-ink font-serif text-[1.05rem] tracking-[-.08em]">AV</div>
        <p className="mb-0 mt-[1.1rem] text-[.68rem] uppercase tracking-[.2em]">Lúmina Skin</p>
        <div className="relative mt-[3.2rem] h-px w-full overflow-hidden bg-[rgba(29,29,26,.16)]" aria-hidden="true"><span className="absolute left-[-35%] top-0 h-px w-[35%] animate-loading-sweep bg-accent" /></div>
        <p className="mb-0 mt-[.9rem] font-mono text-[.55rem] uppercase tracking-[.12em] text-muted">Preparando tu rutina</p>
      </div>
    </div>
  );
}

function JourneyFeature({ journey, index }) {
  const layoutClass = {
    landscape: 'col-span-7 max-[780px]:col-auto',
    portrait: 'col-span-4 col-start-9 mt-[17%] max-[780px]:col-auto max-[780px]:mt-0',
    wide: 'col-span-8 col-start-3 grid grid-cols-[1.15fr_.85fr] items-end gap-x-[8%] max-[780px]:col-auto max-[780px]:block',
  }[journey.orientation];
  const imageClass = {
    landscape: 'aspect-[1.32/1] max-[780px]:aspect-[1.15/1]',
    portrait: 'aspect-[.78/1] max-[780px]:aspect-[.9/1]',
    wide: 'aspect-[1.32/1] max-[780px]:aspect-[1.15/1]',
  }[journey.orientation];
  const copyClass = {
    landscape: 'pl-[9%] max-[780px]:pl-0',
    portrait: 'pl-[7%] max-[780px]:pl-0',
    wide: 'pb-6 max-[780px]:pb-0',
  }[journey.orientation];
  const delayClass = ['', 'delay-100', 'delay-200'][index];

  return (
    <article className={`${revealClass} group relative mb-0 ${delayClass} ${layoutClass}`}>
      <div className={`relative overflow-hidden bg-paper-deep ${imageClass}`}>
        <img className="block h-full w-full scale-[1.025] object-cover saturate-[.78] transition-[filter,transform] duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:saturate-100" src={journey.image} alt={`${journey.title.replace('\n', ' ')} landscape`} loading="lazy" />
        <span className="absolute left-5 top-5 font-mono text-[.62rem] tracking-[.12em] text-paper [text-shadow:0_1px_12px_rgba(0,0,0,.25)]">{journey.number}</span>
      </div>
      <div className={`pt-[1.55rem] ${copyClass}`}>
        <p className={eyebrowClass}>{journey.eyebrow}</p>
        <h3 className="mb-4 mt-[.95rem] font-serif text-[clamp(2.8rem,5.1vw,5.5rem)] font-normal leading-[.87] tracking-[-.065em]">{journey.title.split('\n').map((line, lineIndex) => <React.Fragment key={line}>{lineIndex > 0 && <br />}{line}</React.Fragment>)}</h3>
        <p className="mb-5 mt-0 max-w-[19rem] text-[.85rem] leading-[1.55] text-muted">{journey.description}</p>
        <p className="mb-[1.6rem] mt-0 font-mono text-[.59rem] uppercase tracking-[.09em]">{journey.details}</p>
        <ArrowLink>Ver producto</ArrowLink>
      </div>
    </article>
  );
}

function Journeys() {
  return (
    <section className={`relative bg-paper ${sectionClass}`} id="journeys">
      <div className={`${revealClass} mb-[clamp(5rem,10vw,10rem)] flex items-end justify-between max-[780px]:mb-20 max-[780px]:block`}>
        <div>
          <p className={eyebrowClass}><span className={eyebrowLineClass} />La colección</p>
          <h2 className={`${headingClass} text-ink`}>Cuida lo que<br /><em className="text-accent italic">tu piel necesita.</em></h2>
        </div>
        <div className="mb-2 max-w-[19.5rem] max-[780px]:mt-[2.7rem]">
          <p className="mb-8 mt-0 text-[.95rem] leading-[1.55] text-muted">Fórmulas pequeñas y muy pensadas para quienes buscan más que una rutina. Cada producto es un gesto de cuidado.</p>
          <ArrowLink>Ver todos los productos</ArrowLink>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-[clamp(6rem,12vw,13rem)] max-[780px]:block">
        {journeys.map((journey, index) => <JourneyFeature key={journey.number} journey={journey} index={index} />)}
      </div>
    </section>
  );
}

function Experience() {
  const experienceRef = useRef(null);

  useEffect(() => {
    const items = experienceRef.current?.querySelectorAll('.reveal');
    if (!items?.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`grid grid-cols-[1fr_minmax(20rem,31vw)] gap-x-[clamp(3rem,9vw,10rem)] gap-y-28 bg-paper-deep ${sectionClass} max-[780px]:block`} id="experience" ref={experienceRef}>
      <div className={`${revealClass} max-w-[34rem] self-end max-[780px]:mb-16`}>
        <p className={eyebrowClass}><span className={eyebrowLineClass} />La experiencia de cuidado</p>
        <h2 className={`${headingClass} text-ink`}>Menos pasos.<br /><em className="text-accent italic">Más piel.</em></h2>
        <p className="mb-0 mt-[2.7rem] max-w-96 text-base leading-[1.65] text-muted max-[780px]:mt-8">Creamos esenciales que convierten el cuidado diario en un momento de calma, suavidad y conexión contigo.</p>
      </div>
      <div className={`${revealClass} relative col-start-2 row-span-2 row-start-1 mt-8 self-start max-[780px]:mb-20 max-[780px]:mt-0`}>
        <img className="block aspect-[.75/1] w-full object-cover saturate-[.72] max-[780px]:aspect-[1/1.1]" src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1500&q=88" alt="Crema y loción para el cuidado de la piel" loading="lazy" />
        <span className="mt-[.85rem] block font-mono text-[.55rem] uppercase tracking-[.12em] text-muted">Piel hidratada, todos los días</span>
      </div>
      <div className="col-start-1 border-t border-line">
        {experienceItems.map(([number, title, copy], index) => (
          <div className={`${revealClass} group grid grid-cols-[2.1rem_minmax(9rem,14rem)_1fr_1.2rem] items-start gap-4 border-b border-line py-[1.55rem] max-[780px]:grid-cols-[1.6rem_1fr_1.2rem] max-[780px]:gap-[.7rem] ${['', 'delay-100', 'delay-200', 'delay-300'][Math.min(index, 3)]}`} key={number}>
            <span className="font-mono text-[.58rem] text-accent">{number}</span>
            <h3 className="m-0 font-serif text-[1.35rem] font-normal leading-normal tracking-[-.035em] max-[780px]:text-[1.22rem]">{title}</h3>
            <p className="m-0 max-w-[18rem] text-[.8rem] leading-[1.55] text-muted max-[780px]:col-start-2 max-[780px]:col-end-3 max-[780px]:mt-[.2rem]">{copy}</p>
            <ArrowUpRight className="justify-self-end text-accent transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" size={18} strokeWidth={1.2} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={`bg-ink text-paper ${sectionClass} pt-[clamp(5.5rem,10vw,10rem)]`} id="contact">
      <div className="pb-[clamp(7rem,13vw,13rem)]">
        <p className="m-0 flex items-center gap-[.7rem] font-mono text-[.61rem] uppercase leading-[1.4] tracking-[.13em] text-[rgba(245,243,238,.57)]"><span className={eyebrowLineClass} />Comienza tu ritual</p>
        <h2 className={`${headingClass} mt-6 text-[clamp(4rem,9vw,10rem)] text-paper`}>Tu piel<br /><em className="text-[#c49b70] italic">te lo agradecerá.</em></h2>
        <a className="mt-[3.3rem] inline-flex items-center gap-4 border-b border-[rgba(245,243,238,.62)] pb-3 font-serif text-[clamp(1.2rem,2vw,1.75rem)] italic transition-[color,border-color] duration-300 hover:border-[#c49b70] hover:text-[#c49b70]" href="mailto:hola@luminaskin.com">hola@luminaskin.com <ArrowUpRight size={20} strokeWidth={1.2} /></a>
      </div>
      <div className="flex justify-between gap-12 border-t border-[rgba(245,243,238,.23)] pt-8 max-[780px]:block">
        <a className="flex items-center gap-[.8rem] text-paper" href="#top"><span className="grid size-[1.85rem] place-items-center rounded-full border border-current font-serif text-[.68rem] tracking-[-.06em]">LS</span><span className="text-[.72rem] uppercase tracking-[.16em] max-[780px]:text-[.63rem]">Lúmina Skin</span></a>
        <div className="grid grid-cols-3 gap-[clamp(2rem,6vw,7rem)] max-[780px]:mt-[4.5rem] max-[780px]:grid-cols-2 max-[780px]:gap-x-6 max-[780px]:gap-y-12">
          <div className="flex flex-col gap-[.65rem]"><span className="mb-[.65rem] font-mono text-[.56rem] uppercase tracking-[.12em] text-[rgba(245,243,238,.42)]">Explora</span><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#journeys">Productos</a><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#experience">La rutina</a><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#top">Nuestro enfoque</a></div>
          <div className="flex flex-col gap-[.65rem]"><span className="mb-[.65rem] font-mono text-[.56rem] uppercase tracking-[.12em] text-[rgba(245,243,238,.42)]">Fórmulas</span><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#journeys">Cremas</a><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#journeys">Lociones</a><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#journeys">Bálsamos</a></div>
          <div className="flex flex-col gap-[.65rem]"><span className="mb-[.65rem] font-mono text-[.56rem] uppercase tracking-[.12em] text-[rgba(245,243,238,.42)]">Síguenos</span><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="#top"><Camera size={15} strokeWidth={1.3} />Instagram</a><a className="flex items-center gap-[.45rem] text-[.72rem] leading-[1.3] text-[rgba(245,243,238,.7)] transition-colors duration-300 hover:text-paper" href="mailto:hola@luminaskin.com"><Mail size={15} strokeWidth={1.3} />Escríbenos</a></div>
        </div>
      </div>
      <div className="mt-[6.5rem] flex items-center justify-between font-mono text-[.53rem] uppercase tracking-[.08em] text-[rgba(245,243,238,.4)] max-[780px]:mt-[5.5rem] max-[780px]:flex-col max-[780px]:items-start max-[780px]:gap-[.7rem]"><span>© 2026 Lúmina Skin</span><span>Cuidado diario, pensado con detalle</span><a className="text-[rgba(245,243,238,.68)] transition-colors duration-300 hover:text-paper" href="#top">Volver arriba ↑</a></div>
    </footer>
  );
}

function App() {
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    let active = true;
    const documentReady = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([documentReady, fontsReady]).then(() => {
      if (active) setPageReady(true);
    });

    return () => { active = false; };
  }, []);

  const ready = pageReady;

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    if (!ready) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [ready]);

  useEffect(() => {
    const reveals = document.querySelectorAll('#journeys .reveal, footer .reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <LoadingScreen ready={ready} />
      <main aria-hidden={!ready}>
        <Hero />
        <Journeys />
        <Experience />
        <Footer />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

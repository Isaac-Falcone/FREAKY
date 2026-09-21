import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AutoVideoCanvas } from "./AutoVideoCanvas";

interface VideoSlide { type: "video" }
interface ImageSlide {
  type: "image";
  src: string;
  title: string;
  cta1?: { label: string; href: string };
  cta2?: { label: string; href: string };
}
type Slide = VideoSlide | ImageSlide;

const SLIDES: Slide[] = [
  { type: "video" },
  { type: "image", src: "/slide1.jpeg", title: "STARPHASE",
    cta1: { label: "SHOP MEN'S", href: "#deals" },
    cta2: { label: "SHOP WOMEN'S", href: "#drops" } },
  { type: "image", src: "/slide2.jpeg", title: "OUTERWEAR 26",
    cta1: { label: "SHOP JACKETS", href: "#deals" } },
  { type: "image", src: "/slide3.jpeg", title: "UNLEASHED",
    cta1: { label: "SHOP T-SHIRTS", href: "#drops" } },
  { type: "image", src: "/slide4.jpeg", title: "GHETTO STAR",
    cta1: { label: "SHOP COLLECTION", href: "#drops" } },
];

// Vídeo: 192 frames a 24fps = 8000ms
// Fotos: 6 segundos cada
const SLIDE_DURATION: Record<string, number> = {
  video: 8000,
  image: 6000,
};

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => setCurrent(index), []);

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % SLIDES.length), []);

  // Auto-advance: 8s para o vídeo, 6s para as fotos
  useEffect(() => {
    if (isHovered) return;
    const duration = SLIDE_DURATION[SLIDES[current].type] ?? 6000;
    timerRef.current = setTimeout(next, duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isHovered, next]);

  return (
    <section
      id="hero-carousel"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── Slide Track ─── */}
      <div
        className="flex h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div key={i} className="relative h-full min-w-full shrink-0">
            {s.type === "video" ? (
              /* Vídeo em loop — sem overlays, cores vivas */
              <AutoVideoCanvas className="absolute inset-0 h-full w-full" />
            ) : (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-top"
                  style={{ backgroundColor: "#111", backgroundImage: `url(${s.src})` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-[10%] left-[5%] lg:bottom-[15%] lg:left-[8%]">
                  <h2 className="mb-6 font-sans text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl lg:text-8xl">
                    {s.title}
                  </h2>
                  <div className="flex flex-col items-start gap-3">
                    {s.cta1 && (
                      <a href={s.cta1.href} className="bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-200">
                        {s.cta1.label}
                      </a>
                    )}
                    {s.cta2 && (
                      <a href={s.cta2.href} className="bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-200">
                        {s.cta2.label}
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ─── Setas ─── */}
      <button aria-label="Slide anterior" onClick={prev}
        className="absolute left-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-black backdrop-blur-md transition-all hover:scale-110 hover:bg-white/60 lg:left-6">
        <ChevronLeft size={32} strokeWidth={2} />
      </button>
      <button aria-label="Próximo slide" onClick={next}
        className="absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-black backdrop-blur-md transition-all hover:scale-110 hover:bg-white/60 lg:right-6">
        <ChevronRight size={32} strokeWidth={2} />
      </button>

      {/* ─── Dots ─── */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {SLIDES.map((_, i) => (
          <button key={i} aria-label={`Ir para slide ${i + 1}`} onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full border border-white transition-all ${
              i === current ? "bg-white" : "bg-transparent hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

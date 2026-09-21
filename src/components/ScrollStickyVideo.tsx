import { useEffect, useRef, useCallback } from "react";

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

// Quantas "telas de scroll" o vídeo ocupa (mais = mais lento e controlado)
const SCROLL_SCREENS = 5;

export function ScrollStickyVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number | null>(null);

  // ─── Desenha frame no canvas com object-cover ─────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const scale = Math.max(cW / iW, cH / iH);
    const dW = iW * scale;
    const dH = iH * scale;
    const ox = (cW - dW) / 2;
    const oy = (cH - dH) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, ox, oy, dW, dH);
  }, []);

  // ─── Resize canvas ─────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ─── Pré-carregamento com prioridade nos primeiros frames ──────────────
  useEffect(() => {
    const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT });

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Alta prioridade nos primeiros 60 frames para início imediato
      img.decoding = i <= 60 ? "sync" : "async";
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (i === 1) {
          resizeCanvas();
          drawFrame(0);
        }
      };
      images[i - 1] = img;
    }

    imagesRef.current = images;
  }, [drawFrame, resizeCanvas]);

  // ─── Handler de scroll — mapeia posição de scroll → frame ─────────────
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { top, height } = container.getBoundingClientRect();
      const scrollRange = height - window.innerHeight;
      let fraction = -top / scrollRange;
      fraction = Math.max(0, Math.min(1, fraction));

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(fraction * FRAME_COUNT)
      );

      if (frameIndex === currentFrameRef.current) return;
      currentFrameRef.current = frameIndex;

      // Agenda o próximo frame via rAF para máxima fluidez
      pendingFrameRef.current = frameIndex;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingFrameRef.current !== null) {
            drawFrame(pendingFrameRef.current);
            pendingFrameRef.current = null;
          }
          rafRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, resizeCanvas]);

  // ─── Tamanho inicial ───────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
  }, [resizeCanvas]);

  return (
    // Container alto — define o "track" de scroll do vídeo
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${SCROLL_SCREENS * 100}vh` }}
    >
      {/* Sticky: o canvas fica colado no topo da viewport durante o scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ imageRendering: "high-quality" }}
          aria-label="FREAKY® — Visual Experience"
        />
      </div>
    </div>
  );
}

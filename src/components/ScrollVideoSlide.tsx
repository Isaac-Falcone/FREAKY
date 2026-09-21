import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

export const SCROLL_VIDEO_FRAME_COUNT = FRAME_COUNT;

export interface ScrollVideoSlideHandle {
  /** Vai diretamente ao frame index (0..191) sem re-render React */
  seekTo: (index: number) => void;
}

interface Props {
  className?: string;
}

export const ScrollVideoSlide = forwardRef<ScrollVideoSlideHandle, Props>(
  function ScrollVideoSlide({ className = "" }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const rafRef = useRef<number | null>(null);
    const pendingFrameRef = useRef<number | null>(null);

    // ─── Desenha frame com object-cover ────────────────────────────────
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

      ctx.clearRect(0, 0, cW, cH);
      ctx.drawImage(img, (cW - dW) / 2, (cH - dH) / 2, dW, dH);
    }, []);

    // ─── Exposição imperativa — sem re-render ──────────────────────────
    useImperativeHandle(ref, () => ({
      seekTo(index: number) {
        // Cancela qualquer rAF pendente e agenda apenas 1 por tick
        pendingFrameRef.current = index;
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            if (pendingFrameRef.current !== null) {
              drawFrame(pendingFrameRef.current);
              pendingFrameRef.current = null;
            }
            rafRef.current = null;
          });
        }
      },
    }), [drawFrame]);

    // ─── Resize ────────────────────────────────────────────────────────
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (pendingFrameRef.current !== null) drawFrame(pendingFrameRef.current);
    }, [drawFrame]);

    // ─── Pré-carrega frames ────────────────────────────────────────────
    useEffect(() => {
      const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT });

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = i <= 80 ? "sync" : "async";
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

    // ─── Resize listener ───────────────────────────────────────────────
    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    return (
      <canvas
        ref={canvasRef}
        className={`block h-full w-full ${className}`}
        style={{ imageRendering: "high-quality" }}
        aria-label="FREAKY® — Visual Experience"
      />
    );
  }
);

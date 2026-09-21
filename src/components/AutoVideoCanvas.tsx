import { useEffect, useRef, useCallback } from "react";

const FRAME_COUNT = 192;
const FPS = 24; // 192 frames / 24fps = 8 segundos exatos
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

interface AutoVideoCanvasProps {
  className?: string;
}

export function AutoVideoCanvas({ className = "" }: AutoVideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const intervalMs = 1000 / FPS;

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

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Pré-carrega todos os frames
  useEffect(() => {
    const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT });
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = i <= 48 ? "sync" : "async";
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (i === 1) { resizeCanvas(); drawFrame(0); }
      };
      images[i - 1] = img;
    }
    imagesRef.current = images;
  }, [drawFrame, resizeCanvas]);

  // Loop de animação a 24fps
  useEffect(() => {
    const tick = (timestamp: number) => {
      if (timestamp - lastTimeRef.current >= intervalMs) {
        lastTimeRef.current = timestamp;
        currentFrameRef.current = (currentFrameRef.current + 1) % FRAME_COUNT;
        drawFrame(currentFrameRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [drawFrame, intervalMs]);

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

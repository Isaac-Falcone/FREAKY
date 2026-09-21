import { useEffect, useRef, useCallback } from "react";

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

export function ScrollVideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Draw a specific frame index onto the canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // object-cover logic: fill the canvas while preserving aspect ratio
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Resize canvas to match window size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);

      img.onload = () => {
        loadedCountRef.current += 1;
        // Draw the first frame as soon as it loads
        if (i === 1) {
          resizeCanvas();
          drawFrame(0);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;
  }, [drawFrame, resizeCanvas]);

  // Scroll handler — maps scroll progress → frame index
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
        Math.floor(fraction * FRAME_COUNT),
      );

      if (frameIndex === currentFrameRef.current) return;
      currentFrameRef.current = frameIndex;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, resizeCanvas]);

  // Initial canvas size
  useEffect(() => {
    resizeCanvas();
  }, [resizeCanvas]);

  return (
    // Container height controls how much scroll "track" the animation gets.
    // 500vh = 5 telas de rolagem para completar os 192 frames.
    <div ref={containerRef} className="relative w-full" style={{ height: "500vh" }}>
      {/* sticky: o canvas fica fixo na tela enquanto o usuário rola */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}

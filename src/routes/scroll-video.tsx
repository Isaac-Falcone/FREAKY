import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollVideoCanvas } from "../components/ScrollVideoCanvas";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/scroll-video")({
  head: () => ({
    meta: [
      { title: "FREAKY® — Visual Experience" },
      { name: "description", content: "Uma experiência visual sincronizada com o scroll. Role para descobrir." },
    ],
  }),
  component: ScrollVideoPage,
});

function ScrollVideoPage() {
  return (
    <main className="bg-black text-white">

      {/* ── Header fixo e minimalista ── */}
      <header
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 lg:px-10"
        style={{ mixBlendMode: "difference" }}
      >
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[.2em] text-white transition-opacity hover:opacity-60"
        >
          ← Back
        </Link>
        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-black italic tracking-[-0.1em] text-white">
          FREAKY®
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[.2em] text-white/50">
          Scroll ↓
        </span>
      </header>

      {/* ── Animação scroll-driven (500vh de trilha) ── */}
      <ScrollVideoCanvas />

      {/* ── Seção final: CTA para a loja ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-24 text-center lg:px-20">
        {/* Grade de fundo decorativa */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 80px)",
          }}
        />

        {/* Badge */}
        <p className="mb-8 inline-block bg-[#c5ff00] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          Drop 001 / 26 — Limited
        </p>

        {/* Título */}
        <h2
          className="max-w-5xl text-[clamp(4rem,15vw,12rem)] font-black uppercase leading-[.75] tracking-[-0.1em]"
          style={{ wordBreak: "break-word" }}
        >
          Wear the
          <br />
          <span className="text-[#e9362e]">Weird.</span>
        </h2>

        {/* Subtítulo */}
        <p className="mt-10 max-w-sm font-mono text-xs uppercase leading-relaxed text-white/50">
          Feito em pequenos lotes. Projetado para causar ruído.
          <br />
          Sem segunda chance.
        </p>

        {/* Botão Shop Now */}
        <Link
          to="/"
          className="group mt-14 flex items-center gap-3 bg-[#f4f2ed] px-8 py-4 font-mono text-sm font-bold uppercase text-black shadow-[6px_6px_0_#c5ff00] transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
        >
          Shop Now
          <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
        </Link>

        {/* Rodapé mínimo */}
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-white/20">
          © 2026 FREAKY® — Independent Streetwear
        </p>
      </section>
    </main>
  );
}

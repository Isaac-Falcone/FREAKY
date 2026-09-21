# Interface Aligner

# OBJETIVO: INTEGRAÇÃO DE INTERFACE PRONTA

Você está atuando como Engenheiro de Infraestrutura Front-end. Eu já possuo a interface 100% desenhada e codificada. Sua única função é receber este código React/Tailwind, levantar o ambiente e tornar a aplicação visualizável e componentizada, sem alterar absolutamente nada do design.

## 1. REGRAS DE PROTEÇÃO VISUAL (INEGOCIÁVEIS)

- É estritamente proibido alterar, adicionar ou remover qualquer classe do Tailwind CSS presente no código fornecido.

- Não tente "melhorar" o design. Não mude cores, margens, paddings, bordas ou sombras.

- Preserve 100% a estrutura do layout, tags HTML e microinterações.

## 2. SUAS TAREFAS DE ENGENHARIA

1. Setup de Dependências: Identifique no código quais bibliotecas externas estão sendo usadas (ex: lucide-react para ícones, framer-motion para animações, shadcn/ui) e faça a instalação/configuração automática delas para que o código não quebre.

2. Componentização Básica: Se o código fornecido for um arquivo único muito grande, você tem permissão apenas para fatiá-lo em componentes lógicos (ex: separar Navbar, Footer, Hero) mantendo a exata mesma estilização.

3. Roteamento (Se necessário): Configure a navegação básica entre as seções ou páginas fornecidas.

Abaixo está o código-fonte gerado. Inicie a montagem do ambiente e renderize com fidelidade absoluta:
'use client'




import { useState } from 'react'

import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'




const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20FREAKY%20%281%29-9AH17ZRH2GGyrdI0uuHz1xE70pnVSG.jpg'




const products = [

  { name: 'CHAOS HOODIE / 01', category: 'HEAVYWEIGHT FLEECE', price: 'R$ 489', color: 'bg-[#f1efe8]', accent: 'bg-[#c5ff00]', size: 'lg:col-span-2' },

  { name: 'FREAKY CAP / 02', category: '6-PANEL STRUCTURE', price: 'R$ 189', color: 'bg-[#e9362e]', accent: 'bg-[#f5ef00]', size: '' },

  { name: 'UTILITY PANT / 03', category: 'RIPSTOP CARGO', price: 'R$ 379', color: 'bg-[#b7b2a7]', accent: 'bg-[#ff4d00]', size: '' },

  { name: 'SIGNAL TEE / 04', category: 'COTTON 240GSM', price: 'R$ 229', color: 'bg-[#d7ff00]', accent: 'bg-[#111111]', size: 'lg:col-span-2' },

]




export default function Page() {

  const [menuOpen, setMenuOpen] = useState(false)

  const [cartCount, setCartCount] = useState(0)

  const [searchOpen, setSearchOpen] = useState(false)




  return (

    <main className="min-h-screen overflow-hidden bg-[#050505] text-[#f4f2ed] selection:bg-[#c5ff00] selection:text-black">

      <header className="sticky top-0 z-40 border-b-2 border-[#f4f2ed] bg-[#050505]/95 backdrop-blur-sm">

        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 lg:px-8">

          <button aria-label="Abrir menu" onClick={() => setMenuOpen(true)} className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-[#c5ff00]">

            <Menu size={22} strokeWidth={2.5} /> <span className="hidden sm:inline">Menu / Index</span>

          </button>

          <a href="#top" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black italic tracking-[-0.12em]">FREAKY®</a>

          <div className="flex items-center gap-4 font-mono text-xs uppercase">

            <button aria-label="Pesquisar" onClick={() => setSearchOpen(true)} className="hover:text-[#c5ff00]"><Search size={21} /></button>

            <button aria-label="Abrir sacola" onClick={() => setCartCount((count) => count + 1)} className="relative hover:text-[#c5ff00]"><ShoppingBag size={21} />{cartCount > 0 && <span className="absolute -right-3 -top-3 bg-[#c5ff00] px-1.5 text-[10px] font-bold text-black">{cartCount}</span>}</button>

          </div>

        </div>

      </header>




      {menuOpen && <div className="fixed inset-0 z-50 flex flex-col bg-[#c5ff00] p-6 text-black sm:p-10"><button aria-label="Fechar menu" onClick={() => setMenuOpen(false)} className="self-end"><X size={30} /></button><nav className="mt-12 flex flex-col gap-2 text-6xl font-black uppercase leading-[.9] tracking-[-.07em] sm:text-8xl"><a href="#drops" onClick={() => setMenuOpen(false)}>Drops</a><a href="#deals" onClick={() => setMenuOpen(false)}>Deals</a><a href="#archive" onClick={() => setMenuOpen(false)}>Archive</a></nav><p className="mt-auto font-mono text-xs uppercase">FREAKY STUDIO / São Paulo — 2026</p></div>}

      {searchOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#e9362e] p-4"><button aria-label="Fechar busca" onClick={() => setSearchOpen(false)} className="absolute right-6 top-6"><X size={30} /></button><div className="w-full max-w-5xl"><label htmlFor="mega-search" className="font-mono text-xs uppercase">Search the noise</label><input autoFocus id="mega-search" placeholder="TYPE TO FIND FREAKY" className="mt-3 w-full border-b-4 border-black bg-transparent py-5 text-4xl font-black uppercase tracking-[-.06em] outline-none placeholder:text-black/40 sm:text-7xl" /></div></div>}




      <section id="top" className="mx-auto grid max-w-[1600px] grid-cols-1 border-x-2 border-[#f4f2ed] lg:grid-cols-12">

        <div className="relative flex min-h-[620px] flex-col justify-between overflow-hidden border-b-2 border-[#f4f2ed] p-5 sm:p-8 lg:col-span-8 lg:min-h-[780px] lg:border-b-0 lg:border-r-2">

          <div className="absolute inset-0 opacity-35 mix-blend-screen" style={{ backgroundImage: `url('${logo}')`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'grayscale(1) contrast(1.2)' }} />

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

          <div className="relative flex justify-between font-mono text-[10px] uppercase"><span>Drop 001 / 26</span><span>Est. 2019 / SP</span></div>

          <div className="relative mt-auto"><p className="mb-3 inline-block bg-[#c5ff00] px-2 py-1 font-mono text-xs font-bold text-black">NO RULES. JUST SIGNAL.</p><h1 className="max-w-4xl text-[clamp(5rem,14vw,13rem)] font-black uppercase leading-[.72] tracking-[-.1em]">Stay<br/><span className="text-[#e9362e]">Freaky</span></h1><div className="mt-8 flex items-end justify-between gap-4"><p className="max-w-xs font-mono text-xs uppercase leading-relaxed text-white/70">Streetwear para quem não espera permissão. Feito em pequenos lotes, projetado para causar ruído.</p><a href="#drops" className="group flex items-center gap-2 bg-[#f4f2ed] px-4 py-3 font-mono text-xs font-bold uppercase text-black shadow-[5px_5px_0_#c5ff00] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Explorar drop <ArrowUpRight size={16}/></a></div></div>

        </div>

        <div className="grid min-h-[620px] grid-cols-2 lg:col-span-4 lg:min-h-0 lg:grid-cols-1">

          <div className="flex flex-col justify-between border-b-2 border-[#f4f2ed] bg-[#e9362e] p-5 text-black sm:p-8"><span className="font-mono text-xs uppercase">01 / Manifesto</span><p className="max-w-xs text-3xl font-black uppercase leading-[.85] tracking-[-.06em] sm:text-5xl">Wear the weird. Own the room.</p><span className="font-mono text-xs uppercase">Read more ↘</span></div>

          <div className="relative flex min-h-[310px] flex-col justify-between bg-[#c5ff00] p-5 text-black sm:p-8 lg:min-h-0"><span className="font-mono text-xs uppercase">02 / Dispatch</span><div><p className="font-mono text-xs uppercase">Next drop in</p><p className="text-6xl font-black tracking-[-.08em] sm:text-8xl">04:12</p></div><span className="font-mono text-xs uppercase">Fri 20.09 — 18:00</span></div>

        </div>

      </section>




      <div className="overflow-hidden border-b-2 border-[#f4f2ed] bg-[#f4f2ed] py-3 text-black"><div className="marquee flex w-max gap-8 font-mono text-sm font-bold uppercase">{Array.from({length: 8}).map((_, i) => <span key={i}>FREAKY DEALS ✳ FREAKY DEALS ✳</span>)}</div></div>




      <section id="deals" className="mx-auto max-w-[1600px] px-4 py-20 lg:px-8 lg:py-28"><div className="mb-10 flex items-end justify-between border-b-2 border-[#f4f2ed] pb-5"><div><p className="font-mono text-xs uppercase text-[#c5ff00]">Limited / 48 hours</p><h2 className="mt-2 text-6xl font-black uppercase leading-[.8] tracking-[-.08em] sm:text-9xl">Hot<br/>stuff.</h2></div><p className="hidden max-w-[200px] font-mono text-xs uppercase leading-relaxed text-white/60 sm:block">Peças selecionadas. Preços perigosamente baixos. Sem reposição.</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{products.slice(0, 3).map((product, i) => <ProductCard key={product.name} product={product} onAdd={() => setCartCount((count) => count + 1)} featured={i === 0} />)}</div></section>




      <section id="drops" className="border-y-2 border-[#f4f2ed] bg-[#e9362e] px-4 py-20 text-black lg:px-8 lg:py-28"><div className="mx-auto max-w-[1600px]"><div className="flex items-end justify-between"><div><p className="font-mono text-xs uppercase">New collection / 001</p><h2 className="mt-4 text-6xl font-black uppercase leading-[.75] tracking-[-.09em] sm:text-9xl">The<br/>Archive</h2></div><span className="font-mono text-xs uppercase">(04 items)</span></div><div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.name} product={product} onAdd={() => setCartCount((count) => count + 1)} dark />)}</div></div></section>




      <footer id="archive" className="mx-auto grid max-w-[1600px] grid-cols-1 border-x-2 border-[#f4f2ed] sm:grid-cols-3"><div className="border-b-2 border-[#f4f2ed] p-6 sm:border-b-0 sm:border-r-2"><img src={logo} alt="Logo Freaky" className="h-16 w-36 object-contain object-left" /><p className="mt-8 font-mono text-[10px] uppercase leading-relaxed text-white/60">Independent streetwear<br/>from the underground.</p></div><div className="border-b-2 border-[#f4f2ed] p-6 font-mono text-xs uppercase sm:border-b-0 sm:border-r-2"><p className="mb-5 text-[#c5ff00]">Index</p><a className="block hover:text-[#c5ff00]" href="#drops">Shop all</a><a className="mt-2 block hover:text-[#c5ff00]" href="#deals">Deals</a><a className="mt-2 block hover:text-[#c5ff00]" href="#archive">Contact</a></div><div className="flex flex-col justify-between p-6 font-mono text-xs uppercase"><div><p className="mb-5 text-[#c5ff00]">Stay in the loop</p><div className="flex border-b border-white/50 pb-3"><input placeholder="YOUR EMAIL" className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-white/40" /><ArrowUpRight size={16}/></div></div><p className="mt-12 text-white/40">© 2026 FREAKY®</p></div></footer>

    </main>

  )

}




function ProductCard({ product, onAdd, featured, dark }: { product: typeof products[number]; onAdd: () => void; featured?: boolean; dark?: boolean }) {

  return <article className={`group ${product.size} ${dark ? 'border-2 border-black' : 'border-2 border-white'} bg-[#111] text-white`}><div className={`relative flex min-h-[320px] items-end justify-between overflow-hidden ${product.color} p-4 text-black ${featured ? 'md:min-h-[470px]' : ''}`}><div className={`absolute left-1/2 top-1/2 h-44 w-32 -translate-x-1/2 -translate-y-1/2 rotate-12 ${product.accent} shadow-[12px_12px_0_#050505] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110`} /><div className="relative font-mono text-[10px] uppercase">FREAKY<br/>{product.name.slice(-2)}</div><span className="relative bg-black px-2 py-1 font-mono text-xs font-bold text-white">-30%</span></div><div className="flex items-center justify-between gap-3 border-t-2 border-white p-4"><div><h3 className="text-sm font-black uppercase tracking-tight">{product.name}</h3><p className="mt-1 font-mono text-[10px] uppercase text-white/55">{product.category}</p></div><div className="text-right"><p className="font-mono text-sm">{product.price}</p><button onClick={onAdd} className="mt-2 bg-[#c5ff00] px-2 py-1 font-mono text-[10px] font-bold uppercase text-black hover:bg-white">Add +</button></div></div></article>

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a292b19-23af-4606-ad6c-411726461a5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

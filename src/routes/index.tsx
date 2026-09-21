import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, Search, ShoppingBag, X, User, Bookmark } from "lucide-react";
import { HeroCarousel } from "../components/HeroCarousel";
import { Link } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

const logo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20FREAKY%20%281%29-9AH17ZRH2GGyrdI0uuHz1xE70pnVSG.jpg";

// ─── Tipo comum para busca ─────────────────────────────────────────────────────
interface SearchableProduct {
  id: string;
  name: string;
  categoryLabel: string;
  price: string;
  img: string;
  imgHover: string;
}

// ─── Tipos do banco ───────────────────────────────────────────────────────────
interface DBProduct {
  id: string;
  name: string;
  category_label: string;
  price: string;
  img: string;
  img_hover: string;
  img_archive?: string;
  img_archive_hover?: string;
  is_featured: boolean;
  size_class?: string;
  fit_class?: string;
  archive_fit_class?: string;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FREAKY® — Independent Streetwear" },
      {
        name: "description",
        content: "Streetwear independente para quem não espera permissão.",
      },
      { property: "og:title", content: "FREAKY® — Independent Streetwear" },
      {
        property: "og:description",
        content: "Streetwear independente para quem não espera permissão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const router = useRouter();
  const { openAuthModal, openCart, requireAuth } = useAuth();
  const { count: cartCount, addToCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // true quando o usuário scrollou além da altura do hero carousel
  const [scrolled, setScrolled] = useState(false);

  // Estados do Supabase
  const [featuredProducts, setFeaturedProducts] = useState<DBProduct[]>([]);
  const [allProducts, setAllProducts] = useState<SearchableProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca dados do Supabase — somente campos necessários (sem SELECT *)
  useEffect(() => {
    async function fetchData() {
      try {
        // Campos explícitos para produtos em destaque — evita vazar colunas internas
        const { data: featured, error: err1 } = await supabase
          .from('products')
          .select('id, name, category_label, price, img, img_hover, img_archive, img_archive_hover, is_featured, size_class, fit_class, archive_fit_class')
          .or('is_featured.eq.true,name.eq.SIGNAL TEE / 04')
          .order('created_at', { ascending: true });

        if (err1) { console.error('[Supabase] Erro ao buscar destaques.'); }
        else if (featured) setFeaturedProducts(featured);

        // Campos mínimos para o índice de busca
        const { data: all, error: err2 } = await supabase
          .from('products')
          .select('id, name, category_label, price, img, img_hover, img_archive, img_archive_hover');

        if (err2) { console.error('[Supabase] Erro ao buscar catálogo de busca.'); }
        else if (all) {
          setAllProducts(all.map((p) => ({
            id: p.id,
            name: (p.name as string).replace(/ \/\s*\d+$/, ""),
            categoryLabel: p.category_label as string,
            price: p.price as string,
            img: (p.img_archive as string | null) || (p.img as string),
            imgHover: (p.img_archive_hover as string | null) || (p.img_hover as string),
          })));
        }
      } catch {
        // Não expõe detalhes internos de banco ao usuário ou ao console de produção
        console.error('[Supabase] Falha na conexão com o catálogo.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // 100vh = altura do HeroCarousel
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha busca com ESC
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Filtra sobre TODOS os produtos do site
  const searchResults: SearchableProduct[] = searchQuery.trim()
    ? allProducts.filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
        );
      })
    : [];

  // ─── Conteúdo de navegação reutilizado nos dois headers ───────────────
  const NavLinks = ({ className }: { className: string }) => {
    const links = [
      { label: "SHOP", href: "#categories" },
      { label: "DROPS", href: "#drops" },
      { label: "SALE", href: "#deals" },
    ];
    return (
      <>
        {links.map((link) => (
          <a key={link.label} href={link.href} className={className}>
            {link.label}
          </a>
        ))}
      </>
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-[#f4f2ed] selection:bg-[#c5ff00] selection:text-black">

      {/* ══════════════════════════════════════════════════
          HEADER 1 — transparente, fixo no topo do carrossel
      ══════════════════════════════════════════════════ */}
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center px-5 lg:px-10">
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            <NavLinks className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[#7a1a2e] transition-colors hover:text-[#7a1a2e]/60" />
          </nav>
          <a href="#hero-carousel" className="absolute left-1/2 -translate-x-1/2 text-[1.35rem] font-black italic tracking-[-0.1em] text-[#ff9900]">
            FREAKY®
          </a>
          <div className="ml-auto flex items-center gap-5">
            <button aria-label="Pesquisar" onClick={() => setSearchOpen(true)} className="text-[#7a1a2e] transition-colors hover:text-[#7a1a2e]/60">
              <Search size={18} />
            </button>
            <button aria-label="Conta" onClick={() => requireAuth(() => router.navigate({ to: '/profile' }))} className="hidden text-[#7a1a2e] transition-colors hover:text-[#7a1a2e]/60 lg:block"><User size={18} /></button>
            <button aria-label="Abrir sacola" onClick={() => requireAuth(openCart)} className="relative text-[#7a1a2e] transition-colors hover:text-[#7a1a2e]/60">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center bg-[#c5ff00] font-mono text-[9px] font-bold text-black">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          HEADER 2 — fundo escuro, desliza ao scrollar
      ══════════════════════════════════════════════════ */}
      <header
        className="fixed left-0 right-0 top-0 z-[51] bg-[#181818]/95 shadow-lg backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: scrolled ? "translateY(0)" : "translateY(-110%)" }}
      >
        <div className="mx-auto flex h-14 max-w-[1600px] items-center px-5 lg:px-10">
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            <NavLinks className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-white/80 transition-colors hover:text-white" />
          </nav>
          <a href="#hero-carousel" className="absolute left-1/2 -translate-x-1/2 text-[1.35rem] font-black italic tracking-[-0.1em] text-[#ff9900]">
            FREAKY®
          </a>
          <div className="ml-auto flex items-center gap-5">
            <button aria-label="Pesquisar" onClick={() => setSearchOpen(true)} className="text-white/80 transition-colors hover:text-white">
              <Search size={18} />
            </button>
            <button aria-label="Conta" onClick={() => requireAuth(() => router.navigate({ to: '/profile' }))} className="hidden text-white/80 transition-colors hover:text-white lg:block"><User size={18} /></button>
            <button aria-label="Abrir sacola" onClick={() => requireAuth(openCart)} className="relative text-white/80 transition-colors hover:text-white">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center bg-[#c5ff00] font-mono text-[9px] font-bold text-black">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#e9362e]">

          {/* Botão fechar */}
          <button
            aria-label="Fechar busca"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            className="absolute right-6 top-6 z-10 text-black transition-opacity hover:opacity-60"
          >
            <X size={30} />
          </button>

          {/* Campo de busca */}
          <div className="mx-auto w-full max-w-5xl px-5 pt-[18vh] sm:px-8">
            <label htmlFor="mega-search" className="font-mono text-xs uppercase text-black/60">
              Search the noise
            </label>
            <input
              autoFocus
              id="mega-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="TYPE TO FIND FREAKY"
              className="mt-3 w-full border-b-4 border-black bg-transparent py-5 text-4xl font-black uppercase tracking-[-.06em] text-black outline-none placeholder:text-black/40 sm:text-7xl"
            />
          </div>

          {/* Resultados */}
          {searchQuery.trim().length > 0 && (
            <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8">
              {searchResults.length > 0 ? (
                <>
                  <p className="mb-6 font-mono text-xs uppercase text-black/50">
                    {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"} encontrado{searchResults.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
                    {searchResults.map((product) => (
                      <SearchResultCard
                        key={product.id}
                        product={product}
                        onAdd={() => requireAuth(() => { addToCart(product.id); openCart(); })}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="border-t-4 border-black pt-8">
                  <p className="text-2xl font-black uppercase tracking-[-0.05em] text-black/40 sm:text-4xl">
                    Nenhum resultado para &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase text-black/50">
                    Tente: chaos hoodie, freaky cap, utility pant, signal tee...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          HERO CAROUSEL — vídeo + 4 imagens
      ══════════════════════════════════════════════════ */}
      <HeroCarousel />

      {/* ══════════════════════════════════════════════════
          SEÇÃO HERO EDITORIAL (mantida abaixo)
      ══════════════════════════════════════════════════ */}
      <section id="top" className="mx-auto grid max-w-[1600px] grid-cols-1 border-x-2 border-[#f4f2ed] lg:grid-cols-12">
        <div className="relative flex min-h-[620px] flex-col justify-between overflow-hidden border-b-2 border-[#f4f2ed] p-5 sm:p-8 lg:col-span-8 lg:min-h-[780px] lg:border-b-0 lg:border-r-2">
          <div className="absolute inset-0 opacity-35 mix-blend-screen" style={{ backgroundImage: `url('${logo}')`, backgroundPosition: "center", backgroundSize: "cover", filter: "grayscale(1) contrast(1.2)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
          <div className="relative flex justify-between font-mono text-[10px] uppercase"><span>Drop 001 / 26</span><span>Est. 2019 / SP</span></div>
          <div className="relative mt-auto"><p className="mb-3 inline-block bg-[#c5ff00] px-2 py-1 font-mono text-xs font-bold text-black">NO RULES. JUST SIGNAL.</p><h1 className="max-w-4xl text-[clamp(2.5rem,12vw,13rem)] font-black uppercase leading-[.72] tracking-[-.1em]">Stay<br /><span className="text-[#e9362e]">Freaky</span></h1><div className="mt-8 flex items-end justify-between gap-4"><p className="max-w-xs font-mono text-xs uppercase leading-relaxed text-white/70">Streetwear para quem não espera permissão. Feito em pequenos lotes, projetado para causar ruído.</p><a href="#drops" className="group flex items-center gap-2 bg-[#f4f2ed] px-4 py-3 font-mono text-xs font-bold uppercase text-black shadow-[5px_5px_0_#c5ff00] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Explorar drop <ArrowUpRight size={16} /></a></div></div>
        </div>
        <div className="grid min-h-[620px] grid-cols-2 lg:col-span-4 lg:min-h-0 lg:grid-cols-1">
          <div className="flex flex-col justify-between border-b-2 border-[#f4f2ed] bg-[#e9362e] p-5 text-black sm:p-8"><span className="font-mono text-xs uppercase">01 / Manifesto</span><p className="max-w-xs text-3xl font-black uppercase leading-[.85] tracking-[-.06em] sm:text-5xl">Wear the weird. Own the room.</p><span className="font-mono text-xs uppercase">Read more ↘</span></div>
          <div className="relative flex min-h-[310px] flex-col justify-between bg-[#c5ff00] p-5 text-black sm:p-8 lg:min-h-0"><span className="font-mono text-xs uppercase">02 / Dispatch</span><div><p className="font-mono text-xs uppercase">Next drop in</p><p className="text-6xl font-black tracking-[-.08em] sm:text-8xl">04:12</p></div><span className="font-mono text-xs uppercase">Fri 20.09 — 18:00</span></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b-2 border-[#f4f2ed] bg-[#f4f2ed] py-3 text-black"><div className="marquee flex w-max gap-8 font-mono text-sm font-bold uppercase">{Array.from({ length: 8 }).map((_, i) => <span key={i}>FREAKY DEALS ✳ FREAKY DEALS ✳</span>)}</div></div>

      {/* Deals */}
      <section id="deals" className="mx-auto max-w-[1600px] px-4 py-20 lg:px-8 lg:py-28"><div className="mb-10 flex items-end justify-between border-b-2 border-[#f4f2ed] pb-5"><div><p className="font-mono text-xs uppercase text-[#c5ff00]">Limited / 48 hours</p>          <h2 className="mt-2 text-5xl font-black uppercase leading-[.8] tracking-[-.08em] sm:text-7xl lg:text-9xl">Hot<br />stuff.</h2></div><p className="hidden max-w-[200px] font-mono text-xs uppercase leading-relaxed text-white/60 sm:block">Peças selecionadas. Preços perigosamente baixos. Sem reposição.</p></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-20 text-center text-white">Carregando produtos...</div>
          ) : (
            featuredProducts.filter(p => !p.name.includes("SIGNAL")).map((product) => {
              const isChaos = product.name.includes("CHAOS");
              const isLogoSpace = product.name.includes("UTILITY PANT");
              
              return (
                <div 
                  key={product.name}
                  className={
                    isChaos ? "lg:col-span-2" : 
                    isLogoSpace ? "lg:col-start-1" : ""
                  }
                >
                  <ProductCard
                    product={product}
                    onAdd={() => requireAuth(() => { addToCart(product.id); openCart(); })}
                    onWishlist={() => requireAuth(() => toggleWishlist(product.id))}
                    isWishlisted={isWishlisted(product.id)}
                    featured
                  />
                </div>
              );
            })
          )}
          {/* Logo FREAKY colorida no espaço vazio — apenas no desktop (lg) */}
          <div className="hidden lg:col-span-2 lg:flex items-center justify-center min-h-[320px]">
            <img
              src="/hot_stuff_logo.png"
              alt="FREAKY® logo"
              className="w-full max-w-[650px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SHOP BY CATEGORY
      ══════════════════════════════════════════════════ */}
      <section id="categories" className="mx-auto max-w-[1600px] px-4 py-20 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="mb-10 border-b-2 border-[#f4f2ed] pb-5">
          <p className="font-mono text-xs uppercase text-[#c5ff00]">Explorar / Coleções</p>
          <h2 className="mt-2 text-4xl font-black uppercase leading-[.85] tracking-[-.07em] sm:text-6xl lg:text-7xl">
            Find Your<br />Style.
          </h2>
          <p className="mt-4 max-w-md font-mono text-xs uppercase leading-relaxed text-white/50">
            Explore nossas coleções de streetwear — de hoodies e calças cargo a jaquetas, acessórios e muito mais.
          </p>
        </div>

        {/* Grid 4×2 */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { label: "Y2K Hoodies & Moletom", img: "/cat1.webp", slug: "hoodies" },
            { label: "Jaquetas & Casacos",    img: "/cat2.webp", slug: "jaquetas" },
            { label: "Y2K Calças Baggy",      img: "/cat3.webp", slug: "calcas" },
            { label: "Y2K Shorts",            img: "/cat4.webp", slug: "shorts" },
            { label: "Headwear",              img: "/cat5.webp", slug: "headwear" },
            { label: "Estilo em Destaque",    img: "/cat6.webp", slug: "destaque" },
            { label: "Acessórios Y2K",        img: "/cat7.webp", slug: "acessorios" },
            { label: "Camiseta Oversized",    img: "/cat8.webp", slug: "camisetas" },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={`/categoria/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden border-2 border-[#1a1a1a] bg-[#111] transition-all hover:border-[#f4f2ed]"
            >
              {/* Placeholder / imagem */}
              {cat.img ? (
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : null}

              {/* Película cinza para evidenciar o texto */}
              <div className="pointer-events-none absolute inset-0 bg-black/40" />

              {/* Label Centralizado */}
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <p className="font-sans text-lg font-black tracking-tight text-white drop-shadow-md">
                  {cat.label}
                </p>
              </div>

              {/* Hover accent */}
              <div className="absolute left-0 top-0 h-0.5 w-0 bg-[#c5ff00] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      {/* Marquee fim do Find Your Style */}
      <div className="overflow-hidden border-b-2 border-[#f4f2ed] bg-[#f4f2ed] py-3 text-black">
        <div className="marquee flex w-max gap-8 font-mono text-sm font-bold uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>FREAKY DEALS ✳ FREAKY DEALS ✳</span>
          ))}
        </div>
      </div>

      {/* Drops */}
      <section id="drops" className="border-y-2 border-[#f4f2ed] bg-[#e9362e] px-4 py-20 text-black lg:px-8 lg:py-28"><div className="mx-auto max-w-[1600px]"><div className="flex items-end justify-between"><div><p className="font-mono text-xs uppercase">New collection / 001</p><h2 className="mt-4 text-5xl font-black uppercase leading-[.75] tracking-[-.09em] sm:text-7xl lg:text-9xl">The<br />Archive</h2></div><span className="font-mono text-xs uppercase">(04 items)</span></div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full py-20 text-center text-black">Carregando arquivos...</div>
          ) : (
            featuredProducts.map((product) => {
              // Custom span logic for the 4-column archive layout
              const isChaos = product.name.includes("CHAOS");
              const isSignal = product.name.includes("SIGNAL");
              
              return (
                <div 
                  key={product.name}
                  className={
                    isChaos ? "lg:col-span-2" : 
                    isSignal ? "lg:col-span-2" : ""
                  }
                >
                  <ProductCard 
                    product={product} 
                    onAdd={() => requireAuth(() => { addToCart(product.id); openCart(); })}
                    onWishlist={() => requireAuth(() => toggleWishlist(product.id))}
                    isWishlisted={isWishlisted(product.id)}
                    dark 
                  />
                </div>
              );
            })
          )}
          {/* FREAKY® grande no espaço vermelho vazio (2 colunas) */}
          <div className="hidden items-center justify-center p-6 lg:col-span-2 lg:flex">
            <span
              className="font-black italic leading-none tracking-[-0.1em] text-[#f4f2ed]/90"
              style={{ fontSize: "clamp(4.5rem, 9vw, 11rem)" }}
            >
              FREAKY®
            </span>
          </div>
        </div>
      </div></section>

      {/* Footer */}
      <footer id="archive" className="mx-auto grid max-w-[1600px] grid-cols-1 border-x-2 border-[#f4f2ed] sm:grid-cols-3"><div className="border-b-2 border-[#f4f2ed] p-6 sm:border-b-0 sm:border-r-2"><img src={logo} alt="Logo Freaky" className="h-16 w-36 object-contain object-left" /><p className="mt-8 font-mono text-[10px] uppercase leading-relaxed text-white/60">Independent streetwear<br />from the underground.</p></div><div className="border-b-2 border-[#f4f2ed] p-6 font-mono text-xs uppercase sm:border-b-0 sm:border-r-2"><p className="mb-5 text-[#c5ff00]">Index</p><a className="block hover:text-[#c5ff00]" href="#drops">Shop all</a><a className="mt-2 block hover:text-[#c5ff00]" href="#deals">Deals</a><a className="mt-2 block hover:text-[#c5ff00]" href="#archive">Contact</a></div><div className="flex flex-col justify-between p-6 font-mono text-xs uppercase"><div><p className="mb-5 text-[#c5ff00]">Stay in the loop</p><div className="flex border-b border-white/50 pb-3"><input placeholder="YOUR EMAIL" className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-white/40" /><ArrowUpRight size={16} /></div></div><p className="mt-12 text-white/40">© 2026 FREAKY®</p></div></footer>
    </main>
  );
}

function ProductCard({
  product, onAdd, onWishlist, isWishlisted, featured, dark
}: {
  product: DBProduct;
  onAdd: () => void;
  onWishlist: () => void;
  isWishlisted: boolean;
  featured?: boolean;
  dark?: boolean;
}) {
  const imgSrc      = dark ? (product.img_archive || product.img) : product.img;
  const imgHoverSrc = dark ? (product.img_archive_hover || product.img_hover) : product.img_hover;
  const fit         = dark ? product.archive_fit_class : product.fit_class;

  // object-contain: mostra imagem inteira com fundo claro
  // object-cover object-bottom: preenche o card, sacrifica o topo
  const isContain = fit === "contain";
  const imgCls = fit === "contain"
    ? "absolute inset-0 h-full w-full object-contain object-center"
    : fit === "cover-center"
      ? "absolute inset-0 h-full w-full object-cover object-center"
      : fit === "cover-bottom"
        ? "absolute inset-0 h-full w-full object-cover object-bottom"
        : "absolute inset-0 h-full w-full object-cover object-top";
  const areaBg = isContain ? "bg-[#f4f2ed]" : "bg-[#111]";
  const labelColor = isContain ? "text-[#050505]" : "text-white mix-blend-difference";

  return (
    <article className={`group flex flex-col ${product.size_class || ""} ${
      dark ? "border-2 border-black" : "border-2 border-white"
    } bg-[#111] text-white`}>

      {/* Área de imagem — flex-1 faz ela crescer e elimina o preto extra no info */}
      <div className={`relative flex flex-1 items-end justify-between overflow-hidden p-4 ${
        areaBg
      } ${
        featured ? "min-h-[320px] md:min-h-[470px]" : "min-h-[320px]"
      }`}>

        {/* Botão de wishlist */}
        <button
          onClick={onWishlist}
          className="absolute right-4 top-4 z-10 p-2 text-white/50 transition-colors hover:text-red-400 group-hover:text-white"
          aria-label="Wishlist"
        >
          <Bookmark size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

        <img src={imgSrc}      alt={product.name}           className={`${imgCls} transition-opacity duration-300 group-hover:opacity-0`} />
        <img src={imgHoverSrc} alt={product.name + " hover"} className={`${imgCls} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

        <div className={`relative font-mono text-[10px] uppercase ${labelColor}`}>
          FREAKY<br />{product.name.slice(-2)}
        </div>
        <span className="relative bg-black px-2 py-1 font-mono text-xs font-bold text-white">-30%</span>
      </div>

      {/* Rodapé fixo — não cresce, fica sempre na base */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t-2 border-[#1a1a1a] p-4 group-hover:border-white">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black uppercase tracking-tight text-white">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-xs uppercase text-white/60">
            {product.category_label}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-xs">{product.price}</p>
          <button
            onClick={onAdd}
            className="mt-1.5 bg-[#c5ff00] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-black hover:bg-white"
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Card de resultado da busca ───────────────────────────────────────────────
function SearchResultCard({
  product, onAdd,
}: {
  product: SearchableProduct;
  onAdd: () => void;
}) {
  return (
    <article className="group border-2 border-[#1a1a1a] bg-[#111] text-white transition-colors hover:border-[#f4f2ed]">
      {/* Imagem — aspecto retrato */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d0d]">
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={product.imgHover}
          alt={product.name + " — alt"}
          className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-end justify-between p-3">
          <div className="font-mono text-[10px] uppercase text-white/40">FREAKY®</div>
          <span className="bg-black px-2 py-0.5 font-mono text-[10px] font-bold text-white">-30%</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-white/10 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-black uppercase tracking-tight">{product.name}</h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase text-white/55">{product.categoryLabel}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-xs">{product.price}</p>
          <button
            onClick={onAdd}
            className="mt-1.5 bg-[#c5ff00] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-black hover:bg-white"
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  );
}
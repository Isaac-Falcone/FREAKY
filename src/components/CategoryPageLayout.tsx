import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Search, ShoppingBag, Bookmark, User, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

// ─── Marquee de "FREAKY DEALS" ────────────────────────────────────────────────
function FreakyMarquee() {
  return (
    <div className="overflow-hidden border-y border-[#1a1a1a] bg-[#f4f2ed] py-3 text-black">
      <div className="marquee flex w-max gap-8 font-mono text-sm font-bold uppercase">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i}>FREAKY DEALS ✳ FREAKY DEALS ✳</span>
        ))}
      </div>
    </div>
  );
}

// ─── Tipos do banco ───────────────────────────────────────────────────────────
interface DBProduct {
  id: string;
  name: string;
  category_label: string;
  price: string;
  img: string;
  img_hover: string;
}

interface DBCategory {
  id: string;
  slug: string;
  label: string;
  description: string;
}

// ─── Card estilo "The Archive" com foto real + hover ─────────────────────────
function ProductCard({ product, onAdd, onWishlist, isWishlisted }: { product: DBProduct, onAdd: () => void, onWishlist: () => void, isWishlisted: boolean }) {
  return (
    <article className="group border-2 border-[#1a1a1a] bg-[#111] text-white transition-colors hover:border-[#f4f2ed]">
      {/* Área da imagem — aspect-[3/4] garante proporção retrato em qualquer tela */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d0d]">
        {/* Imagem estática */}
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 group-hover:opacity-0"
        />
        {/* Imagem hover */}
        <img
          src={product.img_hover || product.img}
          alt={product.name + " — alt"}
          className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Botão de wishlist */}
        <button
          onClick={onWishlist}
          className="absolute right-4 top-4 z-10 p-2 text-white/50 transition-colors hover:text-red-400 group-hover:text-white"
          aria-label="Wishlist"
        >
          <Bookmark size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

        {/* Overlay com badge */}
        <div className="absolute inset-0 flex items-end justify-between p-4 pointer-events-none">
          {/* Badge desconto */}
          <div className="font-mono text-[10px] uppercase text-white/40">
            FREAKY®
          </div>
          <span className="bg-black px-2 py-1 font-mono text-xs font-bold text-white">
            -30%
          </span>
        </div>
      </div>

      {/* Info do produto */}
      <div className="flex items-center justify-between gap-3 border-t-2 border-[#1a1a1a] p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black uppercase tracking-tight text-[#f4f2ed]">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase text-white/50">
            FREAKY® COLLECTION
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm text-white">{product.price}</p>
          <button onClick={onAdd} className="mt-2 bg-[#c5ff00] px-2 py-1 font-mono text-[10px] font-bold uppercase text-black transition-colors hover:bg-white">
            Add +
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Layout principal da página de categoria ──────────────────────────────────
export function CategoryPageLayout({ categorySlug }: { categorySlug: string }) {
  const router = useRouter();
  const { openCart, requireAuth } = useAuth();
  const { count: cartCount, addToCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  
  const [scrolled, setScrolled] = useState(false);
  
  // Estados do Supabase
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [category, setCategory] = useState<DBCategory | null>(null);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros selecionados (funcionalidade de filtros na sidebar)
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  
  // Estado do accordion
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const filterOptions = {
    "Cor": ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Camuflado", "Cinza", "Marrom"],
    "Tipo": ["Oversized", "Baggy", "Slim", "Wide Leg", "Cargo", "Fleece", "Denim"],
    "Disponibilidade": ["Em estoque", "Esgotado"]
  };

  const toggleFilterArray = (current: string[], value: string) => {
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  };

  // Busca dados do Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Busca todas as categorias para a sidebar
        const { data: allCategories, error: errCat } = await supabase
          .from('categories')
          .select('id, slug, label, description');

        if (errCat) {
          console.error('[Supabase] Erro ao buscar categorias.');
        } else if (allCategories) {
          setCategories(allCategories);
          const currentCat = allCategories.find((c) => c.slug === categorySlug);
          if (currentCat) {
            setCategory(currentCat);
            // Busca produtos desta categoria
            const { data: catProducts, error: errProd } = await supabase
              .from('products')
              .select('id, name, category_label, price, img, img_hover')
              .eq('category_id', currentCat.id);

            if (errProd) {
              console.error('[Supabase] Erro ao buscar produtos.');
            } else if (catProducts) {
              setProducts(catProducts);
            }
          }
        }
      } catch {
        console.error('[Supabase] Falha de conexão na página de categoria.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aplica filtros locais
  const filteredProducts = products.filter((p) => {
    const nameLower = p.name.toLowerCase();
    
    // Filtro de Cor (match parcial simples no nome para demonstração)
    if (selectedColors.length > 0) {
      const matchColor = selectedColors.some(color => {
        if (color === "Preto") return nameLower.includes("black") || nameLower.includes("dark");
        if (color === "Branco") return nameLower.includes("white") || nameLower.includes("light");
        if (color === "Azul") return nameLower.includes("blue") || nameLower.includes("denim");
        if (color === "Camuflado") return nameLower.includes("camo");
        return nameLower.includes(color.toLowerCase());
      });
      if (!matchColor) return false;
    }

    // Filtro de Tipo
    if (selectedTypes.length > 0) {
      const matchType = selectedTypes.some(type => nameLower.includes(type.toLowerCase()));
      if (!matchType) return false;
    }

    // Disponibilidade mock
    if (selectedAvailability.includes("Em estoque") && !selectedAvailability.includes("Esgotado")) {
      // Todo produto é em estoque na nossa demo
    }

    return true;
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-[#f4f2ed] selection:bg-[#c5ff00] selection:text-black">

      {/* ─── Header escuro sticky ─── */}
      <header
        className="fixed left-0 right-0 top-0 z-50 bg-[#181818]/95 shadow-lg backdrop-blur-sm"
        style={{ borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent" }}
      >
        <div className="mx-auto flex h-14 max-w-[1600px] items-center px-5 lg:px-10">
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {[
              { label: "SHOP", hash: "categories" },
              { label: "DROPS", hash: "drops" },
              { label: "SALE", hash: "deals" },
            ].map((item) => (
              <Link key={item.label} to="/" hash={item.hash} className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-white/70 transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-[1.35rem] font-black italic tracking-[-0.1em] text-[#ff9900]">
            FREAKY®
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <button aria-label="Pesquisar" className="text-white/70 hover:text-white"><Search size={18} /></button>
            <button aria-label="Wishlist" className="hidden text-white/70 hover:text-white lg:block"><Bookmark size={18} /></button>
            <button onClick={() => requireAuth(() => router.navigate({ to: '/profile' }))} aria-label="Conta" className="hidden text-white/70 hover:text-white lg:block"><User size={18} /></button>
            <button onClick={() => requireAuth(openCart)} aria-label="Sacola" className="relative text-white/70 hover:text-white">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center bg-[#c5ff00] font-mono text-[9px] font-bold text-black">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14">

        {/* Breadcrumb */}
        <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-white/40 lg:px-8">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white/70">{category?.label || "Carregando..."}</span>
          </div>
        </div>

        {/* Hero da categoria */}
        <div className="border-b border-[#1a1a1a] bg-[#0d0d0d] px-5 py-12 text-center lg:px-8">
          <h1 className="text-3xl font-black uppercase tracking-[-0.06em] text-white sm:text-4xl lg:text-6xl">
            {category?.label || "Carregando..."}
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-mono text-xs uppercase leading-relaxed text-white/50">
            {category?.description || "..."}
          </p>
        </div>

        {/* ─── Marquee logo abaixo do hero ─── */}
        <FreakyMarquee />

        {/* Layout: sidebar + grid */}
        <div className="mx-auto flex max-w-[1600px]">

          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 border-r border-[#1a1a1a] lg:block">
            <div className="sticky top-14 p-6">
              <div className="space-y-2">
                {Object.entries(filterOptions).map(([filterName, options]) => {
                  const isOpen = openFilter === filterName;
                  return (
                    <div key={filterName} className="rounded bg-[#111]">
                      <button
                        onClick={() => setOpenFilter(isOpen ? null : filterName)}
                        className="flex w-full items-center justify-between px-4 py-2.5 font-mono text-[11px] uppercase text-white/60 hover:text-white"
                      >
                        {filterName}
                        {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                      </button>
                      
                      {isOpen && (
                        <div className="border-t border-[#1a1a1a] p-4 space-y-3">
                          {options.map((option) => {
                            let isChecked = false;
                            let onChange = () => {};

                            if (filterName === "Cor") {
                              isChecked = selectedColors.includes(option);
                              onChange = () => setSelectedColors(toggleFilterArray(selectedColors, option));
                            } else if (filterName === "Tipo") {
                              isChecked = selectedTypes.includes(option);
                              onChange = () => setSelectedTypes(toggleFilterArray(selectedTypes, option));
                            } else if (filterName === "Disponibilidade") {
                              isChecked = selectedAvailability.includes(option);
                              onChange = () => setSelectedAvailability(toggleFilterArray(selectedAvailability, option));
                            }

                            return (
                              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="hidden" checked={isChecked} onChange={onChange} />
                                <div className={`flex h-4 w-4 items-center justify-center border transition-colors ${isChecked ? 'border-[#c5ff00] bg-[#c5ff00]' : 'border-white/20 bg-transparent group-hover:border-white/50'}`}>
                                  {isChecked && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`font-mono text-[10px] uppercase ${isChecked ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Categorias</p>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/categoria/${cat.slug}`}
                      className={`block py-1.5 font-mono text-[11px] uppercase transition-colors ${
                        cat.slug === categorySlug ? "font-bold text-white" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Grid de produtos */}
          <main className="flex-1 p-5 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-mono text-xs text-white/40">
                {loading ? "..." : `${filteredProducts.length} produto${filteredProducts.length !== 1 ? "s" : ""}`}
              </p>
              <select className="border border-[#1a1a1a] bg-[#111] px-3 py-2 font-mono text-[11px] uppercase text-white/60 outline-none">
                <option>Em Destaque</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Novo</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full py-20 text-center text-white/50 font-mono text-sm uppercase">Carregando produtos...</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={() => requireAuth(() => { addToCart(product.id); openCart(); })}
                    onWishlist={() => requireAuth(() => toggleWishlist(product.id))}
                    isWishlisted={isWishlisted(product.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-white/50 font-mono text-sm uppercase">Nenhum produto encontrado.</div>
              )}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#1a1a1a] px-5 py-8 lg:px-8">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-mono text-xs uppercase text-white/40 hover:text-white/70">
              <ArrowLeft size={12} />
              Voltar para Home
            </Link>
            <span className="font-mono text-xs text-white/20">© 2026 FREAKY®</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

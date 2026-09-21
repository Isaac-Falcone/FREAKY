import { useEffect } from "react";
import { X, Bookmark, Heart, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

export function WishlistDrawer() {
  const { wishlistOpen, closeWishlist, openCart } = useAuth();
  const { items, loading, toggle, count, refresh } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (wishlistOpen) {
      refresh();
    }
  }, [wishlistOpen, refresh]);

  const moveToCart = async (productId: string) => {
    await addToCart(productId);
    await toggle(productId); // remove da wishlist
    closeWishlist();
    openCart();
  };

  return (
    <>
      {/* Overlay */}
      {wishlistOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={closeWishlist}
        />
      )}

      {/* Gaveta */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l-2 border-[#f4f2ed] bg-[#050505] transition-transform duration-300 ${
          wishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] p-6">
          <div>
            <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / FAVORITOS</p>
            <h2 className="mt-0.5 flex items-center gap-2 text-xl font-black uppercase text-white">
              <Bookmark size={18} />
              Favoritos
              {count > 0 && (
                <span className="bg-[#c5ff00] px-1.5 py-0.5 font-mono text-xs font-bold text-black">
                  {count}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeWishlist}
            className="border border-[#333] p-1.5 text-white/60 transition-colors hover:border-[#f4f2ed] hover:text-white"
            aria-label="Fechar favoritos"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="font-mono text-xs uppercase text-white/40">Carregando...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <Heart size={48} className="text-white/10" />
              <p className="font-mono text-xs uppercase text-white/40">
                Nenhum produto salvo ainda
              </p>
              <p className="font-mono text-[10px] uppercase text-white/25">
                Clique em ♥ em qualquer produto para salvar
              </p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-[#1a1a1a] overflow-y-auto">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 p-4">
                  {/* Imagem */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#0d0d0d]">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-tight text-white">
                          {item.product.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[10px] uppercase text-white/40">
                          {item.product.category_label}
                        </p>
                        <p className="mt-1 font-mono text-sm font-bold text-white">
                          {item.product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => toggle(item.product_id)}
                        className="text-white/30 transition-colors hover:text-red-400"
                        aria-label="Remover dos favoritos"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => moveToCart(item.product_id)}
                      className="mt-2 w-full bg-[#c5ff00] py-2 font-mono text-[10px] font-bold uppercase text-black transition-colors hover:bg-white"
                    >
                      Mover para sacola →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

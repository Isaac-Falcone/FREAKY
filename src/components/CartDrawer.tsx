import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";

export function CartDrawer() {
  const { cartOpen, closeCart } = useAuth();
  const { items, loading, removeFromCart, updateQuantity, total, count, refresh } = useCart();

  useEffect(() => {
    if (cartOpen) {
      refresh();
    }
  }, [cartOpen, refresh]);

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Gaveta */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l-2 border-[#f4f2ed] bg-[#050505] transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] p-6">
          <div>
            <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / SACOLA</p>
            <h2 className="mt-0.5 flex items-center gap-2 text-xl font-black uppercase text-white">
              <ShoppingBag size={18} />
              Sacola
              {count > 0 && (
                <span className="bg-[#c5ff00] px-1.5 py-0.5 font-mono text-xs font-bold text-black">
                  {count}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="border border-[#333] p-1.5 text-white/60 transition-colors hover:border-[#f4f2ed] hover:text-white"
            aria-label="Fechar sacola"
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
              <ShoppingBag size={48} className="text-white/10" />
              <p className="font-mono text-xs uppercase text-white/40">Sua sacola está vazia</p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-[#1a1a1a] overflow-y-auto">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 p-4">
                  {/* Imagem */}
                  <div className="h-20 w-16 shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#0d0d0d]">
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
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/30 transition-colors hover:text-red-400"
                        aria-label="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantidade */}
                      <div className="flex items-center border border-[#333]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-white/60 transition-colors hover:bg-[#1a1a1a] hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[2rem] text-center font-mono text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-white/60 transition-colors hover:bg-[#1a1a1a] hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-mono text-sm font-bold text-white">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer com total */}
        {items.length > 0 && (
          <div className="border-t-2 border-[#1a1a1a] p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-white/60">Total</span>
              <span className="text-xl font-black text-white">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#c5ff00] py-4 text-center font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Finalizar compra →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

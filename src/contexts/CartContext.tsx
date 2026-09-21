import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    img: string;
    category_label: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  total: number;
  count: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("id, product_id, quantity, product:products(id, name, price, img, category_label)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setItems((data as unknown as CartItem[]) || []);
      }
    } catch (err) {
      console.error("[CartContext] Erro ao carregar carrinho:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    if (!user) return;

    // Atualização otimista se o item já estiver no carrinho
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
      if (error) {
        console.error("[CartContext] Erro ao incrementar quantidade:", error);
      }
    } else {
      // Inserir novo item no banco
      const { error } = await supabase
        .from("cart")
        .insert({ user_id: user.id, product_id: productId, quantity: 1 });
      if (error) {
        console.error("[CartContext] Erro ao inserir no carrinho:", error);
      }
    }

    // Re-sincroniza com dados completos do banco (inclusive joins com tabela products)
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
    const { error } = await supabase.from("cart").delete().eq("id", cartItemId);
    if (error) {
      console.error("[CartContext] Erro ao remover do carrinho:", error);
    }
    await fetchCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    );
    const { error } = await supabase.from("cart").update({ quantity }).eq("id", cartItemId);
    if (error) {
      console.error("[CartContext] Erro ao atualizar quantidade:", error);
    }
    await fetchCart();
  };

  const parsedPrice = (price: string) =>
    parseFloat(price.replace("R$", "").replace(".", "").replace(",", ".").trim()) || 0;

  const total = items.reduce(
    (sum, item) => sum + parsedPrice(item.product?.price || "0") * item.quantity,
    0
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        count,
        refresh: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}

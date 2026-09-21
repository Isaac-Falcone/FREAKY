import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: string;
    img: string;
    category_label: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  count: number;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id, product_id, product:products(id, name, price, img, category_label)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setItems((data as unknown as WishlistItem[]) || []);
      }
    } catch (err) {
      console.error("[WishlistContext] Erro ao carregar lista de desejos:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggle = async (productId: string) => {
    if (!user) return;
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      setItems((prev) => prev.filter((i) => i.id !== existing.id));
      const { error } = await supabase.from("wishlist").delete().eq("id", existing.id);
      if (error) console.error("[WishlistContext] Erro ao remover dos favoritos:", error);
    } else {
      const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
      if (error) console.error("[WishlistContext] Erro ao adicionar aos favoritos:", error);
    }
    await fetchWishlist();
  };

  const isWishlisted = (productId: string) => items.some((i) => i.product_id === productId);

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        toggle,
        isWishlisted,
        count: items.length,
        refresh: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist deve ser usado dentro de WishlistProvider");
  }
  return ctx;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { BagColor } from "@/lib/catalog";
import { shippingFor, unitPrice, type Interval } from "@/lib/site";
import { browserClient, supabaseReady } from "@/lib/supabase-browser";

export type CartItem = {
  variantId: string;
  slug: string;
  name: string;
  size: string;
  priceCents: number;
  bag: BagColor;
  image: string | null;
  qty: number;
  subscribe: boolean;
  interval: Interval;
};

type Cart = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  hasSubscription: boolean;
  open: boolean;
  bump: number;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const KEY = "cafe-rojo-cart";
const Ctx = createContext<Cart | null>(null);
export const lineKey = (i: Pick<CartItem, "variantId" | "subscribe" | "interval">) =>
  `${i.variantId}:${i.subscribe ? i.interval : "once"}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const userId = useRef<string | null>(null);

  // Guests: cart lives in this browser. Signed-in customers: also saved to their profile.
  useEffect(() => {
    let local: CartItem[] = [];
    try {
      local = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(local);
    setHydrated(true);
    if (!supabaseReady) return;
    const supabase = browserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      userId.current = data.user.id;
      const { data: profile } = await supabase.from("profiles").select("cart").eq("id", data.user.id).maybeSingle();
      const saved: CartItem[] = Array.isArray(profile?.cart) ? profile.cart : [];
      if (!local.length && saved.length) setItems(saved);
    });
  }, []);

  useEffect(() => {
    // Wait until the saved cart has been read, or the first render would overwrite it with an empty one.
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
    if (supabaseReady && userId.current) {
      browserClient().from("profiles").update({ cart: items }).eq("id", userId.current).then(() => {});
    }
  }, [items, hydrated]);

  const add = useCallback<Cart["add"]>((item, qty = 1, opts) => {
    setItems((prev) => {
      const k = lineKey(item);
      const found = prev.find((p) => lineKey(p) === k);
      return found
        ? prev.map((p) => (lineKey(p) === k ? { ...p, qty: Math.min(p.qty + qty, 20) } : p))
        : [...prev, { ...item, qty }];
    });
    setBump((b) => b + 1);
    if (!opts?.silent) setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => lineKey(p) !== key) : prev.map((p) => (lineKey(p) === key ? { ...p, qty: Math.min(qty, 20) } : p)),
    );
  }, []);
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((p) => lineKey(p) !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Cart>(() => {
    const subtotalCents = items.reduce((s, i) => s + unitPrice(i.priceCents, i.subscribe) * i.qty, 0);
    const hasSubscription = items.some((i) => i.subscribe);
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotalCents,
      shippingCents: shippingFor(subtotalCents, hasSubscription),
      hasSubscription,
      open,
      bump,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, open, bump, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

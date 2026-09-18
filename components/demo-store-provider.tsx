"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Product, type Diamond, type CurrencyCode, money } from "@/lib/demo-data";

export type BagItem = {
  key: string;
  name: string;
  price: number;
  detail: string;
  quantity: number;
  image?: string;
  id?: string;
  productName?: string;
  metal?: string;
  size?: string;
  diamondCarat?: string;
  diamondShape?: string;
  diamondColor?: string;
  diamondClarity?: string;
  diamondCut?: string;
  certNumber?: string;
  category?: string;
  settingPrice?: number;
  diamondPrice?: number;
  additionalOptionsPrice?: number;
  diamondPolish?: string;
  diamondSymmetry?: string;
  diamondFluorescence?: string;
  diamondLab?: string;
};
export type RingConfig = {
  settingId: string;
  metal: string;
  size: string;
  diamondShape?: string;
  bandStyle?: string;
  bandSurcharge?: number;
  diamondType?: "Natural" | "Lab-grown";
  diamondId?: string;
};
type DemoStore = {
  ready: boolean;
  bag: BagItem[];
  wishlist: string[];
  ring: RingConfig;
  lastOrder: string | null;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatMoney: (value: number) => string;
  addProduct: (product: Product, detail?: string) => void;
  addDiamond: (diamond: Diamond) => void;
  addCompleteRing: (
    product: Product,
    diamond: Diamond,
    options?: {
      metal?: string;
      size?: string;
      bandStyle?: string;
      bandSurcharge?: number;
      diamondShape?: string;
    }
  ) => void;
  removeBag: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  updateRing: (patch: Partial<RingConfig>) => void;
  placeOrder: (customId?: string) => string;
};

const StoreContext = createContext<DemoStore | null>(null);
const initialRing: RingConfig = {
  settingId: "ER-000",
  metal: "Platinum",
  size: "L 1/2",
  diamondShape: "Round",
  bandStyle: "Classic (2.0mm)",
  bandSurcharge: 0,
  diamondType: "Natural",
};

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ring, setRing] = useState<RingConfig>(initialRing);
  const [lastOrder, setLastOrder] = useState<string | null>(null);
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("mah-demo-store") || "{}");
        if (Array.isArray(saved.bag)) setBag(saved.bag);
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
        if (saved.ring) setRing({ ...initialRing, ...saved.ring });
        if (saved.lastOrder) setLastOrder(saved.lastOrder);
        const savedCurr = localStorage.getItem("mah-currency") as CurrencyCode;
        if (savedCurr) setCurrencyState(savedCurr);
      } catch {}
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("mah-demo-store", JSON.stringify({ bag, wishlist, ring, lastOrder }));
  }, [ready, bag, wishlist, ring, lastOrder]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem("mah-currency", code);
    } catch {}
  };

  const addItem = (item: BagItem) => setBag((current) => {
    const existing = current.find((entry) => entry.key === item.key);
    return existing ? current.map((entry) => entry.key === item.key ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, item];
  });

  const value = useMemo<DemoStore>(() => ({
    ready, bag, wishlist, ring, lastOrder, currency, setCurrency,
    formatMoney: (val: number) => money(val, currency),
    addProduct: (product, detail = product.metal) => addItem({ key: product.id, name: product.name, price: product.price, detail, quantity: 1, image: product.image }),
    addDiamond: (diamond) => addItem({ key: diamond.id, name: `${diamond.carat.toFixed(2)}ct ${diamond.shape} diamond`, price: diamond.price, detail: `${diamond.type} · ${diamond.colour} · ${diamond.clarity} · ${diamond.cut}`, quantity: 1 }),
    addCompleteRing: (product, diamond, options) => {
      const chosenMetal = options?.metal || ring.metal;
      const chosenSize = options?.size || ring.size;
      const chosenBand = options?.bandStyle || ring.bandStyle || "Classic (2.0mm)";
      const surcharge = options?.bandSurcharge || 0;
      const settingSubtotal = product.price + surcharge;
      const total = settingSubtotal + diamond.price;
      const image = product.metalImages?.[chosenMetal] || product.image;

      addItem({
        key: `RING-${product.id}-${diamond.id}-${Date.now()}`,
        id: product.id,
        name: `${product.name} · Complete Ring`,
        productName: product.name,
        category: "engagement",
        metal: chosenMetal,
        size: chosenSize,
        price: total,
        settingPrice: settingSubtotal,
        diamondPrice: diamond.price,
        additionalOptionsPrice: surcharge,
        detail: `${chosenMetal} · ${diamond.shape} · Size ${chosenSize} | ${chosenBand}`,
        quantity: 1,
        image,
        diamondCarat: `${diamond.carat.toFixed(2)} ct`,
        diamondShape: diamond.shape,
        diamondColor: diamond.colour,
        diamondClarity: diamond.clarity,
        diamondCut: diamond.cut,
        diamondPolish: diamond.polish || "Excellent",
        diamondSymmetry: diamond.symmetry || "Excellent",
        diamondFluorescence: diamond.fluorescence || "None",
        diamondLab: diamond.certificate,
        certNumber: diamond.certificate === "GIA" ? "2476843210" : "592384102",
      });
    },
    removeBag: (key) => setBag((current) => current.filter((item) => item.key !== key)),
    setQuantity: (key, quantity) => setBag((current) => quantity < 1 ? current.filter((item) => item.key !== key) : current.map((item) => item.key === key ? { ...item, quantity } : item)),
    toggleWishlist: (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    updateRing: (patch) => setRing((current) => ({ ...current, ...patch })),
    placeOrder: (customId?: string) => { const id = customId || `MAH-DEMO-${Math.floor(100000 + Math.random() * 900000)}`; setLastOrder(id); setBag([]); return id; },
  }), [ready, bag, wishlist, ring, lastOrder, currency]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDemoStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return value;
}

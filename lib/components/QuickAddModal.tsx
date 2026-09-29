"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, Minus, Plus, Star, Truck, X } from "lucide-react";
import { useCart } from "@/contexts/cartContext";

const PLACEHOLDER_COUNT = 3;

export default function QuickAddModal() {
  const { quickAddProduct, closeQuickAdd, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (quickAddProduct) {
      setQty(1);
      setActiveImage(0);
      setActiveColor(0);
      setActiveSize(quickAddProduct.sizes?.[0] ?? null);
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickAddProduct]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickAdd();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeQuickAdd]);

  if (!mounted || !quickAddProduct) return null;

  const product = quickAddProduct;
  const images = product.images?.length ? product.images : Array(PLACEHOLDER_COUNT).fill(null);
  const visibleThumbs = images.slice(0, 4);
  const extraCount = images.length - visibleThumbs.length;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-stone-900/0 backdrop-blur-[1px]" onClick={closeQuickAdd} />

      <div className="relative w-full max-w-4xl rounded-[1.1rem] p-1 bg-stone-800/20 backdrop-blur-xs">
        {/* card */}
        <div className="relative md:grid grid w-full grid-cols-1 gap-8 rounded-2xl bg-white dark:bg-stone-900 p-6 shadow-2xl sm:grid-cols-2 sm:p-8">
          <button
            onClick={closeQuickAdd}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 text-stone-400 dark:text-stone-600 hover:text-stone-700 dark:hover:text-stone-300"
          >
            <X size={18} />
          </button>

          {/* Left: gallery */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-xl border bg-stone-100 dark:bg-stone-900 border-stone-500/40">
              {images[activeImage] ? (
                <img
                  src={images[activeImage] as string}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-serif text-5xl italic text-stone-300 dark:text-stone-700">
                    {activeImage + 1}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {visibleThumbs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-lg border bg-stone-100 dark:bg-stone-900  transition-colors ${
                    activeImage === i ? "border-stone-500/40 dark:border-stone-500/50" : "border-stone-500/10"
                  }`}
                >
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-sm italic text-stone-300 dark:text-stone-700">{i + 1}</span>
                    </div>
                  )}
                </button>
              ))}
              {extraCount > 0 && (
                <button
                  onClick={() => setActiveImage(4)}
                  className="flex aspect-square items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 text-xs text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-950"
                >
                  +{extraCount} more
                </button>
              )}
            </div>
          </div>

          {/* Right: details */}
          <div className="flex flex-col">
            {product.brand && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{product.brand}</p>
                {product.sku && <p className="text-xs text-stone-400 dark:text-stone-600">{product.sku}</p>}
              </div>
            )}

            <p className="mt-1 font-serif text-2xl italic text-stone-900 dark:text-stone-100">{product.name}</p>

            {typeof product.rating === "number" && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(product.rating!)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-stone-200 text-stone-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-400">{product.reviewCount ?? 0} reviews</span>
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-sm text-stone-400 dark:text-stone-600 line-through">${product.originalPrice}</span>
              )}
              <span className="text-2xl font-medium text-stone-900 dark:test-stone-100">${product.price}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              {product.description ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec sapien fringilla, ac facilisis lorem convallis."}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <p className="text-xs text-stone-500">Color</p>
                <div className="mt-2 flex gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={c + i}
                      onClick={() => setActiveColor(i)}
                      aria-label={`Color ${i + 1}`}
                      className={`size-8 rounded-lg border-2 transition-colors ${
                        activeColor === i ? "border-stone-900" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-500">Size</p>
                  <button className="text-xs text-stone-400 underline hover:text-stone-600">
                    Size guide
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        activeSize === s
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* quantity */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-stone-600">Quantity</span>
              <div className="flex items-center gap-3 rounded-full border border-stone-200 px-2 py-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex size-7 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  disabled={qty <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex size-7 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  addToCart(product, qty);
                  closeQuickAdd();
                }}
                className="flex-1 rounded-full bg-stone-900 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Add {qty > 1 ? `${qty} ` : ""}to cart — ${(product.price * qty).toFixed(2)}
              </button>
              <button
                aria-label="Wishlist"
                className="flex size-12 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"
              >
                <Heart size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
              <Truck size={14} />
              Free delivery on orders over $30
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
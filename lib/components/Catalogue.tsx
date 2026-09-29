"use client";
import { useMemo, useState } from "react";
import { Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/cartContext";

type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    badge?: string;
    category?: string;
};

const CATEGORIES = ["Category A", "Category B", "Category C", "Category D"];

const products: Product[] = [
    { id: "1", name: "Product One", price: 24, category: "Category A" },
    { id: "2", name: "Product Two", price: 38, category: "Category B", badge: "New" },
    { id: "3", name: "Product Three", price: 15, category: "Category C" },
    { id: "4", name: "Product Four", price: 52, originalPrice: 65, category: "Category A", badge: "Sale" },
    { id: "5", name: "Product Five", price: 29, category: "Category D" },
    { id: "6", name: "Product Six", price: 41, category: "Category B" },
    { id: "7", name: "Product Seven", price: 19, category: "Category C", badge: "New" },
    { id: "8", name: "Product Eight", price: 63, category: "Category A" },
    { id: "9", name: "Product Nine", price: 34, originalPrice: 40, category: "Category D", badge: "Sale" },
    { id: "10", name: "Product Ten", price: 47, category: "Category B" },
]; // api

function FilterGroup({
    title,
    options,
    selected,
    onToggle,
}: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
}) {
    return (
        <details className="group border-b border-stone-200 py-4" open>
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-stone-800">
                {title}
                <ChevronDown size={15} className="text-stone-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
                {options.map((opt) => {
                    const active = selected.includes(opt);
                    return (
                        <button
                            key={opt}
                            onClick={() => onToggle(opt)}
                            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${active
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </details>
    );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
    const { openQuickAdd } = useCart();

    return (
        <div className="group"
            onClick={(e) => {
                e.stopPropagation();
                openQuickAdd(product);
            }}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-200">
                {product.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-900 px-2.5 py-1 text-[11px] text-white">
                        {product.badge}
                    </span>
                )}
                <div className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        aria-label="Wishlist"
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-700 hover:bg-white"
                    >
                        <Heart size={15} />
                    </button>
                    {/* <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openQuickAdd(product);
                        }}
                        aria-label="Add to cart"
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-700 hover:bg-white"
                    >
                        <ShoppingCart size={15} />
                    </button> */}
                </div>

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="font-serif text-5xl italic text-stone-400">{index + 1}</span>
                    </div>
                )}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
                <p className="font-serif italic text-lg text-stone-800">{product.name}</p>
                <div className="flex items-baseline gap-1.5">
                    {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">${product.originalPrice}</span>
                    )}
                    <span className="text-sm text-stone-900">${product.price}</span>
                </div>
            </div>
        </div>
    );
}

export default function Catalogue() {
    const [category, setCategory] = useState<string[]>([]);
    const [sort, setSort] = useState("Most Popular");
    const [sortOpen, setSortOpen] = useState(false);
    const SORT_OPTIONS = ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest"];

    const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
        set(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

    const filtered = useMemo(() => {
        if (category.length === 0) return products;
        return products.filter((p) => p.category && category.includes(p.category));
    }, [category]);

    return (
        <div className="bg-stone-50 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-42">
            <div className="px-6 pb-10 pt-16 sm:px-10 lg:px-16">
            </div>

            <div className="flex flex-col gap-10 px-6 pb-20 sm:px-10 lg:flex-row lg:px-16">
                <aside className="lg:w-56 lg:shrink-0">
                    <h2 className="mb-2 text-sm font-medium text-stone-900">Filter by</h2>
                    <FilterGroup
                        title="Category"
                        options={CATEGORIES}
                        selected={category}
                        onToggle={(v) => toggle(category, setCategory, v)}
                    />
                </aside>

                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
                        <p className="text-sm text-stone-500">Showing {filtered.length} results</p>

                        <div className="relative">
                            <button
                                onClick={() => setSortOpen((o) => !o)}
                                className="flex items-center gap-1.5 text-sm text-stone-700"
                            >
                                Sort by: <span className="font-medium">{sort}</span>
                                <ChevronDown size={14} className={sortOpen ? "rotate-180" : ""} />
                            </button>
                            {sortOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setSort(opt);
                                                setSortOpen(false);
                                            }}
                                            className="block w-full px-3 py-2 text-left text-sm text-stone-600 hover:bg-stone-50"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 py-24 text-center">
                            <p className="font-serif italic text-xl text-stone-700">Nothing here yet</p>
                            <p className="mt-1 text-sm text-stone-500">Check back soon, or try a different filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
                            {filtered.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
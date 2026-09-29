"use client";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";


const links = [
    { label: "Shop", href: "/shop" },
    { label: "Our Story", href: "/our-story" },
    { label: "Why Us", href: "/why-us" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
    const [open, setOpen] = useState(false);

    // close on Escape + lock page scroll while the sidebar is open
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        // document.body.style.overflow = open ? "hidden" : "";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <header className="sticky top-0 z-50 h-16 w-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                <div className="font-serif text-3xl text-stone-700 dark:text-stone-300 italic">
                    katalog imajiner.
                </div>

                {/* right side icons */}
                <div className="absolute right-4 flex items-center gap-1 text-stone-700 dark:text-stone-300">
                    <button
                        aria-label="Cart"
                        className="relative p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-stone-800 dark:bg-stone-200 text-white dark:text-black text-[10px] leading-4 text-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((o) => !o)}
                        className="relative p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors size-10"
                    >
                        {/* the two icons sit on top of each other and cross-fade + rotate */}
                        <Menu
                            size={22}
                            className={`absolute inset-0 m-auto transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                                }`}
                        />
                        <X
                            size={22}
                            className={`absolute inset-0 m-auto transition-all duration-300 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                                }`}
                        />
                    </button>
                </div>
            </header>

            {/* backdrop (starts below the navbar so the X stays clickable) */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-black/30 dark:bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* sidebar */}
            <aside
                className={`fixed right-0 bottom-0 top-16 z-40 w-80 max-w-[85vw] bg-stone-50 dark:bg-stone-900 shadow-2xl
              flex flex-col
              transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
                aria-hidden={!open}
                inert={!open}
            >
                <nav className="flex flex-col px-8 pt-10">
                    {links.map((l, i) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                            className={`font-serif italic text-3xl text-stone-700 dark:text-stone-300 py-4 border-b border-stone-200 dark:border-stone-800
                    hover:text-stone-900 dark:hover:text-stone-100 hover:pl-2 transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex justify-end px-2 pb-2">
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}
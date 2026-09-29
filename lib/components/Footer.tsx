"use client";
import { ArrowRight, Heart } from "lucide-react";

const shopLinks = ["Shop", "Our Story", "Why Us", "FAQ", "Contact"];
const helpLinks = ["Shipping", "Returns", "Track Order", "Privacy Policy"];

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
                <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
                    <div className="max-w-sm">
                        <p className="font-serif text-4xl italic text-white">tipografi instastory</p>
                        <p className="mt-4 text-sm leading-relaxed text-stone-400">
                            Small-batch, made with care. Sign up to hear when new jars land.
                        </p>

                        <form className="mt-6 flex items-center border-b border-stone-600 pb-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                aria-label="Subscribe"
                                className="text-stone-400 transition-colors hover:text-white"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Link columns */}
                    <div className="flex gap-16">
                        <div>
                            <p className="text-sm font-medium text-white">Shop</p>
                            <ul className="mt-4 space-y-3">
                                {shopLinks.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-stone-400 transition-colors hover:text-white">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-white">Help</p>
                            <ul className="mt-4 space-y-3">
                                {helpLinks.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-stone-400 transition-colors hover:text-white">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex flex-col-reverse items-center gap-4 border-t border-stone-700 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-xs text-stone-500">
                        © {new Date().getFullYear()} tipografi instastory. All rights reserved.
                    </p>
                    <a
                        href="#"
                        aria-label="Instagram"
                        className="text-stone-400 transition-colors hover:text-white"
                    >
                        <Heart size={18} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
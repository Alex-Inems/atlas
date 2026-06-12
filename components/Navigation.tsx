"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "./AuthContext";
import { PRIMARY_NAV_LINKS } from "@/lib/content/navigation";
import { useScrollPastElement } from "@/hooks/useScrollPastElement";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
    HERO_ELEMENT_ID,
    HERO_SCROLL_OFFSET,
    resolveNavSurface,
    navLinkClass,
    navActionClass,
    navCtaClass,
    navLogoLineClass,
    navLogoTextClass,
    navMenuIconClass,
    navActiveUnderlineClass,
    navActiveLayoutId,
} from "@/lib/navigation/theme";
import { MOTION } from "@/lib/motion/tokens";

const Navigation = () => {
    const pastHero = useScrollPastElement(HERO_ELEMENT_ID, HERO_SCROLL_OFFSET);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const surface = resolveNavSurface(pathname === "/", pastHero);

    useBodyScrollLock(mobileOpen);

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 md:px-10 pointer-events-auto">
                    <nav className="flex items-center justify-between h-20 md:h-24">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span
                                className={`block w-8 h-px transition-all duration-300 group-hover:w-10 ${navLogoLineClass(surface)}`}
                            />
                            <span
                                className={`text-sm font-black tracking-[0.32em] transition-colors ${navLogoTextClass(surface)}`}
                            >
                                ATLAS
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center gap-9">
                            {PRIMARY_NAV_LINKS.map(({ label, href }) => {
                                const active = pathname === href;
                                return (
                                    <li key={href}>
                                        <Link href={href} className={navLinkClass(surface, active)}>
                                            {label}
                                            {active && (
                                                <motion.span
                                                    layoutId={navActiveLayoutId(surface)}
                                                    className={`absolute -bottom-1.5 left-0 right-0 h-px ${navActiveUnderlineClass(surface)}`}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex items-center gap-4 md:gap-6">
                            {user ? (
                                <button
                                    onClick={logout}
                                    className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${navActionClass(surface)}`}
                                >
                                    Log out
                                </button>
                            ) : (
                                <button
                                    onClick={() => setAuthOpen(true)}
                                    className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${navActionClass(surface)}`}
                                >
                                    Portal
                                </button>
                            )}

                            <Link
                                href="/contact"
                                className={`hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold px-5 py-2.5 transition-all duration-300 ${navCtaClass(surface)}`}
                            >
                                Get quote
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className={`lg:hidden p-1 ${navMenuIconClass(surface)}`}
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-[60] bg-white lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: MOTION.duration.navMenu }}
                    >
                        <div className="flex items-center justify-between h-20 px-6 border-b border-line">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                <span className="block w-8 h-px bg-safety" />
                                <span className="text-sm font-black tracking-[0.32em] text-charcoal">ATLAS</span>
                            </Link>
                            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                                <X className="w-5 h-5 text-charcoal" />
                            </button>
                        </div>

                        <div className="px-6 py-10 flex flex-col gap-1">
                            {PRIMARY_NAV_LINKS.map(({ label, href }, i) => (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 + i * MOTION.stagger.navMobileItem }}
                                >
                                    <Link
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center justify-between py-4 border-b border-line text-2xl font-black tracking-tight ${
                                            pathname === href ? "text-safety" : "text-charcoal"
                                        }`}
                                    >
                                        {label}
                                        <ArrowUpRight className="w-5 h-5 opacity-30" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-6 border-t border-line flex gap-4">
                            <button
                                onClick={() => {
                                    setAuthOpen(true);
                                    setMobileOpen(false);
                                }}
                                className="flex-1 py-4 text-[11px] tracking-[0.18em] uppercase font-bold text-charcoal border border-line"
                            >
                                Portal
                            </button>
                            <Link
                                href="/contact"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 py-4 text-center text-[11px] tracking-[0.18em] uppercase font-bold bg-safety text-white"
                            >
                                Get quote
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
};

export default Navigation;

"use client";

import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
    navHeaderClass,
} from "@/lib/navigation/theme";
import { MOTION } from "@/lib/motion/tokens";

function NavigationInner() {
    const pastHero = useScrollPastElement(HERO_ELEMENT_ID, HERO_SCROLL_OFFSET);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const { user, logout, isLoading, isAdmin } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pendingAdminBookings, setPendingAdminBookings] = useState(0);

    const surface = resolveNavSurface(pathname, pathname === "/", pastHero);
    const loginRedirect = searchParams.get("login") === "1" && !user && !isLoading;

    useEffect(() => {
        if (!isAdmin || isLoading) {
            setPendingAdminBookings(0);
            return;
        }
        fetch("/api/alerts/summary")
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => setPendingAdminBookings(d?.pendingBookingsAdmin ?? 0))
            .catch(() => {});
    }, [isAdmin, isLoading, pathname]);

    useBodyScrollLock(mobileOpen);

    const authLinks = user ? (
        <>
            <Link
                href="/portal"
                className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${navActionClass(surface)}`}
            >
                Portal
            </Link>
            {isAdmin && (
                <Link
                    href="/admin/bookings"
                    className={`hidden md:inline-flex items-center text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${navActionClass(surface)}`}
                >
                    Admin
                    {pendingAdminBookings > 0 && (
                        <span className="nav-alert-badge" title="Pending bookings">
                            {pendingAdminBookings > 9 ? "9+" : pendingAdminBookings}
                        </span>
                    )}
                </Link>
            )}
            <Link
                href="/profile"
                className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors max-w-[120px] truncate ${navActionClass(surface)}`}
            >
                {user.name}
            </Link>
            <button
                type="button"
                onClick={() => logout()}
                className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${navActionClass(surface)}`}
            >
                Log out
            </button>
        </>
    ) : (
        <button
            type="button"
            onClick={() => setAuthOpen(true)}
            disabled={isLoading}
            className={`hidden md:block text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors disabled:opacity-50 ${navActionClass(surface)}`}
        >
            Portal
        </button>
    );

    const isDashboard = surface === "dashboard";
    const mobileItemClass = `flex items-center justify-between py-4 border-b text-2xl font-black tracking-tight ${
        isDashboard ? "border-white/10 text-white" : "border-line text-charcoal"
    }`;

    return (
        <>
            <header className={`fixed top-0 inset-x-0 z-50 pointer-events-none ${navHeaderClass(surface)}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 pointer-events-auto">
                    <nav className="flex items-center justify-between h-20 md:h-24">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span
                                className={`block w-8 h-px transition-all duration-300 group-hover:w-10 ${navLogoLineClass(surface)}`}
                            />
                            <span
                                className={`text-sm font-black tracking-[0.32em] transition-colors ${navLogoTextClass(surface)}`}
                            >
                                INEMA
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
                            {authLinks}

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
                        className={`fixed inset-0 z-[60] lg:hidden ${isDashboard ? "bg-[#141414]" : "bg-white"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: MOTION.duration.navMenu }}
                    >
                        <div
                            className={`flex items-center justify-between h-20 px-6 border-b ${isDashboard ? "border-white/10" : "border-line"}`}
                        >
                            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                <span className={`block w-8 h-px ${isDashboard ? "bg-[#3ecf8e]" : "bg-safety"}`} />
                                <span
                                    className={`text-sm font-black tracking-[0.32em] ${isDashboard ? "text-white" : "text-charcoal"}`}
                                >
                                    INEMA
                                </span>
                            </Link>
                            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                                <X className={`w-5 h-5 ${isDashboard ? "text-white" : "text-charcoal"}`} />
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
                                        className={`flex items-center justify-between py-4 border-b text-2xl font-black tracking-tight ${
                                            isDashboard ? "border-white/10" : "border-line"
                                        } ${
                                            pathname === href
                                                ? isDashboard
                                                    ? "text-[#3ecf8e]"
                                                    : "text-safety"
                                                : isDashboard
                                                  ? "text-white"
                                                  : "text-charcoal"
                                        }`}
                                    >
                                        {label}
                                        <ArrowUpRight className="w-5 h-5 opacity-30" />
                                    </Link>
                                </motion.div>
                            ))}
                            {user && (
                                <>
                                    <Link
                                        href="/portal"
                                        onClick={() => setMobileOpen(false)}
                                        className={mobileItemClass}
                                    >
                                        Portal
                                        <ArrowUpRight className="w-5 h-5 opacity-30" />
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            href="/admin/bookings"
                                            onClick={() => setMobileOpen(false)}
                                            className={mobileItemClass}
                                        >
                                            Admin
                                            {pendingAdminBookings > 0
                                                ? ` (${pendingAdminBookings})`
                                                : ""}
                                            <ArrowUpRight className="w-5 h-5 opacity-30" />
                                        </Link>
                                    )}
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className={mobileItemClass}
                                    >
                                        {user.name}
                                        <ArrowUpRight className="w-5 h-5 opacity-30" />
                                    </Link>
                                </>
                            )}
                        </div>

                        <div
                            className={`absolute bottom-0 inset-x-0 p-6 border-t flex gap-4 ${isDashboard ? "border-white/10" : "border-line"}`}
                        >
                            {user ? (
                                    <button
                                    type="button"
                                    onClick={() => {
                                        logout();
                                        setMobileOpen(false);
                                    }}
                                    className={`flex-1 py-4 text-[11px] tracking-[0.18em] uppercase font-bold border ${
                                        isDashboard
                                            ? "text-white border-white/20"
                                            : "text-charcoal border-line"
                                    }`}
                                >
                                    Log out
                                    </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthOpen(true);
                                        setMobileOpen(false);
                                    }}
                                    className="flex-1 py-4 text-[11px] tracking-[0.18em] uppercase font-bold text-charcoal border border-line"
                                >
                                    Portal
                                </button>
                            )}
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

            <AuthModal isOpen={authOpen || loginRedirect} onClose={() => setAuthOpen(false)} />
        </>
    );
}

const Navigation = () => (
    <Suspense fallback={null}>
        <NavigationInner />
    </Suspense>
);

export default Navigation;

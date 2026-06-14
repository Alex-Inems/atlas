"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Users,
    Table2,
    CalendarDays,
    ExternalLink,
    ChevronRight,
    Menu,
    X,
    LogOut,
    HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

const NAV_SECTIONS = [
    {
        label: "Project",
        items: [{ href: "/admin", label: "Project overview", icon: LayoutGrid, exact: true }],
    },
    {
        label: "Database",
        items: [
            { href: "/admin/pages", label: "Table Editor", icon: Table2 },
            { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
        ],
    },
    {
        label: "Authentication",
        items: [{ href: "/admin/users", label: "Users", icon: Users }],
    },
] as const;

function Breadcrumbs({ pathname }: { pathname: string }) {
    const crumbs: { label: string; href?: string }[] = [
        { label: "Inema", href: "/admin" },
    ];

    if (pathname === "/admin/users") crumbs.push({ label: "Authentication" }, { label: "Users" });
    else if (pathname === "/admin/pages") crumbs.push({ label: "Database" }, { label: "Table Editor" });
    else if (pathname.startsWith("/admin/pages/"))
        crumbs.push(
            { label: "Database", href: "/admin/pages" },
            { label: "Edit page" },
        );
    else if (pathname === "/admin/bookings" || pathname === "/admin/projects")
        crumbs.push({ label: "Operations" }, { label: "Bookings" });
    else if (pathname === "/admin") crumbs.push({ label: "Project overview" });

    return (
        <nav className="sb-breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
                <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="w-3 h-3 sb-breadcrumb-sep" />}
                    {crumb.href && i < crumbs.length - 1 ? (
                        <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                        <span style={{ color: i === crumbs.length - 1 ? "var(--sb-text)" : undefined }}>
                            {crumb.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}

export default function AdminShell({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: string;
    description?: string;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    const initials = user?.name?.slice(0, 2).toUpperCase() ?? "AD";

    return (
        <div className="admin-app">
            <header className="sb-topbar">
                <button
                    type="button"
                    className="sb-btn sb-btn-ghost md:hidden"
                    onClick={() => setSidebarOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>

                <Link href="/admin" className="sb-topbar-logo">
                    <span className="sb-topbar-logo-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="#0d0d0d"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    Inema
                </Link>

                <Breadcrumbs pathname={pathname} />

                <div className="sb-topbar-actions">
                    <Link
                        href="/"
                        target="_blank"
                        className="sb-btn sb-btn-ghost sb-btn-sm hidden sm:inline-flex"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View site
                    </Link>
                    <button type="button" className="sb-btn sb-btn-ghost sb-btn-sm" aria-label="Help">
                        <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    <div className="sb-user-chip">
                        <span className="sb-avatar">{initials}</span>
                        <span className="hidden sm:inline max-w-[140px] truncate">
                            {user?.email ?? "Admin"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => logout()}
                        className="sb-btn sb-btn-ghost sb-btn-sm"
                        title="Sign out"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </header>

            <div className="sb-layout">
                <aside className={`sb-sidebar ${sidebarOpen ? "open" : ""}`}>
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label} className="sb-sidebar-section">
                            <p className="sb-sidebar-label">{section.label}</p>
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sb-sidebar-link ${isActive(item.href, "exact" in item ? item.exact : false) ? "active" : ""}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    <div className="sb-sidebar-footer">
                        <Link href="/" className="sb-sidebar-link">
                            <ExternalLink />
                            Back to site
                        </Link>
                    </div>
                </aside>

                <main className="sb-main">
                    <div className="sb-content">
                        <header className="sb-page-header">
                            <h1 className="sb-page-title">{title}</h1>
                            {description && <p className="sb-page-desc">{description}</p>}
                        </header>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

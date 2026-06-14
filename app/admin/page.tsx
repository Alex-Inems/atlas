import type { Metadata } from "next";
import Link from "next/link";
import { Users, Shield, Ban, CalendarDays, Table2, Clock } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Project overview | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
    const { supabase } = await requireAdmin();

    const [
        { count: totalUsers },
        { count: adminUsers },
        { count: restrictedUsers },
        { count: totalBookings },
        { count: pendingBookings },
        { count: totalPages },
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "restricted"),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("site_pages").select("*", { count: "exact", head: true }),
    ]);

    const stats = [
        { label: "Total users", value: totalUsers ?? 0, icon: Users },
        { label: "Admins", value: adminUsers ?? 0, icon: Shield },
        { label: "Restricted", value: restrictedUsers ?? 0, icon: Ban },
        { label: "Total bookings", value: totalBookings ?? 0, icon: CalendarDays },
        { label: "Pending review", value: pendingBookings ?? 0, icon: Clock },
        { label: "Site tables", value: totalPages ?? 0, icon: Table2 },
    ];

    const quickLinks = [
        {
            href: "/admin/bookings",
            title: "Manage bookings",
            desc: "Confirm visits, set schedules, and update booking status",
        },
        {
            href: "/admin/users",
            title: "Manage users",
            desc: "View accounts, assign roles, restrict access",
        },
        {
            href: "/admin/pages",
            title: "Table Editor",
            desc: "Edit page content and company information",
        },
    ];

    return (
        <AdminShell
            title="Project overview"
            description="Monitor bookings, users, and site content from one place."
        >
            <div className="sb-stat-grid">
                {stats.map((s) => (
                    <div key={s.label} className="sb-stat-card">
                        <div className="flex items-center gap-2 mb-2" style={{ color: "var(--sb-text-dim)" }}>
                            <s.icon className="w-4 h-4" />
                            <span className="text-xs">{s.label}</span>
                        </div>
                        <p className="sb-stat-value">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="sb-card">
                <div className="sb-card-header">
                    <h2 className="sb-card-title">Quick actions</h2>
                </div>
                <ul className="sb-list">
                    {quickLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="sb-list-item">
                                <div>
                                    <p className="sb-list-item-title">{link.title}</p>
                                    <p className="sb-list-item-meta">{link.desc}</p>
                                </div>
                                <ChevronIcon />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {(pendingBookings ?? 0) > 0 && (
                <div className="sb-alert sb-alert-info" style={{ marginTop: 24 }}>
                    <strong>{pendingBookings}</strong> booking{(pendingBookings ?? 0) === 1 ? "" : "s"}{" "}
                    need review — open{" "}
                    <Link href="/admin/bookings" style={{ color: "inherit", textDecoration: "underline" }}>
                        Operations → Bookings
                    </Link>
                    .
                </div>
            )}
        </AdminShell>
    );
}

function ChevronIcon() {
    return (
        <svg
            className="sb-list-item-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

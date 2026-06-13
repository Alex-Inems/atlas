import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Admin | Atlas Build",
    robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
    const { supabase } = await requireAdmin();

    const [{ count: totalUsers }, { count: adminUsers }, { count: restrictedUsers }, { count: totalProjects }, { count: totalPages }] =
        await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "restricted"),
            supabase.from("client_projects").select("*", { count: "exact", head: true }),
            supabase.from("site_pages").select("*", { count: "exact", head: true }),
        ]);

    const stats = [
        { label: "Total users", value: totalUsers ?? 0 },
        { label: "Admins", value: adminUsers ?? 0 },
        { label: "Restricted", value: restrictedUsers ?? 0 },
        { label: "Client projects", value: totalProjects ?? 0 },
        { label: "Editable pages", value: totalPages ?? 0 },
    ];

    return (
        <AdminShell title="Dashboard">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white p-8">
                        <p className="text-4xl font-black font-mono text-safety">{s.value}</p>
                        <p className="text-sm font-semibold text-charcoal mt-2">{s.label}</p>
                    </div>
                ))}
            </div>
            <p className="text-sm text-muted mt-8 max-w-xl">
                Manage users, roles, site content, and client projects from the sidebar. Restricted
                users cannot access the portal.
            </p>
        </AdminShell>
    );
}

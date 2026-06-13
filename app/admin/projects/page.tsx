import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ProjectAdminTable from "@/components/admin/ProjectAdminTable";
import { requireAdmin } from "@/lib/admin/auth";
import type { ClientProject, Profile } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Projects | Admin",
    robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
    const { supabase } = await requireAdmin();

    const [{ data: projects }, { data: users }] = await Promise.all([
        supabase.from("client_projects").select("*").order("updated_at", { ascending: false }),
        supabase.from("profiles").select("*").neq("role", "restricted").order("full_name"),
    ]);

    return (
        <AdminShell title="Client projects">
            <ProjectAdminTable
                projects={(projects as ClientProject[]) ?? []}
                users={(users as Profile[]) ?? []}
            />
        </AdminShell>
    );
}

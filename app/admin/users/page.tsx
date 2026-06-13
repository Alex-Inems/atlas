import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { requireAdmin } from "@/lib/admin/auth";
import type { Profile } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Users | Admin",
    robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
    const { supabase, user } = await requireAdmin();

    const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <AdminShell title="User management">
            <UserManagementTable users={(users as Profile[]) ?? []} currentUserId={user.id} />
        </AdminShell>
    );
}

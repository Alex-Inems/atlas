import { redirect } from "next/navigation";
import { syncUserProfile } from "@/lib/admin/bootstrap";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/database";

export async function getSessionProfile() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { supabase, user: null, profile: null };

    await syncUserProfile({
        userId: user.id,
        email: user.email ?? "",
        fullName: user.user_metadata?.full_name,
    });

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return { supabase, user, profile };
}

export async function requireAdmin() {
    const { supabase, user, profile } = await getSessionProfile();

    if (!user) redirect("/?login=1");
    if (profile?.role !== "admin") redirect("/");

    return { supabase, user, profile };
}

export async function requireAuth() {
    const { supabase, user, profile } = await getSessionProfile();

    if (!user) redirect("/?login=1");
    if (profile?.role === "restricted") redirect("/?restricted=1");

    return { supabase, user, profile };
}

export function isAdminRole(role: UserRole | undefined | null): boolean {
    return role === "admin";
}

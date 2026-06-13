"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import type { ProjectStatus, UserRole } from "@/lib/types/database";

export async function updateUserRole(userId: string, role: UserRole, restrictedReason?: string) {
    const { supabase, user } = await requireAdmin();

    if (userId === user.id && role !== "admin") {
        return { error: "You cannot demote yourself." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            role,
            restricted_reason: role === "restricted" ? restrictedReason ?? "Restricted by admin" : null,
        })
        .eq("id", userId);

    if (error) return { error: error.message };

    revalidatePath("/admin/users");
    return { error: null };
}

export async function savePageContent(slug: string, content: Record<string, unknown>) {
    const { supabase, user } = await requireAdmin();

    const { error } = await supabase
        .from("site_pages")
        .update({ content, updated_by: user.id })
        .eq("slug", slug);

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath(`/${slug === "home" ? "" : slug}`);
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${slug}`);
    return { error: null };
}

export async function createClientProject(data: {
    user_id: string;
    title: string;
    location?: string;
    status: ProjectStatus;
    phase?: string;
}) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("client_projects").insert(data);
    if (error) return { error: error.message };

    revalidatePath("/admin/projects");
    revalidatePath("/portal");
    return { error: null };
}

export async function updateClientProject(
    id: string,
    data: Partial<{
        user_id: string;
        title: string;
        location: string;
        status: ProjectStatus;
        phase: string;
    }>,
) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("client_projects").update(data).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/projects");
    revalidatePath("/portal");
    return { error: null };
}

export async function deleteClientProject(id: string) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("client_projects").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/projects");
    revalidatePath("/portal");
    return { error: null };
}

export async function updateUserProfileAdmin(
    userId: string,
    data: { full_name?: string; email?: string },
) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) return { error: error.message };

    revalidatePath("/admin/users");
    return { error: null };
}

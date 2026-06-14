"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";

export async function updateProfileContact(data: {
    fullName: string;
    phone?: string;
    companyName?: string;
    notificationEmailOptIn?: boolean;
}) {
    const { supabase, user } = await requireAuth();

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: data.fullName.trim(),
            phone: data.phone?.trim() || null,
            company_name: data.companyName?.trim() || null,
            notification_email_opt_in: data.notificationEmailOptIn ?? true,
        })
        .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/profile");
    revalidatePath("/portal");
    return { error: null };
}

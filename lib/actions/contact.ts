"use server";

import { revalidatePath } from "next/cache";
import { emailContactInquiry } from "@/lib/email/booking";
import { createClient } from "@/lib/supabase/server";

export async function submitContactInquiry(data: {
    name: string;
    email: string;
    message: string;
}) {
    const name = data.name?.trim();
    const email = data.email?.trim();
    const message = data.message?.trim();

    if (!name || name.length < 2) return { error: "Enter your name." };
    if (!email || !email.includes("@")) return { error: "Enter a valid email." };
    if (!message || message.length < 10) return { error: "Message must be at least 10 characters." };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("contact_inquiries").insert({
        name,
        email,
        message,
        user_id: user?.id ?? null,
        status: "new",
    });

    if (error) return { error: error.message };

    await emailContactInquiry(name, email, message);

    revalidatePath("/admin/inquiries");
    return { error: null };
}

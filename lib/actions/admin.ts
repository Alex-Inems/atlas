"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { emailQuoteSent } from "@/lib/email/booking";
import type {
    BookingBudgetRange,
    BookingServiceType,
    BookingStatus,
    BookingTimeSlot,
    CreateBookingInput,
    InquiryStatus,
    QuoteStatus,
    UserRole,
} from "@/lib/types/database";

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

export async function updateBookingAdmin(
    id: string,
    data: Partial<{
        status: BookingStatus;
        service_type: BookingServiceType;
        preferred_date: string;
        preferred_time_slot: BookingTimeSlot;
        scheduled_start: string | null;
        scheduled_end: string | null;
        site_address: string;
        site_city: string;
        project_scope: string;
        budget_range: BookingBudgetRange | null;
        contact_phone: string;
        company_name: string | null;
        special_requirements: string | null;
        admin_notes: string | null;
        cancellation_reason: string | null;
    }>,
) {
    const { supabase } = await requireAdmin();

    const patch: Record<string, unknown> = { ...data };

    if (data.status === "confirmed") {
        patch.confirmed_at = new Date().toISOString();
    }
    if (data.status === "completed") {
        patch.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from("bookings").update(patch).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/bookings");
    revalidatePath("/portal");
    return { error: null };
}

export async function createBookingAdmin(
    userId: string,
    input: CreateBookingInput & { status?: BookingStatus },
) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("bookings").insert({
        user_id: userId,
        service_type: input.service_type,
        preferred_date: input.preferred_date,
        preferred_time_slot: input.preferred_time_slot,
        site_address: input.site_address.trim(),
        site_city: input.site_city.trim(),
        project_scope: input.project_scope.trim(),
        budget_range: input.budget_range ?? null,
        contact_phone: input.contact_phone.trim(),
        company_name: input.company_name?.trim() || null,
        special_requirements: input.special_requirements?.trim() || null,
        status: input.status ?? "pending",
        reference: "",
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/bookings");
    revalidatePath("/portal");
    return { error: null };
}

export async function deleteBooking(id: string) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/bookings");
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

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/inquiries");
    return { error: null };
}

type SaveQuoteInput = {
    user_id: string;
    title: string;
    status: QuoteStatus;
    tax_rate: number;
    valid_until: string | null;
    notes: string | null;
    line_items: { description: string; quantity: number; unit_price: number }[];
};

function quoteTotals(lineItems: SaveQuoteInput["line_items"], taxRate: number) {
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const total = subtotal * (1 + taxRate / 100);
    return { subtotal, total };
}

export async function saveQuote(quoteId: string | null, input: SaveQuoteInput) {
    const { supabase } = await requireAdmin();
    const { subtotal, total } = quoteTotals(input.line_items, input.tax_rate);

    const quotePayload = {
        user_id: input.user_id,
        title: input.title,
        status: input.status,
        tax_rate: input.tax_rate,
        subtotal,
        total,
        valid_until: input.valid_until,
        notes: input.notes,
    };

    let targetId = quoteId;

    if (quoteId) {
        const { error } = await supabase.from("quotes").update(quotePayload).eq("id", quoteId);
        if (error) return { error: error.message };
    } else {
        const { data, error } = await supabase
            .from("quotes")
            .insert({ ...quotePayload, reference: "" })
            .select("id")
            .single();
        if (error || !data) return { error: error?.message ?? "Failed to create quote." };
        targetId = data.id as string;
    }

    await supabase.from("quote_line_items").delete().eq("quote_id", targetId);

    if (input.line_items.length) {
        const { error: itemsError } = await supabase.from("quote_line_items").insert(
            input.line_items.map((item, index) => ({
                quote_id: targetId,
                description: item.description.trim(),
                quantity: item.quantity,
                unit_price: item.unit_price,
                sort_order: index,
            })),
        );
        if (itemsError) return { error: itemsError.message };
    }

    revalidatePath("/admin/quotes");
    revalidatePath("/portal/quotes");
    return { error: null };
}

export async function sendQuoteToClient(quoteId: string) {
    const { supabase } = await requireAdmin();

    const { data: quote, error } = await supabase
        .from("quotes")
        .select("id, reference, user_id, total, currency, status")
        .eq("id", quoteId)
        .single();

    if (error || !quote) return { error: error?.message ?? "Quote not found." };

    const { error: updateError } = await supabase
        .from("quotes")
        .update({ status: "sent" })
        .eq("id", quoteId);

    if (updateError) return { error: updateError.message };

    const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", quote.user_id)
        .single();

    if (profile?.email) {
        const formattedTotal = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: quote.currency ?? "IDR",
            maximumFractionDigits: 0,
        }).format(Number(quote.total));
        await emailQuoteSent(profile.email, quote.reference as string, formattedTotal);
    }

    revalidatePath("/admin/quotes");
    revalidatePath("/portal/quotes");
    revalidatePath(`/portal/quotes/${quoteId}`);
    return { error: null };
}

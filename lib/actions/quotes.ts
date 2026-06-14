"use server";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { requireAuth } from "@/lib/admin/auth";
import { logProjectEvent } from "@/lib/events/log";
import type { Quote } from "@/lib/types/database";

function stripeClient() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function acceptQuote(quoteId: string) {
    const { supabase, user } = await requireAuth();

    const { data: quote, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .eq("user_id", user.id)
        .eq("status", "sent")
        .single();

    if (error || !quote) return { error: "Quote not found or not available." };

    const { error: updateError } = await supabase
        .from("quotes")
        .update({ status: "accepted" })
        .eq("id", quoteId);

    if (updateError) return { error: updateError.message };

    if (quote.project_id) {
        await logProjectEvent(quote.project_id, "quote_accepted", `Quote ${quote.reference} accepted`, user.id);
    }

    revalidatePath("/portal/quotes");
    revalidatePath(`/portal/quotes/${quoteId}`);
    revalidatePath("/admin/quotes");
    return { error: null };
}

export async function declineQuote(quoteId: string) {
    const { supabase, user } = await requireAuth();

    const { error } = await supabase
        .from("quotes")
        .update({ status: "declined" })
        .eq("id", quoteId)
        .eq("user_id", user.id)
        .eq("status", "sent");

    if (error) return { error: error.message };

    revalidatePath("/portal/quotes");
    revalidatePath(`/portal/quotes/${quoteId}`);
    revalidatePath("/admin/quotes");
    return { error: null };
}

export async function createQuoteCheckout(quoteId: string) {
    const { supabase, user } = await requireAuth();
    const stripe = stripeClient();
    if (!stripe) return { error: "Payments are not configured.", url: null };

    const { data: quote } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .eq("user_id", user.id)
        .in("status", ["sent", "accepted"])
        .single();

    if (!quote) return { error: "Quote not found.", url: null };
    const q = quote as Quote;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const amountMinor = Math.round(Number(q.total) * 100);

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email ?? undefined,
        line_items: [
            {
                price_data: {
                    currency: q.currency.toLowerCase(),
                    unit_amount: amountMinor,
                    product_data: {
                        name: q.title,
                        description: `Quote ${q.reference}`,
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            quote_id: quoteId,
            user_id: user.id,
        },
        success_url: `${siteUrl}/portal/quotes/${quoteId}?paid=1`,
        cancel_url: `${siteUrl}/portal/quotes/${quoteId}`,
    });

    await supabase.from("payments").insert({
        quote_id: quoteId,
        user_id: user.id,
        amount: q.total,
        currency: q.currency,
        status: "pending",
        stripe_session_id: session.id,
    });

    return { error: null, url: session.url };
}

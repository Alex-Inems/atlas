import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AppPageHero from "@/components/portal/AppPageHero";
import QuoteDetailView from "@/components/portal/QuoteDetailView";
import { requireAuth } from "@/lib/admin/auth";
import type { Quote, QuoteLineItem } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Quote | Inema",
    robots: { index: false, follow: false },
};

export default async function PortalQuotePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { supabase, user } = await requireAuth();

    const { data: quote } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .neq("status", "draft")
        .single();

    if (!quote) notFound();

    const { data: lineItems } = await supabase
        .from("quote_line_items")
        .select("*")
        .eq("quote_id", id)
        .order("sort_order");

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Quote"
                title={(quote as Quote).reference}
                description={(quote as Quote).title}
            />
            <div className="sb-content-wrap-narrow">
                <Suspense>
                    <QuoteDetailView
                        quote={quote as Quote}
                        lineItems={(lineItems as QuoteLineItem[]) ?? []}
                    />
                </Suspense>
            </div>
        </div>
    );
}

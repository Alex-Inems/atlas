import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import QuoteAdminTable from "@/components/admin/QuoteAdminTable";
import { requireAdmin } from "@/lib/admin/auth";
import type { Profile, Quote, QuoteLineItem } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Quotes | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminQuotesPage() {
    const { supabase } = await requireAdmin();

    const [{ data: quotes }, { data: users }] = await Promise.all([
        supabase
            .from("quotes")
            .select("*, quote_line_items(*)")
            .order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("email"),
    ]);

    return (
        <AdminShell
            title="Quotes & proposals"
            description="Build formal quotes for clients — send for acceptance and Stripe deposit."
        >
            <QuoteAdminTable
                quotes={(quotes as (Quote & { quote_line_items: QuoteLineItem[] })[]) ?? []}
                users={(users as Profile[]) ?? []}
            />
        </AdminShell>
    );
}

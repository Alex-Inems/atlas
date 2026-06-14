import type { Metadata } from "next";
import Link from "next/link";
import AppPageHero from "@/components/portal/AppPageHero";
import MyQuotes from "@/components/portal/MyQuotes";
import { requireAuth } from "@/lib/admin/auth";
import type { Quote } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Quotes | Inema",
    robots: { index: false, follow: false },
};

export default async function PortalQuotesPage() {
    const { supabase, user } = await requireAuth();

    const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "draft")
        .order("created_at", { ascending: false });

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Commercial"
                title="Quotes & proposals"
                description="Review formal quotes, accept digitally, and pay deposits securely."
            />
            <div className="sb-content-wrap-narrow">
                <div className="flex gap-3 mb-4">
                    <Link href="/portal" className="sb-btn sb-btn-ghost sb-btn-sm">
                        ← Portal
                    </Link>
                    <Link href="/portal/projects" className="sb-btn sb-btn-ghost sb-btn-sm">
                        Projects
                    </Link>
                </div>
                <MyQuotes quotes={(quotes as Quote[]) ?? []} />
            </div>
        </div>
    );
}

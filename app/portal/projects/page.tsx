import type { Metadata } from "next";
import Link from "next/link";
import AppPageHero from "@/components/portal/AppPageHero";
import MyProjects from "@/components/portal/MyProjects";
import { requireAuth } from "@/lib/admin/auth";
import type { ClientProject } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Projects | Inema",
    robots: { index: false, follow: false },
};

export default async function PortalProjectsPage() {
    const { supabase } = await requireAuth();

    const { data: projects } = await supabase
        .from("client_projects")
        .select("*")
        .order("updated_at", { ascending: false });

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Delivery"
                title="Project workspace"
                description="Track phase, documents, and activity for confirmed engagements."
            />
            <div className="sb-content-wrap-narrow">
                <div className="flex gap-3 mb-4">
                    <Link href="/portal" className="sb-btn sb-btn-ghost sb-btn-sm">
                        ← Portal
                    </Link>
                    <Link href="/portal/quotes" className="sb-btn sb-btn-ghost sb-btn-sm">
                        Quotes
                    </Link>
                </div>
                <MyProjects projects={(projects as ClientProject[]) ?? []} />
            </div>
        </div>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Pages | Admin",
    robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
    const { supabase } = await requireAdmin();

    const { data: pages } = await supabase
        .from("site_pages")
        .select("slug, title, updated_at")
        .order("title");

    return (
        <AdminShell title="Page content">
            <div className="grid gap-px bg-line">
                {pages?.map((page) => (
                    <Link
                        key={page.slug}
                        href={`/admin/pages/${page.slug}`}
                        className="flex items-center justify-between bg-white p-6 hover:bg-premium transition-colors group"
                    >
                        <div>
                            <p className="font-bold text-charcoal group-hover:text-safety transition-colors">
                                {page.title}
                            </p>
                            <p className="text-xs text-muted mt-1">/{page.slug === "home" ? "" : page.slug}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-muted">
                                Updated {new Date(page.updated_at).toLocaleDateString()}
                            </p>
                            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-safety ml-auto mt-2" />
                        </div>
                    </Link>
                ))}
            </div>
        </AdminShell>
    );
}

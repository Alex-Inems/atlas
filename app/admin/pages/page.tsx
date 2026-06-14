import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Table Editor | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
    const { supabase } = await requireAdmin();

    const { data: pages } = await supabase
        .from("site_pages")
        .select("slug, title, updated_at")
        .order("title");

    return (
        <AdminShell
            title="Table Editor"
            description="Edit site page content stored in the site_pages table."
        >
            <div className="sb-card">
                <div className="sb-card-header">
                    <h2 className="sb-card-title">site_pages</h2>
                    <span className="sb-badge sb-badge-neutral">{pages?.length ?? 0} rows</span>
                </div>
                <ul className="sb-list">
                    {pages?.map((page) => (
                        <li key={page.slug}>
                            <Link href={`/admin/pages/${page.slug}`} className="sb-list-item">
                                <div>
                                    <p className="sb-list-item-title">{page.title}</p>
                                    <p className="sb-list-item-meta">
                                        slug: {page.slug} · route: /
                                        {page.slug === "home" ? "" : page.slug}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="sb-cell-mono" style={{ fontSize: 11 }}>
                                        {new Date(page.updated_at).toLocaleString()}
                                    </p>
                                    <svg
                                        className="sb-list-item-arrow ml-auto mt-1"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminShell>
    );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PageEditor from "@/components/admin/PageEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { EDITABLE_PAGE_SLUGS } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Edit row | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminEditPagePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { supabase } = await requireAdmin();

    if (!EDITABLE_PAGE_SLUGS.includes(slug as (typeof EDITABLE_PAGE_SLUGS)[number])) {
        notFound();
    }

    const { data: page } = await supabase.from("site_pages").select("*").eq("slug", slug).single();
    if (!page) notFound();

    return (
        <AdminShell
            title={page.title}
            description={`Editing site_pages row where slug = '${page.slug}'`}
        >
            <PageEditor
                slug={page.slug}
                title={page.title}
                initialContent={(page.content as Record<string, unknown>) ?? {}}
            />
        </AdminShell>
    );
}

import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import InquiryAdminTable from "@/components/admin/InquiryAdminTable";
import { requireAdmin } from "@/lib/admin/auth";
import type { ContactInquiry } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Inquiries | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminInquiriesPage() {
    const { supabase } = await requireAdmin();

    const { data: inquiries } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <AdminShell
            title="Contact inquiries"
            description="Leads and messages from the public contact form."
        >
            <InquiryAdminTable inquiries={(inquiries as ContactInquiry[]) ?? []} />
        </AdminShell>
    );
}

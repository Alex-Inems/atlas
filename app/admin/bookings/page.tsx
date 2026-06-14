import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import BookingAdminTable from "@/components/admin/BookingAdminTable";
import { requireAdmin } from "@/lib/admin/auth";
import type { Booking, Profile } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Bookings | Inema",
    robots: { index: false, follow: false },
};

export default async function AdminBookingsPage() {
    const { supabase } = await requireAdmin();

    const [{ data: bookings }, { data: users }] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("full_name"),
    ]);

    return (
        <AdminShell
            title="Bookings"
            description="Review site visit requests, confirm schedules, and manage the full booking pipeline."
        >
            <BookingAdminTable
                bookings={(bookings as Booking[]) ?? []}
                users={(users as Profile[]) ?? []}
            />
        </AdminShell>
    );
}

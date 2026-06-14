import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import AppPageHero from "@/components/portal/AppPageHero";
import BookingForm from "@/components/portal/BookingForm";
import MyBookings from "@/components/portal/MyBookings";
import BookingScrollAnchor from "@/components/portal/BookingScrollAnchor";
import { requireAuth } from "@/lib/admin/auth";
import type { Booking } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Book a visit | Inema",
    robots: { index: false, follow: false },
};

export default async function PortalPage() {
    const { supabase, user } = await requireAuth();

    const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="sb-app-page">
            <Suspense fallback={null}>
                <BookingScrollAnchor />
            </Suspense>
            <AppPageHero
                label="Client portal"
                title="Book a site visit"
                description="Request consultations, site assessments, and project meetings — aligned with AIA delivery phases and OSHA site protocols."
            />

            <div className="sb-content-wrap">
                <div className="sb-card" style={{ marginBottom: 24 }}>
                    <div className="sb-card-header">
                        <p className="sb-card-title">Session</p>
                        <Link href="/profile" className="sb-btn sb-btn-default sb-btn-sm">
                            Account settings
                        </Link>
                    </div>
                    <div className="sb-card-body-padded" style={{ paddingTop: 12, paddingBottom: 12 }}>
                        <p className="sb-cell-mono" style={{ fontSize: 13 }}>
                            {user.email}
                        </p>
                    </div>
                </div>

                <BookingForm />
                <MyBookings bookings={(bookings as Booking[]) ?? []} />
            </div>
        </div>
    );
}

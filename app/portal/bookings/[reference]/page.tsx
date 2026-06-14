import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppPageHero from "@/components/portal/AppPageHero";
import BookingDetail from "@/components/portal/BookingDetail";
import { getBookingByReference } from "@/lib/actions/bookings";

export const metadata: Metadata = {
    title: "Booking | Inema",
    robots: { index: false, follow: false },
};

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ reference: string }>;
}) {
    const { reference } = await params;
    const { booking, events, error } = await getBookingByReference(reference);

    if (error || !booking) notFound();

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Booking"
                title={booking.reference}
                description={booking.project_scope.slice(0, 120)}
            />
            <div className="sb-content-wrap-narrow">
                <BookingDetail booking={booking} events={events} />
            </div>
        </div>
    );
}

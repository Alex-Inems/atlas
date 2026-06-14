"use client";

import { useState, useTransition } from "react";
import { Loader2, XCircle } from "lucide-react";
import { cancelBooking } from "@/lib/actions/bookings";
import { useAlert } from "@/components/alerts/AlertProvider";
import ConfirmDialog from "@/components/alerts/ConfirmDialog";
import {
    BOOKING_BUDGET_LABELS,
    BOOKING_SERVICE_LABELS,
    BOOKING_STATUS_LABELS,
    BOOKING_TIME_SLOT_LABELS,
    type Booking,
    type BookingStatus,
} from "@/lib/types/database";

function statusBadgeClass(status: BookingStatus) {
    if (status === "confirmed" || status === "completed") return "sb-badge sb-badge-brand";
    if (status === "pending") return "sb-badge sb-badge-warning";
    if (status === "cancelled" || status === "no_show") return "sb-badge sb-badge-danger";
    return "sb-badge sb-badge-neutral";
}

export default function MyBookings({ bookings }: { bookings: Booking[] }) {
    const alert = useAlert();
    const [pending, startTransition] = useTransition();
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const handleCancelConfirm = () => {
        if (!cancelTarget) return;
        startTransition(async () => {
            const result = await cancelBooking(cancelTarget.id, cancelReason);
            if (result.error) {
                alert.error("Cancellation failed", result.error);
                return;
            }
            alert.success("Booking cancelled", `Reference ${result.reference} was cancelled.`);
            setCancelTarget(null);
            setCancelReason("");
        });
    };

    if (!bookings.length) {
        return (
            <div id="my-bookings" className="sb-card" style={{ marginTop: 32 }}>
                <div className="sb-empty">
                    No bookings yet. Submit a request above to schedule your first site visit.
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="my-bookings" className="sb-card" style={{ marginTop: 32 }}>
                <div className="sb-card-header">
                    <h2 className="sb-card-title">My bookings</h2>
                    <span className="sb-badge sb-badge-neutral">{bookings.length}</span>
                </div>

                <ul className="sb-list">
                    {bookings.map((b) => (
                        <li
                            key={b.id}
                            className="sb-list-item"
                            style={{ cursor: "default", flexWrap: "wrap" }}
                        >
                            <div style={{ flex: 1, minWidth: 240 }}>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="sb-cell-mono" style={{ color: "var(--sb-brand)" }}>
                                        {b.reference}
                                    </span>
                                    <span className={statusBadgeClass(b.status)}>
                                        {BOOKING_STATUS_LABELS[b.status]}
                                    </span>
                                </div>
                                <p className="sb-list-item-title">
                                    {BOOKING_SERVICE_LABELS[b.service_type]}
                                </p>
                                <p className="sb-list-item-meta">
                                    {new Date(b.preferred_date).toLocaleDateString("en-GB", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}{" "}
                                    · {BOOKING_TIME_SLOT_LABELS[b.preferred_time_slot]}
                                </p>
                                <p className="sb-list-item-meta" style={{ marginTop: 4 }}>
                                    {b.site_address}, {b.site_city}
                                </p>
                                {b.scheduled_start && (
                                    <p
                                        className="sb-list-item-meta"
                                        style={{ marginTop: 4, color: "var(--sb-brand)" }}
                                    >
                                        Confirmed: {new Date(b.scheduled_start).toLocaleString()}
                                    </p>
                                )}
                                {b.budget_range && (
                                    <p className="sb-list-item-meta" style={{ marginTop: 4 }}>
                                        Budget: {BOOKING_BUDGET_LABELS[b.budget_range]}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p className="sb-cell-mono" style={{ fontSize: 11 }}>
                                    {new Date(b.created_at).toLocaleDateString()}
                                </p>
                                {(b.status === "pending" || b.status === "confirmed") && (
                                    <button
                                        type="button"
                                        disabled={pending}
                                        onClick={() => {
                                            setCancelTarget(b);
                                            setCancelReason("");
                                        }}
                                        className="sb-btn sb-btn-danger sb-btn-sm"
                                    >
                                        <XCircle className="w-3 h-3" />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {pending && (
                    <div className="sb-loading" style={{ padding: 16 }}>
                        <Loader2 className="w-4 h-4 sb-spin" />
                        Updating…
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={!!cancelTarget}
                title="Cancel booking"
                variant="danger"
                loading={pending}
                confirmLabel="Cancel booking"
                description={
                    cancelTarget ? (
                        <div className="space-y-3">
                            <p>
                                Cancel <strong className="font-mono">{cancelTarget.reference}</strong>?
                                This cannot be undone.
                            </p>
                            <div className="sb-field">
                                <label className="sb-label">Reason (optional)</label>
                                <textarea
                                    className="sb-textarea"
                                    rows={2}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Schedule conflict, project on hold…"
                                />
                            </div>
                        </div>
                    ) : null
                }
                onConfirm={handleCancelConfirm}
                onCancel={() => {
                    setCancelTarget(null);
                    setCancelReason("");
                }}
            />
        </>
    );
}

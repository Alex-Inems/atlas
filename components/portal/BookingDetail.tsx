"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Calendar, XCircle } from "lucide-react";
import { cancelBooking, requestReschedule } from "@/lib/actions/bookings";
import { useAlert } from "@/components/alerts/AlertProvider";
import ConfirmDialog from "@/components/alerts/ConfirmDialog";
import {
    BOOKING_BUDGET_LABELS,
    BOOKING_SERVICE_LABELS,
    BOOKING_STATUS_LABELS,
    BOOKING_TIME_SLOT_LABELS,
    type Booking,
    type BookingEvent,
    type BookingStatus,
    type BookingTimeSlot,
} from "@/lib/types/database";

const TIME_SLOTS = Object.keys(BOOKING_TIME_SLOT_LABELS) as BookingTimeSlot[];

function statusBadgeClass(status: BookingStatus) {
    if (status === "confirmed" || status === "completed") return "sb-badge sb-badge-brand";
    if (status === "pending" || status === "reschedule_requested") return "sb-badge sb-badge-warning";
    if (status === "cancelled" || status === "no_show") return "sb-badge sb-badge-danger";
    return "sb-badge sb-badge-neutral";
}

export default function BookingDetail({
    booking,
    events,
}: {
    booking: Booking;
    events: BookingEvent[];
}) {
    const alert = useAlert();
    const [pending, startTransition] = useTransition();
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleSlot, setRescheduleSlot] = useState<BookingTimeSlot | "">("");
    const [rescheduleNote, setRescheduleNote] = useState("");

    const minDate = new Date().toISOString().split("T")[0];
    const canReschedule = ["pending", "confirmed"].includes(booking.status);
    const canCancel = ["pending", "confirmed", "reschedule_requested"].includes(booking.status);

    return (
        <div className="space-y-6">
            <Link href="/portal#my-bookings" className="sb-btn sb-btn-ghost sb-btn-sm">
                ← Back to bookings
            </Link>

            <div className="sb-card">
                <div className="sb-card-header">
                    <div>
                        <p className="sb-cell-mono" style={{ color: "var(--sb-brand)", marginBottom: 4 }}>
                            {booking.reference}
                        </p>
                        <h2 className="sb-card-title">{BOOKING_SERVICE_LABELS[booking.service_type]}</h2>
                    </div>
                    <span className={statusBadgeClass(booking.status)}>
                        {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                </div>

                <div className="sb-card-body-padded space-y-4">
                    <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="sb-label">Preferred date</dt>
                            <dd>
                                {new Date(booking.preferred_date).toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}{" "}
                                · {BOOKING_TIME_SLOT_LABELS[booking.preferred_time_slot]}
                            </dd>
                        </div>
                        {booking.scheduled_start && (
                            <div>
                                <dt className="sb-label">Confirmed slot</dt>
                                <dd style={{ color: "var(--sb-brand)" }}>
                                    {new Date(booking.scheduled_start).toLocaleString()}
                                </dd>
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <dt className="sb-label">Site</dt>
                            <dd>
                                {booking.site_address}, {booking.site_city}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="sb-label">Scope</dt>
                            <dd>{booking.project_scope}</dd>
                        </div>
                        {booking.budget_range && (
                            <div>
                                <dt className="sb-label">Budget</dt>
                                <dd>{BOOKING_BUDGET_LABELS[booking.budget_range]}</dd>
                            </div>
                        )}
                        {booking.company_name && (
                            <div>
                                <dt className="sb-label">Company</dt>
                                <dd>{booking.company_name}</dd>
                            </div>
                        )}
                        <div>
                            <dt className="sb-label">Contact phone</dt>
                            <dd>{booking.contact_phone}</dd>
                        </div>
                    </dl>

                    {booking.status === "reschedule_requested" && booking.reschedule_preferred_date && (
                        <div className="sb-banner sb-banner-warning" style={{ borderRadius: 6, padding: 12 }}>
                            Reschedule requested for{" "}
                            {new Date(booking.reschedule_preferred_date).toLocaleDateString()} ·{" "}
                            {booking.reschedule_preferred_time_slot
                                ? BOOKING_TIME_SLOT_LABELS[booking.reschedule_preferred_time_slot]
                                : ""}
                            {booking.reschedule_note && ` — ${booking.reschedule_note}`}
                        </div>
                    )}

                    {booking.project_id && (
                        <Link href={`/portal/projects/${booking.project_id}`} className="sb-btn sb-btn-default sb-btn-sm">
                            View project workspace →
                        </Link>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                        {canReschedule && (
                            <button
                                type="button"
                                className="sb-btn sb-btn-default sb-btn-sm"
                                onClick={() => setRescheduleOpen(true)}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                Request reschedule
                            </button>
                        )}
                        {canCancel && (
                            <button
                                type="button"
                                className="sb-btn sb-btn-danger sb-btn-sm"
                                onClick={() => setCancelOpen(true)}
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                Cancel booking
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {events.length > 0 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h3 className="sb-card-title">Activity</h3>
                    </div>
                    <ul className="sb-list">
                        {events.map((e) => (
                            <li key={e.id} className="sb-list-item" style={{ cursor: "default" }}>
                                <div>
                                    <p className="sb-list-item-title">{e.message}</p>
                                    <p className="sb-list-item-meta">
                                        {new Date(e.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ConfirmDialog
                open={cancelOpen}
                title="Cancel booking"
                variant="danger"
                loading={pending}
                confirmLabel="Cancel booking"
                description={
                    <div className="space-y-3">
                        <p>Cancel this booking? This cannot be undone.</p>
                        <div className="sb-field">
                            <label className="sb-label">Reason (optional)</label>
                            <textarea
                                className="sb-textarea"
                                rows={2}
                                value={cancelReason}
                                onChange={(ev) => setCancelReason(ev.target.value)}
                            />
                        </div>
                    </div>
                }
                onConfirm={() => {
                    startTransition(async () => {
                        const result = await cancelBooking(booking.id, cancelReason);
                        if (result.error) alert.error("Cancellation failed", result.error);
                        else {
                            alert.success("Booking cancelled");
                            setCancelOpen(false);
                        }
                    });
                }}
                onCancel={() => setCancelOpen(false)}
            />

            <ConfirmDialog
                open={rescheduleOpen}
                title="Request reschedule"
                variant="default"
                loading={pending}
                confirmLabel="Submit request"
                description={
                    <div className="space-y-3">
                        <p>We will review your new preferred date and confirm by email.</p>
                        <div className="sb-field">
                            <label className="sb-label">New date *</label>
                            <input
                                type="date"
                                className="sb-input"
                                min={minDate}
                                value={rescheduleDate}
                                onChange={(ev) => setRescheduleDate(ev.target.value)}
                            />
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">Time slot *</label>
                            <select
                                className="sb-input"
                                value={rescheduleSlot}
                                onChange={(ev) => setRescheduleSlot(ev.target.value as BookingTimeSlot)}
                            >
                                <option value="">Select…</option>
                                {TIME_SLOTS.map((s) => (
                                    <option key={s} value={s}>
                                        {BOOKING_TIME_SLOT_LABELS[s]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">Note (optional)</label>
                            <textarea
                                className="sb-textarea"
                                rows={2}
                                value={rescheduleNote}
                                onChange={(ev) => setRescheduleNote(ev.target.value)}
                            />
                        </div>
                    </div>
                }
                onConfirm={() => {
                    if (!rescheduleDate || !rescheduleSlot) {
                        alert.error("Missing fields", "Select a date and time slot.");
                        return;
                    }
                    startTransition(async () => {
                        const result = await requestReschedule(
                            booking.id,
                            rescheduleDate,
                            rescheduleSlot,
                            rescheduleNote,
                        );
                        if (result.error) alert.error("Request failed", result.error);
                        else {
                            alert.success("Reschedule requested", "We'll confirm your new slot soon.");
                            setRescheduleOpen(false);
                        }
                    });
                }}
                onCancel={() => setRescheduleOpen(false)}
            />

            {pending && (
                <div className="sb-loading">
                    <Loader2 className="w-4 h-4 sb-spin" />
                </div>
            )}
        </div>
    );
}

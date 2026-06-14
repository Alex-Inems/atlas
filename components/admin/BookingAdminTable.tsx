"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { Loader2, Search, Trash2 } from "lucide-react";
import { deleteBooking, updateBookingAdmin } from "@/lib/actions/admin";
import { useAlert } from "@/components/alerts/AlertProvider";
import {
    BOOKING_BUDGET_LABELS,
    BOOKING_SERVICE_LABELS,
    BOOKING_STATUS_LABELS,
    BOOKING_TIME_SLOT_LABELS,
    type Booking,
    type BookingBudgetRange,
    type BookingServiceType,
    type BookingStatus,
    type BookingTimeSlot,
    type Profile,
} from "@/lib/types/database";

const STATUSES = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];
const SERVICES = Object.keys(BOOKING_SERVICE_LABELS) as BookingServiceType[];
const SLOTS = Object.keys(BOOKING_TIME_SLOT_LABELS) as BookingTimeSlot[];
const BUDGETS = Object.keys(BOOKING_BUDGET_LABELS) as BookingBudgetRange[];

function statusBadgeClass(status: BookingStatus) {
    if (status === "confirmed" || status === "completed") return "sb-badge sb-badge-brand";
    if (status === "pending") return "sb-badge sb-badge-warning";
    if (status === "cancelled" || status === "no_show") return "sb-badge sb-badge-danger";
    return "sb-badge sb-badge-neutral";
}

export default function BookingAdminTable({
    bookings,
    users,
}: {
    bookings: Booking[];
    users: Profile[];
}) {
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const alert = useAlert();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return bookings.filter((b) => {
            if (statusFilter !== "all" && b.status !== statusFilter) return false;
            if (!q) return true;
            const client = users.find((u) => u.id === b.user_id);
            return (
                b.reference.toLowerCase().includes(q) ||
                b.site_address.toLowerCase().includes(q) ||
                b.site_city.toLowerCase().includes(q) ||
                client?.email?.toLowerCase().includes(q) ||
                client?.full_name?.toLowerCase().includes(q)
            );
        });
    }, [bookings, query, statusFilter, users]);

    const run = (fn: () => Promise<{ error: string | null }>, successMsg = "Booking updated.") => {
        setMessage(null);
        setError(null);
        startTransition(async () => {
            const result = await fn();
            if (result.error) {
                setError(result.error);
                alert.error("Update failed", result.error);
            } else {
                setMessage(successMsg);
                alert.success("Saved", successMsg);
            }
        });
    };

    const pendingCount = bookings.filter((b) => b.status === "pending").length;

    return (
        <div>
            {message && <div className="sb-alert sb-alert-success">{message}</div>}
            {error && <div className="sb-alert sb-alert-error">{error}</div>}

            {pendingCount > 0 && (
                <div className="sb-alert sb-alert-info" style={{ marginBottom: 16 }}>
                    {pendingCount} booking{pendingCount === 1 ? "" : "s"} awaiting review.
                </div>
            )}

            <div className="sb-card">
                <div className="sb-card-header">
                    <div className="sb-search">
                        <Search className="sb-search-icon" />
                        <input
                            type="search"
                            className="sb-input"
                            placeholder="Search reference, client, address…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="sb-select"
                        style={{ maxWidth: 180 }}
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as BookingStatus | "all")
                        }
                    >
                        <option value="all">All statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {BOOKING_STATUS_LABELS[s]}
                            </option>
                        ))}
                    </select>
                    <span className="sb-badge sb-badge-neutral">{filtered.length} rows</span>
                </div>

                <div className="sb-table-wrap">
                    <table className="sb-table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Client</th>
                                <th>Service</th>
                                <th>Preferred</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="sb-empty">No bookings match your filters.</div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((b) => {
                                    const client = users.find((u) => u.id === b.user_id);
                                    const expanded = expandedId === b.id;
                                    return (
                                        <Fragment key={b.id}>
                                            <tr>
                                                <td className="sb-cell-mono" style={{ color: "var(--sb-brand)" }}>
                                                    {b.reference}
                                                </td>
                                                <td>
                                                    <div className="sb-cell-primary">
                                                        {client?.full_name ?? "—"}
                                                    </div>
                                                    <div className="sb-cell-mono">{client?.email}</div>
                                                </td>
                                                <td>
                                                    <div className="sb-cell-primary" style={{ maxWidth: 160 }}>
                                                        {BOOKING_SERVICE_LABELS[b.service_type]}
                                                    </div>
                                                    <div className="sb-cell-mono">{b.site_city}</div>
                                                </td>
                                                <td className="sb-cell-mono">
                                                    {new Date(b.preferred_date).toLocaleDateString()}
                                                    <br />
                                                    {BOOKING_TIME_SLOT_LABELS[b.preferred_time_slot]}
                                                </td>
                                                <td>
                                                    <span className={statusBadgeClass(b.status)}>
                                                        {BOOKING_STATUS_LABELS[b.status]}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            className="sb-btn sb-btn-default sb-btn-sm"
                                                            onClick={() =>
                                                                setExpandedId(expanded ? null : b.id)
                                                            }
                                                        >
                                                            {expanded ? "Close" : "Manage"}
                                                        </button>
                                                        {b.status === "pending" && (
                                                            <button
                                                                type="button"
                                                                disabled={pending}
                                                                className="sb-btn sb-btn-primary sb-btn-sm"
                                                                onClick={() =>
                                                                    run(
                                                                        () =>
                                                                            updateBookingAdmin(b.id, {
                                                                                status: "confirmed",
                                                                            }),
                                                                        `${b.reference} confirmed.`,
                                                                    )
                                                                }
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            disabled={pending}
                                                            className="sb-btn sb-btn-danger sb-btn-sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Delete ${b.reference}?`,
                                                                    )
                                                                ) {
                                                                    run(() => deleteBooking(b.id));
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expanded && (
                                                <tr key={`${b.id}-detail`}>
                                                    <td colSpan={6} style={{ background: "var(--sb-surface-raised)" }}>
                                                        <div className="p-4 grid md:grid-cols-2 gap-4">
                                                            <div className="sb-field">
                                                                <label className="sb-label">Status</label>
                                                                <select
                                                                    className="sb-select"
                                                                    defaultValue={b.status}
                                                                    disabled={pending}
                                                                    onChange={(e) =>
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                status: e.target
                                                                                    .value as BookingStatus,
                                                                            }),
                                                                        )
                                                                    }
                                                                >
                                                                    {STATUSES.map((s) => (
                                                                        <option key={s} value={s}>
                                                                            {BOOKING_STATUS_LABELS[s]}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="sb-field">
                                                                <label className="sb-label">Service</label>
                                                                <select
                                                                    className="sb-select"
                                                                    defaultValue={b.service_type}
                                                                    disabled={pending}
                                                                    onChange={(e) =>
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                service_type: e.target
                                                                                    .value as BookingServiceType,
                                                                            }),
                                                                        )
                                                                    }
                                                                >
                                                                    {SERVICES.map((s) => (
                                                                        <option key={s} value={s}>
                                                                            {BOOKING_SERVICE_LABELS[s]}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="sb-field">
                                                                <label className="sb-label">Scheduled start</label>
                                                                <input
                                                                    type="datetime-local"
                                                                    className="sb-input"
                                                                    defaultValue={
                                                                        b.scheduled_start
                                                                            ? b.scheduled_start.slice(0, 16)
                                                                            : ""
                                                                    }
                                                                    onBlur={(e) => {
                                                                        if (!e.target.value) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                scheduled_start: new Date(
                                                                                    e.target.value,
                                                                                ).toISOString(),
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="sb-field">
                                                                <label className="sb-label">Scheduled end</label>
                                                                <input
                                                                    type="datetime-local"
                                                                    className="sb-input"
                                                                    defaultValue={
                                                                        b.scheduled_end
                                                                            ? b.scheduled_end.slice(0, 16)
                                                                            : ""
                                                                    }
                                                                    onBlur={(e) => {
                                                                        if (!e.target.value) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                scheduled_end: new Date(
                                                                                    e.target.value,
                                                                                ).toISOString(),
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                                                                <label className="sb-label">Site address</label>
                                                                <input
                                                                    className="sb-input"
                                                                    defaultValue={b.site_address}
                                                                    onBlur={(e) => {
                                                                        if (e.target.value === b.site_address) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                site_address: e.target.value,
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                                                                <label className="sb-label">Project scope</label>
                                                                <textarea
                                                                    className="sb-textarea"
                                                                    rows={3}
                                                                    defaultValue={b.project_scope}
                                                                    onBlur={(e) => {
                                                                        if (e.target.value === b.project_scope) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                project_scope: e.target.value,
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="sb-field">
                                                                <label className="sb-label">Phone</label>
                                                                <input
                                                                    className="sb-input"
                                                                    defaultValue={b.contact_phone}
                                                                    onBlur={(e) => {
                                                                        if (e.target.value === b.contact_phone) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                contact_phone: e.target.value,
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="sb-field">
                                                                <label className="sb-label">Budget</label>
                                                                <select
                                                                    className="sb-select"
                                                                    defaultValue={b.budget_range ?? ""}
                                                                    disabled={pending}
                                                                    onChange={(e) =>
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                budget_range:
                                                                                    (e.target.value as BookingBudgetRange) ||
                                                                                    null,
                                                                            }),
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="">—</option>
                                                                    {BUDGETS.map((r) => (
                                                                        <option key={r} value={r}>
                                                                            {BOOKING_BUDGET_LABELS[r]}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                                                                <label className="sb-label">Admin notes (internal)</label>
                                                                <textarea
                                                                    className="sb-textarea"
                                                                    rows={2}
                                                                    value={notes[b.id] ?? b.admin_notes ?? ""}
                                                                    onChange={(e) =>
                                                                        setNotes((n) => ({
                                                                            ...n,
                                                                            [b.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    onBlur={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val === (b.admin_notes ?? "")) return;
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                admin_notes: val || null,
                                                                            }),
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            {b.special_requirements && (
                                                                <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                                                                    <label className="sb-label">Client requirements</label>
                                                                    <p className="sb-page-sub">{b.special_requirements}</p>
                                                                </div>
                                                            )}
                                                            <div className="sb-field">
                                                                <label className="sb-label">Time slot</label>
                                                                <select
                                                                    className="sb-select"
                                                                    defaultValue={b.preferred_time_slot}
                                                                    disabled={pending}
                                                                    onChange={(e) =>
                                                                        run(() =>
                                                                            updateBookingAdmin(b.id, {
                                                                                preferred_time_slot: e.target
                                                                                    .value as BookingTimeSlot,
                                                                            }),
                                                                        )
                                                                    }
                                                                >
                                                                    {SLOTS.map((s) => (
                                                                        <option key={s} value={s}>
                                                                            {BOOKING_TIME_SLOT_LABELS[s]}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pending && (
                <div className="sb-loading">
                    <Loader2 className="w-4 h-4 sb-spin" />
                    Saving…
                </div>
            )}
        </div>
    );
}

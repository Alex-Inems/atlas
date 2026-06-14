"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Calendar,
    MapPin,
    Phone,
    Building2,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
} from "lucide-react";
import { createBooking } from "@/lib/actions/bookings";
import { useAlert } from "@/components/alerts/AlertProvider";
import {
    validateBookingFields,
    validateBookingStep,
    type BookingFieldErrors,
} from "@/lib/booking/validate";
import {
    BOOKING_BUDGET_LABELS,
    BOOKING_SERVICE_DESCRIPTIONS,
    BOOKING_SERVICE_LABELS,
    BOOKING_TIME_SLOT_LABELS,
    type BookingBudgetRange,
    type BookingServiceType,
    type BookingTimeSlot,
    type CreateBookingInput,
} from "@/lib/types/database";

const DRAFT_KEY = "inema-booking-draft";
const STEPS = ["Service", "Schedule", "Site & scope", "Contact", "Review"] as const;
const SERVICE_TYPES = Object.keys(BOOKING_SERVICE_LABELS) as BookingServiceType[];
const TIME_SLOTS = Object.keys(BOOKING_TIME_SLOT_LABELS) as BookingTimeSlot[];
const BUDGET_RANGES = Object.keys(BOOKING_BUDGET_LABELS) as BookingBudgetRange[];

const emptyForm = {
    service_type: "" as BookingServiceType | "",
    preferred_date: "",
    preferred_time_slot: "" as BookingTimeSlot | "",
    site_address: "",
    site_city: "Jakarta",
    project_scope: "",
    budget_range: "" as BookingBudgetRange | "",
    contact_phone: "",
    company_name: "",
    special_requirements: "",
};

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="sb-field-error" role="alert">{message}</p>;
}

function inputClass(invalid?: boolean) {
    return `sb-input${invalid ? " sb-input-invalid" : ""}`;
}

export default function BookingForm() {
    const router = useRouter();
    const alert = useAlert();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(emptyForm);
    const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});
    const [pending, startTransition] = useTransition();

    const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(DRAFT_KEY);
            if (raw) setForm({ ...emptyForm, ...JSON.parse(raw) });
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        } catch {
            /* ignore */
        }
    }, [form]);

    const payload = useMemo((): CreateBookingInput | null => {
        if (!form.service_type || !form.preferred_time_slot) return null;
        return {
            service_type: form.service_type,
            preferred_date: form.preferred_date,
            preferred_time_slot: form.preferred_time_slot,
            site_address: form.site_address,
            site_city: form.site_city,
            project_scope: form.project_scope,
            budget_range: form.budget_range || null,
            contact_phone: form.contact_phone,
            company_name: form.company_name,
            special_requirements: form.special_requirements,
        };
    }, [form]);

    const scopeLen = form.project_scope.trim().length;

    const goNext = useCallback(() => {
        if (!payload && step < 4) {
            const partial = {
                service_type: form.service_type as BookingServiceType,
                preferred_date: form.preferred_date,
                preferred_time_slot: form.preferred_time_slot as BookingTimeSlot,
                site_address: form.site_address,
                site_city: form.site_city,
                project_scope: form.project_scope,
                contact_phone: form.contact_phone,
            } as CreateBookingInput;
            const errors = validateBookingStep(step, partial);
            setFieldErrors(errors);
            if (Object.keys(errors).length) {
                alert.warning("Check required fields", "Fix the highlighted fields to continue.");
                return;
            }
        } else if (step < 4 && payload) {
            const errors = validateBookingStep(step, payload);
            setFieldErrors(errors);
            if (Object.keys(errors).length) {
                alert.warning("Check required fields", "Fix the highlighted fields to continue.");
                return;
            }
        }
        setFieldErrors({});
        setStep((s) => Math.min(5, s + 1));
    }, [alert, form, payload, step]);

    const goBack = () => {
        setFieldErrors({});
        setStep((s) => Math.max(1, s - 1));
    };

    const handleSubmit = () => {
        if (!payload) return;

        const errors = validateBookingFields(payload);
        setFieldErrors(errors);
        if (Object.keys(errors).length) {
            alert.error("Cannot submit", "Please fix the errors in your booking.");
            return;
        }

        startTransition(async () => {
            const result = await createBooking(payload);

            if (result.error) {
                if (result.fieldErrors) setFieldErrors(result.fieldErrors);
                alert.error("Booking failed", result.error);
                return;
            }

            sessionStorage.removeItem(DRAFT_KEY);
            setForm(emptyForm);
            setStep(1);

            alert.success(
                "Booking submitted",
                `Reference ${result.reference} — we'll confirm within one business day.`,
            );

            router.push(`/portal?submitted=${encodeURIComponent(result.reference ?? "")}#my-bookings`);
            router.refresh();
        });
    };

    return (
        <div>
            <div className="booking-step-bar" aria-label="Booking progress">
                {STEPS.map((label, i) => {
                    const n = i + 1;
                    return (
                        <div
                            key={label}
                            className={`booking-step-dot ${step === n ? "active" : step > n ? "done" : ""}`}
                            title={label}
                        />
                    );
                })}
            </div>
            <p className="sb-page-sub" style={{ marginBottom: 20 }}>
                Step {step} of {STEPS.length}: <strong>{STEPS[step - 1]}</strong>
            </p>

            {step === 1 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h2 className="sb-card-title">Select service</h2>
                    </div>
                    <div className="sb-card-body-padded">
                        <div className="grid gap-3">
                            {SERVICE_TYPES.map((type) => (
                                <label
                                    key={type}
                                    className="flex gap-4 p-4 rounded cursor-pointer transition-colors"
                                    style={{
                                        border: `1px solid ${
                                            fieldErrors.service_type
                                                ? "var(--sb-danger)"
                                                : form.service_type === type
                                                  ? "var(--sb-brand)"
                                                  : "var(--sb-border)"
                                        }`,
                                        background:
                                            form.service_type === type
                                                ? "var(--sb-brand-muted)"
                                                : "var(--sb-surface-raised)",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="service_type"
                                        value={type}
                                        checked={form.service_type === type}
                                        onChange={() => {
                                            setForm((f) => ({ ...f, service_type: type }));
                                            setFieldErrors((e) => ({ ...e, service_type: undefined }));
                                        }}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="sb-cell-primary">{BOOKING_SERVICE_LABELS[type]}</p>
                                        <p className="sb-page-sub" style={{ marginTop: 4 }}>
                                            {BOOKING_SERVICE_DESCRIPTIONS[type]}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <FieldError message={fieldErrors.service_type} />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h2 className="sb-card-title">Schedule</h2>
                    </div>
                    <div className="sb-card-body-padded sb-form-grid">
                        <div className="sb-field">
                            <label className="sb-label">
                                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                Preferred date
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                className={inputClass(!!fieldErrors.preferred_date)}
                                value={form.preferred_date}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, preferred_date: e.target.value }));
                                    setFieldErrors((er) => ({ ...er, preferred_date: undefined }));
                                }}
                            />
                            <FieldError message={fieldErrors.preferred_date} />
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">Time window (WIB)</label>
                            <select
                                className={`sb-select${fieldErrors.preferred_time_slot ? " sb-input-invalid" : ""}`}
                                value={form.preferred_time_slot}
                                onChange={(e) => {
                                    setForm((f) => ({
                                        ...f,
                                        preferred_time_slot: e.target.value as BookingTimeSlot,
                                    }));
                                    setFieldErrors((er) => ({ ...er, preferred_time_slot: undefined }));
                                }}
                            >
                                <option value="">Select slot</option>
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {BOOKING_TIME_SLOT_LABELS[slot]}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={fieldErrors.preferred_time_slot} />
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h2 className="sb-card-title">Site & scope</h2>
                    </div>
                    <div className="sb-card-body-padded">
                        <div className="sb-form-grid">
                            <div className="sb-field">
                                <label className="sb-label">
                                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                    Site address
                                </label>
                                <input
                                    className={inputClass(!!fieldErrors.site_address)}
                                    placeholder="Street, district, postal code"
                                    value={form.site_address}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, site_address: e.target.value }));
                                        setFieldErrors((er) => ({ ...er, site_address: undefined }));
                                    }}
                                />
                                <FieldError message={fieldErrors.site_address} />
                            </div>
                            <div className="sb-field">
                                <label className="sb-label">City</label>
                                <input
                                    className={inputClass(!!fieldErrors.site_city)}
                                    value={form.site_city}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, site_city: e.target.value }));
                                        setFieldErrors((er) => ({ ...er, site_city: undefined }));
                                    }}
                                />
                                <FieldError message={fieldErrors.site_city} />
                            </div>
                            <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                                <label className="sb-label">
                                    Project scope{" "}
                                    <span className="sb-cell-mono" style={{ fontSize: 11 }}>
                                        ({scopeLen}/20 min)
                                    </span>
                                </label>
                                <textarea
                                    rows={4}
                                    className={`sb-textarea${fieldErrors.project_scope ? " sb-input-invalid" : ""}`}
                                    placeholder="Building type, GFA, timeline, structural system, permitting status…"
                                    value={form.project_scope}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, project_scope: e.target.value }));
                                        setFieldErrors((er) => ({ ...er, project_scope: undefined }));
                                    }}
                                />
                                <FieldError message={fieldErrors.project_scope} />
                            </div>
                            <div className="sb-field">
                                <label className="sb-label">Estimated budget (optional)</label>
                                <select
                                    className="sb-select"
                                    value={form.budget_range}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            budget_range: e.target.value as BookingBudgetRange,
                                        }))
                                    }
                                >
                                    <option value="">Optional</option>
                                    {BUDGET_RANGES.map((range) => (
                                        <option key={range} value={range}>
                                            {BOOKING_BUDGET_LABELS[range]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h2 className="sb-card-title">Contact</h2>
                    </div>
                    <div className="sb-card-body-padded sb-form-grid">
                        <div className="sb-field">
                            <label className="sb-label">
                                <Phone className="w-3.5 h-3.5 inline mr-1" />
                                Phone
                            </label>
                            <input
                                type="tel"
                                className={inputClass(!!fieldErrors.contact_phone)}
                                placeholder="+62 812 …"
                                value={form.contact_phone}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, contact_phone: e.target.value }));
                                    setFieldErrors((er) => ({ ...er, contact_phone: undefined }));
                                }}
                            />
                            <FieldError message={fieldErrors.contact_phone} />
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">
                                <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                Company (optional)
                            </label>
                            <input
                                className="sb-input"
                                value={form.company_name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, company_name: e.target.value }))
                                }
                            />
                        </div>
                        <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                            <label className="sb-label">Special requirements (optional)</label>
                            <textarea
                                rows={2}
                                className="sb-textarea"
                                placeholder="Access restrictions, PPE, crane availability…"
                                value={form.special_requirements}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, special_requirements: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && payload && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h2 className="sb-card-title">
                            <ClipboardCheck className="w-4 h-4 inline mr-1" />
                            Review & submit
                        </h2>
                    </div>
                    <div className="sb-card-body-padded">
                        <dl className="grid gap-3 text-sm">
                            {[
                                ["Service", BOOKING_SERVICE_LABELS[payload.service_type]],
                                [
                                    "Date",
                                    `${new Date(payload.preferred_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${BOOKING_TIME_SLOT_LABELS[payload.preferred_time_slot]}`,
                                ],
                                ["Site", `${payload.site_address}, ${payload.site_city}`],
                                ["Scope", payload.project_scope],
                                ["Phone", payload.contact_phone],
                                ...(payload.company_name ? [["Company", payload.company_name]] : []),
                                ...(payload.budget_range
                                    ? [["Budget", BOOKING_BUDGET_LABELS[payload.budget_range]]]
                                    : []),
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <dt className="sb-label">{k}</dt>
                                    <dd className="sb-cell-primary" style={{ marginTop: 2 }}>
                                        {v}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <div className="sb-alert sb-alert-info" style={{ marginTop: 16 }}>
                            By submitting, you request a site visit. Our team will confirm or propose
                            an alternative slot within one business day.
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
                {step > 1 && (
                    <button type="button" className="sb-btn sb-btn-default" onClick={goBack} disabled={pending}>
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                )}
                {step < 5 ? (
                    <button type="button" className="sb-btn sb-btn-primary" onClick={goNext}>
                        Continue
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="sb-btn sb-btn-primary"
                        onClick={handleSubmit}
                        disabled={pending}
                    >
                        {pending && <Loader2 className="w-4 h-4 sb-spin" />}
                        Submit booking request
                    </button>
                )}
            </div>
        </div>
    );
}

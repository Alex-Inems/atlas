import type { CreateBookingInput } from "@/lib/types/database";

export type BookingFieldErrors = Partial<Record<keyof CreateBookingInput | "form", string>>;

const PHONE_RE = /^\+?[\d\s().-]{8,20}$/;

export function validateBookingFields(input: CreateBookingInput): BookingFieldErrors {
    const errors: BookingFieldErrors = {};

    if (!input.service_type) errors.service_type = "Select a service.";
    if (!input.preferred_date) errors.preferred_date = "Choose a preferred date.";
    else {
        const preferred = new Date(`${input.preferred_date}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (preferred < today) errors.preferred_date = "Date must be today or later.";
    }
    if (!input.preferred_time_slot) errors.preferred_time_slot = "Choose a time window.";
    if (!input.site_address?.trim()) errors.site_address = "Site address is required.";
    else if (input.site_address.trim().length < 8) {
        errors.site_address = "Enter a complete street address.";
    }
    if (!input.site_city?.trim()) errors.site_city = "City is required.";
    if (!input.project_scope?.trim()) errors.project_scope = "Describe your project scope.";
    else if (input.project_scope.trim().length < 20) {
        errors.project_scope = `Add more detail (${input.project_scope.trim().length}/20 min).`;
    }
    if (!input.contact_phone?.trim()) errors.contact_phone = "Phone number is required.";
    else if (!PHONE_RE.test(input.contact_phone.trim())) {
        errors.contact_phone = "Use a valid phone number (e.g. +62 812 …).";
    }

    return errors;
}

export function firstBookingError(errors: BookingFieldErrors): string | null {
    const keys = Object.keys(errors) as (keyof BookingFieldErrors)[];
    return keys.length ? (errors[keys[0]] ?? null) : null;
}

export function validateBookingStep(
    step: number,
    input: CreateBookingInput,
): BookingFieldErrors {
    const all = validateBookingFields(input);
    const stepFields: Record<number, (keyof CreateBookingInput)[]> = {
        1: ["service_type"],
        2: ["preferred_date", "preferred_time_slot"],
        3: ["site_address", "site_city", "project_scope"],
        4: ["contact_phone"],
    };
    const fields = stepFields[step] ?? Object.keys(all);
    const errors: BookingFieldErrors = {};
    for (const field of fields) {
        if (all[field]) errors[field] = all[field];
    }
    return errors;
}

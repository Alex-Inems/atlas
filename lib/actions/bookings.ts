"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";
import { firstBookingError, validateBookingFields } from "@/lib/booking/validate";
import { logBookingEvent } from "@/lib/events/log";
import type {
    Booking,
    BookingEvent,
    BookingTimeSlot,
    CreateBookingInput,
} from "@/lib/types/database";

export async function createBooking(input: CreateBookingInput) {
    const fieldErrors = validateBookingFields(input);
    const validationError = firstBookingError(fieldErrors);
    if (validationError) return { error: validationError, fieldErrors };

    const { supabase, user } = await requireAuth();

    const { data: duplicate } = await supabase
        .from("bookings")
        .select("reference")
        .eq("user_id", user.id)
        .eq("service_type", input.service_type)
        .eq("preferred_date", input.preferred_date)
        .eq("status", "pending")
        .maybeSingle();

    if (duplicate) {
        return {
            error: `You already have a pending booking (${duplicate.reference}) for this service and date.`,
            fieldErrors: { preferred_date: "Duplicate pending request." },
        };
    }

    const { data, error } = await supabase
        .from("bookings")
        .insert({
            user_id: user.id,
            service_type: input.service_type,
            preferred_date: input.preferred_date,
            preferred_time_slot: input.preferred_time_slot,
            site_address: input.site_address.trim(),
            site_city: input.site_city.trim(),
            project_scope: input.project_scope.trim(),
            budget_range: input.budget_range ?? null,
            contact_phone: input.contact_phone.trim(),
            company_name: input.company_name?.trim() || null,
            special_requirements: input.special_requirements?.trim() || null,
            status: "pending",
            reference: "",
        })
        .select("id, reference, service_type, preferred_date, preferred_time_slot")
        .single();

    if (error) return { error: error.message };

    revalidatePath("/portal");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return {
        error: null,
        reference: data.reference as string,
        bookingId: data.id as string,
    };
}

export async function cancelBooking(bookingId: string, reason?: string) {
    const { supabase, user } = await requireAuth();

    const { data: existing } = await supabase
        .from("bookings")
        .select("reference, status")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

    if (!existing) return { error: "Booking not found." };
    if (!["pending", "confirmed"].includes(existing.status)) {
        return { error: "This booking can no longer be cancelled online." };
    }

    const { error } = await supabase
        .from("bookings")
        .update({
            status: "cancelled",
            cancellation_reason: reason?.trim() || "Cancelled by client",
        })
        .eq("id", bookingId)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/portal");
    revalidatePath("/admin/bookings");
    return { error: null, reference: existing.reference as string };
}

export async function getBookingByReference(reference: string) {
    const { supabase, user } = await requireAuth();

    const { data: booking, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("reference", reference)
        .eq("user_id", user.id)
        .single();

    if (error || !booking) {
        return { booking: null, events: [] as BookingEvent[], error: error?.message ?? "Not found" };
    }

    const { data: events } = await supabase
        .from("booking_events")
        .select("*")
        .eq("booking_id", booking.id)
        .order("created_at", { ascending: true });

    return {
        booking: booking as Booking,
        events: (events ?? []) as BookingEvent[],
        error: null,
    };
}

export async function requestReschedule(
    bookingId: string,
    preferredDate: string,
    preferredTimeSlot: BookingTimeSlot,
    note?: string,
) {
    const { supabase, user } = await requireAuth();

    const { data: existing } = await supabase
        .from("bookings")
        .select("reference, status")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

    if (!existing) return { error: "Booking not found." };
    if (!["pending", "confirmed"].includes(existing.status)) {
        return { error: "This booking cannot be rescheduled online." };
    }

    const { error } = await supabase
        .from("bookings")
        .update({
            status: "reschedule_requested",
            reschedule_preferred_date: preferredDate,
            reschedule_preferred_time_slot: preferredTimeSlot,
            reschedule_note: note?.trim() || null,
        })
        .eq("id", bookingId)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    await logBookingEvent(
        bookingId,
        "reschedule_requested",
        `Client requested reschedule to ${preferredDate}`,
        user.id,
        { preferred_date: preferredDate, preferred_time_slot: preferredTimeSlot, note },
    );

    revalidatePath("/portal");
    revalidatePath(`/portal/bookings/${existing.reference}`);
    revalidatePath("/admin/bookings");
    return { error: null };
}

import { createServiceClient } from "@/lib/supabase/service";

export async function logBookingEvent(
    bookingId: string,
    eventType: string,
    message: string,
    actorId?: string | null,
    metadata?: Record<string, unknown>,
) {
    const service = createServiceClient();
    if (!service) return;

    await service.from("booking_events").insert({
        booking_id: bookingId,
        event_type: eventType,
        message,
        actor_id: actorId ?? null,
        metadata: metadata ?? {},
    });
}

export async function logProjectEvent(
    projectId: string,
    eventType: string,
    message: string,
    actorId?: string | null,
    metadata?: Record<string, unknown>,
) {
    const service = createServiceClient();
    if (!service) return;

    await service.from("project_events").insert({
        project_id: projectId,
        event_type: eventType,
        message,
        actor_id: actorId ?? null,
        metadata: metadata ?? {},
    });
}

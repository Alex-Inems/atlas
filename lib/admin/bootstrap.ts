import { createServiceClient } from "@/lib/supabase/service";
import type { UserRole } from "@/lib/types/database";

export interface SyncProfileInput {
    userId: string;
    email: string;
    fullName?: string | null;
}

export interface SyncProfileResult {
    role: UserRole;
    profileExists: boolean;
    promoted: boolean;
}

function bootstrapEmailMatches(email: string): boolean {
    const configured = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
    return !!configured && email.trim().toLowerCase() === configured;
}

/** Ensures a profile row exists and promotes ADMIN_BOOTSTRAP_EMAIL to admin. */
export async function syncUserProfile(
    input: SyncProfileInput,
): Promise<SyncProfileResult | null> {
    const service = createServiceClient();
    if (!service) return null;

    const shouldPromote = bootstrapEmailMatches(input.email);

    const { data: existing, error: readError } = await service
        .from("profiles")
        .select("id, role")
        .eq("id", input.userId)
        .maybeSingle();

    if (readError) {
        console.error("[syncUserProfile] read failed:", readError.message);
        return null;
    }

    const role: UserRole = shouldPromote
        ? "admin"
        : ((existing?.role as UserRole | undefined) ?? "user");

    const { error: upsertError } = await service.from("profiles").upsert(
        {
            id: input.userId,
            email: input.email,
            full_name:
                input.fullName?.trim() ||
                input.email.split("@")[0] ||
                "User",
            role,
        },
        { onConflict: "id" },
    );

    if (upsertError) {
        console.error("[syncUserProfile] upsert failed:", upsertError.message);
        return null;
    }

    return {
        role,
        profileExists: !!existing,
        promoted: shouldPromote,
    };
}

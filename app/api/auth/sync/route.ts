import { NextResponse } from "next/server";
import { syncUserProfile } from "@/lib/admin/bootstrap";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const sync = await syncUserProfile({
        userId: user.id,
        email: user.email ?? "",
        fullName: user.user_metadata?.full_name,
    });

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role, email")
        .eq("id", user.id)
        .single();

    return NextResponse.json({
        ok: true,
        sync,
        profile,
        profileError: profileError?.message ?? null,
        bootstrapConfigured: !!(
            process.env.ADMIN_BOOTSTRAP_EMAIL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ),
    });
}

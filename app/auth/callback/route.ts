import { syncUserProfile } from "@/lib/admin/bootstrap";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/portal";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                await syncUserProfile({
                    userId: user.id,
                    email: user.email ?? "",
                    fullName: user.user_metadata?.full_name,
                });
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/?login=1`);
}

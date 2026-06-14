import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { syncUserProfile } from "@/lib/admin/bootstrap";

const AUTH_PREFIXES = ["/portal", "/profile"];
const ADMIN_PREFIX = "/admin";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const needsAuth = AUTH_PREFIXES.some((p) => pathname.startsWith(p));
    const needsAdmin = pathname.startsWith(ADMIN_PREFIX);

    if (!user && (needsAuth || needsAdmin)) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("login", "1");
        return NextResponse.redirect(url);
    }

    if (user && (needsAuth || needsAdmin)) {
        await syncUserProfile({
            userId: user.id,
            email: user.email ?? "",
            fullName: user.user_metadata?.full_name as string | undefined,
        });

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "restricted" && needsAuth) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.searchParams.set("restricted", "1");
            return NextResponse.redirect(url);
        }

        if (needsAdmin && profile?.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

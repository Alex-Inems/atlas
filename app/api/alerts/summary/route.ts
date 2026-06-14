import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === "admin";

    const [{ count: pendingUser }, { count: confirmedUpcoming }] = await Promise.all([
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "pending"),
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "confirmed"),
    ]);

    let pendingBookingsAdmin = 0;
    if (isAdmin) {
        const { count } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");
        pendingBookingsAdmin = count ?? 0;
    }

    return NextResponse.json({
        pendingBookingsAdmin,
        pendingBookingsUser: pendingUser ?? 0,
        confirmedUpcoming: confirmedUpcoming ?? 0,
    });
}

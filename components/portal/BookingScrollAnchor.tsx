"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BookingScrollAnchor() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("submitted") || window.location.hash === "#my-bookings") {
            const el = document.getElementById("my-bookings");
            if (el) {
                window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
            }
        }
    }, [searchParams]);

    return null;
}

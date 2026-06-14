import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Bookings | Inema",
    robots: { index: false, follow: false },
};

export default function AdminProjectsRedirect() {
    redirect("/admin/bookings");
}

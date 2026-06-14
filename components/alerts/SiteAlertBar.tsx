"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { companyInfo } from "@/lib/data";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Bell, CheckCircle2, Info, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface AlertSummary {
    pendingBookingsAdmin: number;
    pendingBookingsUser: number;
    confirmedUpcoming: number;
}

export default function SiteAlertBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAdmin, isLoading } = useAuth();
    const [summary, setSummary] = useState<AlertSummary | null>(null);
    const [dismissedAdmin, setDismissedAdmin] = useState(false);

    const restricted = searchParams.get("restricted") === "1";
    const loginRequired = searchParams.get("login") === "1";
    const submitted = searchParams.get("submitted");

    useEffect(() => {
        if (!user || isLoading) {
            setSummary(null);
            return;
        }

        let cancelled = false;
        fetch("/api/alerts/summary")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (!cancelled && data) setSummary(data);
            })
            .catch(() => {});

        const interval = window.setInterval(() => {
            fetch("/api/alerts/summary")
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => {
                    if (!cancelled && data) setSummary(data);
                })
                .catch(() => {});
        }, 60_000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [user, isLoading, pathname]);

    if (pathname.startsWith("/admin")) return null;

    const banners: {
        key: string;
        variant: "error" | "info" | "success" | "warning";
        icon: typeof Info;
        content: React.ReactNode;
        onDismiss?: () => void;
    }[] = [];

    if (restricted) {
        banners.push({
            key: "restricted",
            variant: "error",
            icon: AlertCircle,
            content: (
                <>
                    Your account access is restricted. Contact{" "}
                    <a href={`mailto:${companyInfo.email}`} className="underline font-medium">
                        {companyInfo.email}
                    </a>{" "}
                    for assistance.
                </>
            ),
        });
    }

    if (loginRequired && !user && !isLoading) {
        banners.push({
            key: "login",
            variant: "info",
            icon: Info,
            content: "Sign in to access the client portal and book site visits.",
        });
    }

    if (submitted && pathname === "/portal") {
        banners.push({
            key: "submitted",
            variant: "success",
            icon: CheckCircle2,
            content: (
                <>
                    Booking <strong className="font-mono">{submitted}</strong> submitted. We will
                    confirm within one business day.
                </>
            ),
            onDismiss: () => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("submitted");
                router.replace(`/portal${params.size ? `?${params}` : ""}`);
            },
        });
    }

    if (
        isAdmin &&
        summary &&
        summary.pendingBookingsAdmin > 0 &&
        !dismissedAdmin &&
        !pathname.startsWith("/admin")
    ) {
        banners.push({
            key: "admin-pending",
            variant: "warning",
            icon: Bell,
            content: (
                <>
                    <strong>{summary.pendingBookingsAdmin}</strong> booking
                    {summary.pendingBookingsAdmin === 1 ? "" : "s"} awaiting review.{" "}
                    <Link href="/admin/bookings" className="underline font-semibold">
                        Open bookings dashboard
                    </Link>
                </>
            ),
            onDismiss: () => setDismissedAdmin(true),
        });
    }

    if (
        user &&
        !isAdmin &&
        summary &&
        summary.confirmedUpcoming > 0 &&
        pathname === "/portal"
    ) {
        banners.push({
            key: "upcoming",
            variant: "info",
            icon: CheckCircle2,
            content: (
                <>
                    You have <strong>{summary.confirmedUpcoming}</strong> confirmed visit
                    {summary.confirmedUpcoming === 1 ? "" : "s"} — see My bookings below.
                </>
            ),
        });
    }

    if (!banners.length) return null;

    return (
        <div className="site-banner-stack">
            {banners.map(({ key, variant, icon: Icon, content, onDismiss }) => (
                <div key={key} className={`site-banner site-banner-${variant}`} role="status">
                    <Icon className="site-banner-icon shrink-0" aria-hidden />
                    <p className="site-banner-text">{content}</p>
                    {onDismiss && (
                        <button
                            type="button"
                            className="site-banner-close"
                            onClick={onDismiss}
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

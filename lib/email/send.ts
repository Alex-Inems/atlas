import { companyInfo } from "@/lib/data";

const RESEND_API = "https://api.resend.com/emails";

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ ok: boolean; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM ?? `${companyInfo.name} <onboarding@resend.dev>`;

    if (!apiKey) {
        console.warn("[email] RESEND_API_KEY not set — skipping send:", opts.subject);
        return { ok: true };
    }

    try {
        const res = await fetch(RESEND_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from,
                to: Array.isArray(opts.to) ? opts.to : [opts.to],
                subject: opts.subject,
                html: opts.html,
                text: opts.text,
            }),
        });

        if (!res.ok) {
            const body = await res.text();
            return { ok: false, error: body };
        }
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
    }
}

export function opsEmail(): string | null {
    return process.env.BOOKING_NOTIFY_EMAIL ?? process.env.ADMIN_BOOTSTRAP_EMAIL ?? null;
}

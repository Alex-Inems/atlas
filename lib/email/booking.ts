import {
    BOOKING_BUDGET_LABELS,
    BOOKING_SERVICE_LABELS,
    BOOKING_STATUS_LABELS,
    BOOKING_TIME_SLOT_LABELS,
    type Booking,
    type BookingStatus,
} from "@/lib/types/database";
import { companyInfo } from "@/lib/data";
import { opsEmail, sendEmail } from "./send";

function layout(title: string, body: string) {
    return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:18px;margin:0 0 16px">${title}</h1>
${body}
<p style="margin-top:32px;font-size:12px;color:#666">${companyInfo.name} · Jakarta</p>
</body></html>`;
}

function bookingSummary(b: Pick<
    Booking,
    | "reference"
    | "service_type"
    | "preferred_date"
    | "preferred_time_slot"
    | "site_address"
    | "site_city"
    | "project_scope"
    | "budget_range"
>) {
    return `<ul style="padding-left:20px;line-height:1.6">
<li><strong>Reference:</strong> ${b.reference}</li>
<li><strong>Service:</strong> ${BOOKING_SERVICE_LABELS[b.service_type]}</li>
<li><strong>Date:</strong> ${b.preferred_date} · ${BOOKING_TIME_SLOT_LABELS[b.preferred_time_slot]}</li>
<li><strong>Site:</strong> ${b.site_address}, ${b.site_city}</li>
<li><strong>Scope:</strong> ${b.project_scope.slice(0, 200)}${b.project_scope.length > 200 ? "…" : ""}</li>
${b.budget_range ? `<li><strong>Budget:</strong> ${BOOKING_BUDGET_LABELS[b.budget_range]}</li>` : ""}
</ul>`;
}

export async function emailBookingSubmitted(booking: Booking, clientEmail: string) {
    await sendEmail({
        to: clientEmail,
        subject: `Booking received — ${booking.reference}`,
        html: layout(
            "We've received your booking request",
            `<p>Thank you. Our team will confirm your appointment within one business day.</p>
${bookingSummary(booking)}
<p>Track status in your <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal">client portal</a>.</p>`,
        ),
    });

    const ops = opsEmail();
    if (ops) {
        await sendEmail({
            to: ops,
            subject: `[New booking] ${booking.reference}`,
            html: layout("New booking requires review", bookingSummary(booking)),
        });
    }
}

export async function emailBookingStatusChange(
    booking: Booking,
    clientEmail: string,
    previousStatus: BookingStatus,
) {
    if (!clientEmail) return;
    const statusLabel = BOOKING_STATUS_LABELS[booking.status];

    await sendEmail({
        to: clientEmail,
        subject: `Booking ${booking.reference} — ${statusLabel}`,
        html: layout(
            `Booking update: ${statusLabel}`,
            `<p>Your booking status changed from <strong>${BOOKING_STATUS_LABELS[previousStatus]}</strong> to <strong>${statusLabel}</strong>.</p>
${bookingSummary(booking)}
${booking.scheduled_start ? `<p><strong>Confirmed time:</strong> ${new Date(booking.scheduled_start).toLocaleString()}</p>` : ""}
${booking.cancellation_reason ? `<p><strong>Note:</strong> ${booking.cancellation_reason}</p>` : ""}`,
        ),
    });
}

export async function emailContactInquiry(name: string, email: string, message: string) {
    const ops = opsEmail();
    if (ops) {
        await sendEmail({
            to: ops,
            subject: `[Contact] ${name}`,
            html: layout("New contact inquiry", `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br>")}</p>`),
        });
    }
    await sendEmail({
        to: email,
        subject: `We received your message — ${companyInfo.name}`,
        html: layout("Thanks for reaching out", `<p>Hi ${name},</p><p>We received your message and will respond within one business day.</p>`),
    });
}

export async function emailQuoteSent(clientEmail: string, reference: string, total: string) {
    await sendEmail({
        to: clientEmail,
        subject: `Quote ${reference} ready for review`,
        html: layout(
            "Your quote is ready",
            `<p>Quote <strong>${reference}</strong> for <strong>${total}</strong> is available in your portal.</p>
<p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal/quotes">View quotes</a></p>`,
        ),
    });
}

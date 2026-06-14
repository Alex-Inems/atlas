"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CreditCard, Check, X } from "lucide-react";
import { acceptQuote, createQuoteCheckout, declineQuote } from "@/lib/actions/quotes";
import { useAlert } from "@/components/alerts/AlertProvider";
import {
    QUOTE_STATUS_LABELS,
    type Quote,
    type QuoteLineItem,
} from "@/lib/types/database";

export default function QuoteDetailView({
    quote,
    lineItems,
}: {
    quote: Quote;
    lineItems: QuoteLineItem[];
}) {
    const alert = useAlert();
    const searchParams = useSearchParams();
    const paid = searchParams.get("paid") === "1";
    const [pending, startTransition] = useTransition();

    const subtotal = lineItems.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0);
    const tax = subtotal * (Number(quote.tax_rate) / 100);

    return (
        <div className="space-y-6">
            <Link href="/portal/quotes" className="sb-btn sb-btn-ghost sb-btn-sm">
                ← All quotes
            </Link>

            {paid && (
                <div className="sb-banner sb-banner-success" style={{ borderRadius: 6, padding: 12 }}>
                    Payment received — thank you.
                </div>
            )}

            <div className="sb-card">
                <div className="sb-card-header">
                    <div>
                        <p className="sb-cell-mono" style={{ color: "var(--sb-brand)" }}>
                            {quote.reference}
                        </p>
                        <h2 className="sb-card-title">{quote.title}</h2>
                    </div>
                    <span className="sb-badge sb-badge-neutral">
                        {QUOTE_STATUS_LABELS[quote.status]}
                    </span>
                </div>

                <div className="sb-card-body-padded">
                    {quote.valid_until && (
                        <p className="sb-list-item-meta mb-4">
                            Valid until {new Date(quote.valid_until).toLocaleDateString()}
                        </p>
                    )}

                    <table className="sb-table mb-4">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{Number(item.unit_price).toLocaleString()}</td>
                                    <td>
                                        {(Number(item.quantity) * Number(item.unit_price)).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <dl className="text-sm space-y-1 text-right">
                        <div>Subtotal: {quote.currency} {subtotal.toLocaleString()}</div>
                        <div>Tax ({quote.tax_rate}%): {quote.currency} {tax.toLocaleString()}</div>
                        <div className="font-semibold text-base">
                            Total: {quote.currency} {Number(quote.total).toLocaleString()}
                        </div>
                    </dl>

                    {quote.notes && (
                        <p className="mt-4 text-sm whitespace-pre-wrap" style={{ color: "var(--sb-text-muted)" }}>
                            {quote.notes}
                        </p>
                    )}

                    {quote.status === "sent" && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            <button
                                type="button"
                                className="sb-btn sb-btn-primary sb-btn-sm"
                                disabled={pending}
                                onClick={() =>
                                    startTransition(async () => {
                                        const result = await acceptQuote(quote.id);
                                        if (result.error) alert.error("Failed", result.error);
                                        else alert.success("Quote accepted");
                                    })
                                }
                            >
                                <Check className="w-3.5 h-3.5" />
                                Accept quote
                            </button>
                            <button
                                type="button"
                                className="sb-btn sb-btn-default sb-btn-sm"
                                disabled={pending}
                                onClick={() =>
                                    startTransition(async () => {
                                        const result = await createQuoteCheckout(quote.id);
                                        if (result.error || !result.url) {
                                            alert.error("Payment unavailable", result.error ?? "No checkout URL");
                                            return;
                                        }
                                        window.location.href = result.url;
                                    })
                                }
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                Pay deposit
                            </button>
                            <button
                                type="button"
                                className="sb-btn sb-btn-danger sb-btn-sm"
                                disabled={pending}
                                onClick={() =>
                                    startTransition(async () => {
                                        const result = await declineQuote(quote.id);
                                        if (result.error) alert.error("Failed", result.error);
                                        else alert.success("Quote declined");
                                    })
                                }
                            >
                                <X className="w-3.5 h-3.5" />
                                Decline
                            </button>
                        </div>
                    )}

                    {pending && (
                        <div className="sb-loading mt-4">
                            <Loader2 className="w-4 h-4 sb-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { QUOTE_STATUS_LABELS, type Quote } from "@/lib/types/database";

export default function MyQuotes({ quotes }: { quotes: Quote[] }) {
    if (!quotes.length) {
        return (
            <div className="sb-card">
                <div className="sb-empty">No quotes yet. Proposals will appear here after your site visit.</div>
            </div>
        );
    }

    return (
        <div className="sb-card">
            <div className="sb-card-header">
                <h2 className="sb-card-title">Quotes</h2>
                <span className="sb-badge sb-badge-neutral">{quotes.length}</span>
            </div>
            <ul className="sb-list">
                {quotes.map((q) => (
                    <li key={q.id} className="sb-list-item">
                        <div>
                            <p className="sb-cell-mono" style={{ color: "var(--sb-brand)", fontSize: 12 }}>
                                {q.reference}
                            </p>
                            <p className="sb-list-item-title">{q.title}</p>
                            <p className="sb-list-item-meta">
                                {q.currency} {Number(q.total).toLocaleString()} ·{" "}
                                {QUOTE_STATUS_LABELS[q.status]}
                            </p>
                        </div>
                        <Link href={`/portal/quotes/${q.id}`} className="sb-btn sb-btn-default sb-btn-sm">
                            View →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

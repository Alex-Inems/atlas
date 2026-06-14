"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { saveQuote, sendQuoteToClient } from "@/lib/actions/admin";
import { useAlert } from "@/components/alerts/AlertProvider";
import {
    QUOTE_STATUS_LABELS,
    type Profile,
    type Quote,
    type QuoteLineItem,
    type QuoteStatus,
} from "@/lib/types/database";

type QuoteWithItems = Quote & { quote_line_items?: QuoteLineItem[] };

const STATUSES = Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[];

export default function QuoteAdminTable({
    quotes,
    users,
}: {
    quotes: QuoteWithItems[];
    users: Profile[];
}) {
    const alert = useAlert();
    const [pending, startTransition] = useTransition();
    const [editing, setEditing] = useState<QuoteWithItems | "new" | null>(null);
    const [form, setForm] = useState({
        user_id: "",
        title: "",
        status: "draft" as QuoteStatus,
        tax_rate: 11,
        valid_until: "",
        notes: "",
        line_items: [{ description: "", quantity: 1, unit_price: 0 }],
    });

    const resetForm = () =>
        setForm({
            user_id: users[0]?.id ?? "",
            title: "",
            status: "draft",
            tax_rate: 11,
            valid_until: "",
            notes: "",
            line_items: [{ description: "", quantity: 1, unit_price: 0 }],
        });

    const run = (fn: () => Promise<{ error: string | null }>) => {
        startTransition(async () => {
            const result = await fn();
            if (result.error) alert.error("Failed", result.error);
            else alert.success("Saved");
        });
    };

    const openNew = () => {
        resetForm();
        setEditing("new");
    };

    const openEdit = (q: QuoteWithItems) => {
        setForm({
            user_id: q.user_id,
            title: q.title,
            status: q.status,
            tax_rate: Number(q.tax_rate),
            valid_until: q.valid_until ?? "",
            notes: q.notes ?? "",
            line_items:
                q.quote_line_items?.length
                    ? q.quote_line_items.map((i) => ({
                          description: i.description,
                          quantity: Number(i.quantity),
                          unit_price: Number(i.unit_price),
                      }))
                    : [{ description: "", quantity: 1, unit_price: 0 }],
        });
        setEditing(q);
    };

    const save = () => {
        if (!form.user_id || !form.title.trim()) {
            alert.error("Missing fields", "Select a client and enter a title.");
            return;
        }
        const quoteId = editing !== "new" && editing ? editing.id : null;
        run(() =>
            saveQuote(quoteId, {
                user_id: form.user_id,
                title: form.title.trim(),
                status: form.status,
                tax_rate: form.tax_rate,
                valid_until: form.valid_until || null,
                notes: form.notes || null,
                line_items: form.line_items.filter((i) => i.description.trim()),
            }),
        );
        setEditing(null);
    };

    return (
        <div className="space-y-4">
            <button type="button" className="sb-btn sb-btn-primary sb-btn-sm" onClick={openNew}>
                <Plus className="w-3.5 h-3.5" />
                New quote
            </button>

            <div className="sb-table-wrap">
                <table className="sb-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Client</th>
                            <th>Title</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((q) => {
                            const client = users.find((u) => u.id === q.user_id);
                            return (
                                <tr key={q.id}>
                                    <td className="sb-cell-mono">{q.reference}</td>
                                    <td>{client?.email}</td>
                                    <td>{q.title}</td>
                                    <td>
                                        {q.currency} {Number(q.total).toLocaleString()}
                                    </td>
                                    <td>
                                        <span className="sb-badge sb-badge-neutral">
                                            {QUOTE_STATUS_LABELS[q.status]}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            type="button"
                                            className="sb-btn sb-btn-ghost sb-btn-sm"
                                            onClick={() => openEdit(q)}
                                        >
                                            Edit
                                        </button>
                                        {q.status === "draft" && (
                                            <button
                                                type="button"
                                                className="sb-btn sb-btn-default sb-btn-sm"
                                                disabled={pending}
                                                onClick={() => run(() => sendQuoteToClient(q.id))}
                                            >
                                                <Send className="w-3 h-3" />
                                                Send
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h3 className="sb-card-title">
                            {editing === "new" ? "New quote" : `Edit ${editing.reference}`}
                        </h3>
                    </div>
                    <div className="sb-card-body-padded space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sb-field">
                                <label className="sb-label">Client</label>
                                <select
                                    className="sb-input"
                                    value={form.user_id}
                                    onChange={(e) => setForm((p) => ({ ...p, user_id: e.target.value }))}
                                >
                                    <option value="">Select…</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sb-field">
                                <label className="sb-label">Status</label>
                                <select
                                    className="sb-input"
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, status: e.target.value as QuoteStatus }))
                                    }
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {QUOTE_STATUS_LABELS[s]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">Title</label>
                            <input
                                className="sb-input"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            />
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">Line items</label>
                            {form.line_items.map((item, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                                    <input
                                        className="sb-input col-span-6"
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => {
                                            const items = [...form.line_items];
                                            items[i] = { ...items[i], description: e.target.value };
                                            setForm((p) => ({ ...p, line_items: items }));
                                        }}
                                    />
                                    <input
                                        type="number"
                                        className="sb-input col-span-2"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const items = [...form.line_items];
                                            items[i] = { ...items[i], quantity: Number(e.target.value) };
                                            setForm((p) => ({ ...p, line_items: items }));
                                        }}
                                    />
                                    <input
                                        type="number"
                                        className="sb-input col-span-3"
                                        placeholder="Unit price"
                                        value={item.unit_price}
                                        onChange={(e) => {
                                            const items = [...form.line_items];
                                            items[i] = { ...items[i], unit_price: Number(e.target.value) };
                                            setForm((p) => ({ ...p, line_items: items }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="sb-btn sb-btn-ghost sb-btn-sm col-span-1"
                                        onClick={() =>
                                            setForm((p) => ({
                                                ...p,
                                                line_items: p.line_items.filter((_, j) => j !== i),
                                            }))
                                        }
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="sb-btn sb-btn-ghost sb-btn-sm"
                                onClick={() =>
                                    setForm((p) => ({
                                        ...p,
                                        line_items: [...p.line_items, { description: "", quantity: 1, unit_price: 0 }],
                                    }))
                                }
                            >
                                Add line
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sb-field">
                                <label className="sb-label">Tax rate (%)</label>
                                <input
                                    type="number"
                                    className="sb-input"
                                    value={form.tax_rate}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, tax_rate: Number(e.target.value) }))
                                    }
                                />
                            </div>
                            <div className="sb-field">
                                <label className="sb-label">Valid until</label>
                                <input
                                    type="date"
                                    className="sb-input"
                                    value={form.valid_until}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, valid_until: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" className="sb-btn sb-btn-primary" disabled={pending} onClick={save}>
                                {pending && <Loader2 className="w-3.5 h-3.5 sb-spin" />}
                                Save quote
                            </button>
                            <button
                                type="button"
                                className="sb-btn sb-btn-ghost"
                                onClick={() => setEditing(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

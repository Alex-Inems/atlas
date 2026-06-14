"use client";

import { Fragment, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateInquiryStatus } from "@/lib/actions/admin";
import { useAlert } from "@/components/alerts/AlertProvider";
import { INQUIRY_STATUS_LABELS, type ContactInquiry, type InquiryStatus } from "@/lib/types/database";

export default function InquiryAdminTable({ inquiries }: { inquiries: ContactInquiry[] }) {
    const alert = useAlert();
    const [pending, startTransition] = useTransition();
    const [expanded, setExpanded] = useState<string | null>(null);

    const updateStatus = (id: string, status: InquiryStatus) => {
        startTransition(async () => {
            const result = await updateInquiryStatus(id, status);
            if (result.error) alert.error("Update failed", result.error);
            else alert.success("Inquiry updated");
        });
    };

    if (!inquiries.length) {
        return <div className="sb-empty">No contact inquiries yet.</div>;
    }

    return (
        <div className="sb-table-wrap">
            <table className="sb-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {inquiries.map((inq) => (
                        <Fragment key={inq.id}>
                            <tr>
                                <td className="sb-cell-mono">
                                    {new Date(inq.created_at).toLocaleDateString()}
                                </td>
                                <td>{inq.name}</td>
                                <td>
                                    <a href={`mailto:${inq.email}`} className="sb-link">
                                        {inq.email}
                                    </a>
                                </td>
                                <td>
                                    <select
                                        className="sb-input sb-input-sm"
                                        value={inq.status}
                                        disabled={pending}
                                        onChange={(e) =>
                                            updateStatus(inq.id, e.target.value as InquiryStatus)
                                        }
                                    >
                                        {(Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[]).map(
                                            (s) => (
                                                <option key={s} value={s}>
                                                    {INQUIRY_STATUS_LABELS[s]}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="sb-btn sb-btn-ghost sb-btn-sm"
                                        onClick={() =>
                                            setExpanded(expanded === inq.id ? null : inq.id)
                                        }
                                    >
                                        {expanded === inq.id ? "Hide" : "View"}
                                    </button>
                                </td>
                            </tr>
                            {expanded === inq.id && (
                                <tr>
                                    <td colSpan={5} style={{ background: "var(--sb-surface-2)" }}>
                                        <p className="text-sm whitespace-pre-wrap mb-3">{inq.message}</p>
                                        {inq.admin_notes && (
                                            <p className="text-xs" style={{ color: "var(--sb-text-muted)" }}>
                                                Notes: {inq.admin_notes}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
            {pending && (
                <div className="sb-loading" style={{ padding: 12 }}>
                    <Loader2 className="w-4 h-4 sb-spin" />
                </div>
            )}
        </div>
    );
}

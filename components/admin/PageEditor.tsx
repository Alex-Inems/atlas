"use client";

import { useState, useTransition } from "react";
import { Loader2, Code2, Save } from "lucide-react";
import { savePageContent } from "@/lib/actions/admin";

const COMPANY_KEYS = [
    "name",
    "legalName",
    "phone",
    "email",
    "headquarters",
    "description",
    "testimonialQuote",
    "testimonialAuthor",
    "testimonialRole",
] as const;

export default function PageEditor({
    slug,
    title,
    initialContent,
}: {
    slug: string;
    title: string;
    initialContent: Record<string, unknown>;
}) {
    const [jsonContent, setJsonContent] = useState(JSON.stringify(initialContent, null, 2));
    const [fields, setFields] = useState({
        label: String(initialContent.label ?? ""),
        title: String(initialContent.title ?? ""),
        description: String(initialContent.description ?? ""),
        number: String(initialContent.number ?? ""),
    });
    const [companyFields, setCompanyFields] = useState<Record<string, string>>(() => {
        const c: Record<string, string> = {};
        for (const key of COMPANY_KEYS) c[key] = String(initialContent[key] ?? "");
        return c;
    });
    const [useJson, setUseJson] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const handleSave = () => {
        setMessage(null);
        setError(null);

        let payload: Record<string, unknown>;
        if (useJson) {
            try {
                payload = JSON.parse(jsonContent);
            } catch {
                setError("Invalid JSON. Check syntax and try again.");
                return;
            }
        } else if (slug === "company") {
            payload = { ...initialContent, ...companyFields };
        } else {
            payload = { ...initialContent, ...fields };
        }

        startTransition(async () => {
            const result = await savePageContent(slug, payload);
            if (result.error) setError(result.error);
            else setMessage(`Row updated. Changes are live on the site.`);
        });
    };

    return (
        <div className="sb-card">
            <div className="sb-card-header">
                <div>
                    <h2 className="sb-card-title">site_pages / {slug}</h2>
                    <p className="sb-cell-mono" style={{ marginTop: 4, fontSize: 11 }}>
                        content jsonb column
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setUseJson(!useJson)}
                    className="sb-btn sb-btn-default sb-btn-sm"
                >
                    <Code2 className="w-3.5 h-3.5" />
                    {useJson ? "Form editor" : "JSON editor"}
                </button>
            </div>

            <div className="sb-card-body-padded">
                {useJson ? (
                    <div className="sb-field">
                        <label className="sb-label">content (jsonb)</label>
                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            rows={20}
                            className="sb-textarea"
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </div>
                ) : slug === "company" ? (
                    <div className="sb-form-grid">
                        {COMPANY_KEYS.map((key) => (
                            <div key={key} className="sb-field">
                                <label className="sb-label">{key}</label>
                                <input
                                    className="sb-input"
                                    value={companyFields[key] ?? ""}
                                    onChange={(e) =>
                                        setCompanyFields((c) => ({ ...c, [key]: e.target.value }))
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="sb-form-grid">
                        <div className="sb-field">
                            <label className="sb-label">number</label>
                            <input
                                className="sb-input"
                                value={fields.number}
                                onChange={(e) => setFields((f) => ({ ...f, number: e.target.value }))}
                            />
                        </div>
                        <div className="sb-field">
                            <label className="sb-label">label</label>
                            <input
                                className="sb-input"
                                value={fields.label}
                                onChange={(e) => setFields((f) => ({ ...f, label: e.target.value }))}
                            />
                        </div>
                        <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                            <label className="sb-label">title</label>
                            <input
                                className="sb-input"
                                value={fields.title}
                                onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
                            />
                        </div>
                        <div className="sb-field" style={{ gridColumn: "1 / -1" }}>
                            <label className="sb-label">description</label>
                            <textarea
                                className="sb-textarea"
                                rows={4}
                                value={fields.description}
                                onChange={(e) =>
                                    setFields((f) => ({ ...f, description: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                )}

                {message && <div className="sb-alert sb-alert-success">{message}</div>}
                {error && <div className="sb-alert sb-alert-error">{error}</div>}

                <div className="flex gap-2 mt-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={pending}
                        className="sb-btn sb-btn-primary"
                    >
                        {pending ? (
                            <Loader2 className="w-3.5 h-3.5 sb-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}

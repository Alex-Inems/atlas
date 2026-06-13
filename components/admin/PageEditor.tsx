"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { savePageContent } from "@/lib/actions/admin";

const inputClass =
    "w-full py-3 px-4 border border-line bg-white focus:border-safety focus:outline-none text-charcoal text-sm";

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
                setError("Invalid JSON. Check syntax.");
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
            else setMessage(`"${title}" saved. Changes are live on the site.`);
        });
    };

    return (
        <div className="bg-white border border-line p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-xl font-black text-charcoal">{title}</h2>
                <button
                    type="button"
                    onClick={() => setUseJson(!useJson)}
                    className="text-[10px] uppercase tracking-widest font-bold text-muted hover:text-charcoal"
                >
                    {useJson ? "Simple fields" : "Advanced JSON"}
                </button>
            </div>

            {useJson ? (
                <textarea
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    rows={18}
                    className={`${inputClass} font-mono text-xs`}
                />
            ) : slug === "company" ? (
                <div className="grid gap-4">
                    {COMPANY_KEYS.map((key) => (
                        <div key={key}>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
                                {key}
                            </label>
                            <input
                                className={inputClass}
                                value={companyFields[key] ?? ""}
                                onChange={(e) =>
                                    setCompanyFields((c) => ({ ...c, [key]: e.target.value }))
                                }
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
                            Section number
                        </label>
                        <input
                            className={inputClass}
                            value={fields.number}
                            onChange={(e) => setFields((f) => ({ ...f, number: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
                            Label
                        </label>
                        <input
                            className={inputClass}
                            value={fields.label}
                            onChange={(e) => setFields((f) => ({ ...f, label: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
                            Title
                        </label>
                        <input
                            className={inputClass}
                            value={fields.title}
                            onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
                            Description
                        </label>
                        <textarea
                            className={`${inputClass} resize-none`}
                            rows={4}
                            value={fields.description}
                            onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
                        />
                    </div>
                </div>
            )}

            {message && <p className="text-sm bg-premium border border-line px-4 py-3">{message}</p>}
            {error && <p className="text-sm bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</p>}

            <button
                type="button"
                onClick={handleSave}
                disabled={pending}
                className="inline-flex items-center gap-2 bg-safety text-white px-8 py-3 text-xs uppercase font-bold tracking-widest disabled:opacity-50"
            >
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save page
            </button>
        </div>
    );
}

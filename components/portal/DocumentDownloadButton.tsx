"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { getDocumentDownloadUrl } from "@/lib/actions/documents";
import { useAlert } from "@/components/alerts/AlertProvider";

export default function DocumentDownloadButton({
    documentId,
    fileName,
}: {
    documentId: string;
    fileName: string;
}) {
    const alert = useAlert();
    const [pending, startTransition] = useTransition();

    return (
        <button
            type="button"
            disabled={pending}
            className="sb-btn sb-btn-ghost sb-btn-sm"
            onClick={() => {
                startTransition(async () => {
                    const result = await getDocumentDownloadUrl(documentId);
                    if (result.error || !result.url) {
                        alert.error("Download failed", result.error ?? "No URL");
                        return;
                    }
                    window.open(result.url, "_blank", "noopener,noreferrer");
                });
            }}
        >
            {pending ? <Loader2 className="w-3 h-3 sb-spin" /> : <Download className="w-3 h-3" />}
            {fileName}
        </button>
    );
}

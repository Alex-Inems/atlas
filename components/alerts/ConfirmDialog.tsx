"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    loading,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "danger";
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;

    return (
        <div className="site-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="site-dialog">
                <div className="site-dialog-header">
                    <h3 id="dialog-title" className="site-dialog-title">
                        {title}
                    </h3>
                    <button type="button" className="site-dialog-close" onClick={onCancel} aria-label="Close">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="site-dialog-body">{description}</div>
                <div className="site-dialog-footer">
                    <button type="button" className="sb-btn sb-btn-default" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`sb-btn ${variant === "danger" ? "sb-btn-danger" : "sb-btn-primary"}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 sb-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

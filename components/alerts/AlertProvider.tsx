"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

export type AlertVariant = "success" | "error" | "info" | "warning";

export interface AlertItem {
    id: string;
    variant: AlertVariant;
    title: string;
    message?: string;
    duration?: number;
}

interface AlertContextValue {
    alerts: AlertItem[];
    push: (alert: Omit<AlertItem, "id">) => string;
    dismiss: (id: string) => void;
    success: (title: string, message?: string) => string;
    error: (title: string, message?: string) => string;
    info: (title: string, message?: string) => string;
    warning: (title: string, message?: string) => string;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const ICONS = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
} as const;

function Toast({ item, onDismiss }: { item: AlertItem; onDismiss: () => void }) {
    const Icon = ICONS[item.variant];

    return (
        <div
            role="alert"
            className={`site-toast site-toast-${item.variant}`}
            data-variant={item.variant}
        >
            <Icon className="site-toast-icon" aria-hidden />
            <div className="site-toast-body">
                <p className="site-toast-title">{item.title}</p>
                {item.message && <p className="site-toast-message">{item.message}</p>}
            </div>
            <button
                type="button"
                className="site-toast-close"
                onClick={onDismiss}
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const push = useCallback(
        (alert: Omit<AlertItem, "id">) => {
            const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const item: AlertItem = { duration: 6000, ...alert, id };
            setAlerts((prev) => [...prev.slice(-4), item]);

            const ms = item.duration ?? 6000;
            if (ms > 0) {
                window.setTimeout(() => dismiss(id), ms);
            }
            return id;
        },
        [dismiss],
    );

    const value = useMemo<AlertContextValue>(
        () => ({
            alerts,
            push,
            dismiss,
            success: (title, message) => push({ variant: "success", title, message }),
            error: (title, message) => push({ variant: "error", title, message, duration: 8000 }),
            info: (title, message) => push({ variant: "info", title, message }),
            warning: (title, message) => push({ variant: "warning", title, message, duration: 7000 }),
        }),
        [alerts, push, dismiss],
    );

    return (
        <AlertContext.Provider value={value}>
            {children}
            <div className="site-toast-stack" aria-live="polite" aria-relevant="additions">
                {alerts.map((item) => (
                    <Toast key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
                ))}
            </div>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert must be used within AlertProvider");
    return ctx;
}

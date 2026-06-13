"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();

    const input =
        "w-full py-4 border-b border-line bg-transparent focus:border-safety focus:outline-none text-charcoal";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const result = await updatePassword(password);
        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }
        setSuccess(true);
    };

    return (
        <div className="bg-white min-h-screen pt-28 pb-16">
            <div className="max-w-md mx-auto px-6">
                <span className="text-safety font-mono text-sm font-bold">Portal</span>
                <h1 className="text-3xl font-black text-charcoal mt-4 mb-2">Set new password</h1>
                <p className="text-muted mb-10">Enter your new password below.</p>

                {success ? (
                    <div className="space-y-6">
                        <p className="text-charcoal bg-premium p-4 border border-line rounded-lg">
                            Password updated successfully.
                        </p>
                        <Link
                            href="/portal"
                            className="inline-block bg-safety text-white px-8 py-3 text-xs uppercase font-bold tracking-widest"
                        >
                            Go to Portal
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-[11px] tracking-[0.18em] uppercase font-bold text-muted mb-2">
                                New password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className={input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] tracking-[0.18em] uppercase font-bold text-muted mb-2">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className={input}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-safety text-white px-10 py-4 text-xs uppercase font-bold tracking-widest disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Update password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { X, Hammer, Mail, Lock, CheckCircle, User, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

type View = "login" | "register" | "forgot";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const inputClass =
    "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-safety focus:ring-1 focus:ring-safety transition-all";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<View>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login, signup, resetPassword, signInWithGoogle } = useAuth();

    if (!isOpen) return null;

    const resetForm = () => {
        setError(null);
        setInfo(null);
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        setEmail("");
        setPassword("");
        setName("");
        setView("login");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);

        if (view === "forgot") {
            const result = await resetPassword(email);
            setLoading(false);
            if (result.error) {
                setError(result.error);
                return;
            }
            setInfo("Check your email for a password reset link.");
            return;
        }

        if (view === "login") {
            const result = await login(email, password);
            setLoading(false);
            if (result.error) {
                setError(result.error);
                return;
            }
            handleClose();
            return;
        }

        const result = await signup(email, password, name);
        setLoading(false);
        if (result.error) {
            setError(result.error);
            return;
        }
        setInfo("Account created. Check your email to confirm, or sign in now.");
        setView("login");
    };

    const handleGoogle = async () => {
        setError(null);
        setLoading(true);
        const result = await signInWithGoogle();
        setLoading(false);
        if (result.error) setError(result.error);
    };

    const titles: Record<View, { heading: string; sub: string }> = {
        login: { heading: "Welcome Back", sub: "Access your project dashboard" },
        register: { heading: "Partner With Us", sub: "Start your construction journey" },
        forgot: { heading: "Reset Password", sub: "We'll send you a reset link" },
    };

    const { heading, sub } = titles[view];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden
            />

            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-charcoal p-8 pb-16 text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6 ring-1 ring-safety/30">
                            <Hammer className="w-8 h-8 text-safety" />
                        </div>
                        <h2 className="text-3xl font-light text-white mb-2">{heading}</h2>
                        <p className="text-white/60">{sub}</p>
                    </div>

                    <div className="absolute inset-0 bg-safety/5 blur-3xl" />
                </div>

                <div className="p-8 -mt-8 relative z-20 bg-white rounded-t-3xl">
                    {view !== "forgot" && (
                        <button
                            type="button"
                            onClick={handleGoogle}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 mb-5 border border-line rounded-lg text-sm font-semibold text-charcoal hover:bg-premium transition-colors disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    )}

                    {view !== "forgot" && (
                        <div className="relative flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-line" />
                            <span className="text-[10px] uppercase tracking-widest text-muted">or</span>
                            <div className="flex-1 h-px bg-line" />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {view === "register" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={inputClass}
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {view !== "forgot" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className={inputClass}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>
                        )}

                        {view === "register" && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-safety shrink-0" />
                                <span>I agree to the Terms of Service</span>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}
                        {info && (
                            <p className="text-sm text-charcoal bg-premium px-3 py-2 rounded-lg border border-line">
                                {info}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-safety text-white font-bold py-4 rounded-lg hover:bg-safety-dim transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {view === "login" && "Sign In"}
                            {view === "register" && "Create Account"}
                            {view === "forgot" && "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
                        {view === "login" && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setView("forgot");
                                    }}
                                    className="block w-full text-muted hover:text-charcoal transition-colors"
                                >
                                    Forgot password?
                                </button>
                                <p>
                                    New to Inema?
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            setView("register");
                                        }}
                                        className="ml-2 text-safety hover:text-safety-dim font-bold"
                                    >
                                        Register Now
                                    </button>
                                </p>
                            </>
                        )}
                        {view === "register" && (
                            <p>
                                Already have an account?
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setView("login");
                                    }}
                                    className="ml-2 text-safety hover:text-safety-dim font-bold"
                                >
                                    Login Here
                                </button>
                            </p>
                        )}
                        {view === "forgot" && (
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setView("login");
                                }}
                                className="text-safety hover:text-safety-dim font-bold"
                            >
                                Back to login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

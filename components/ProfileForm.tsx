"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface ProfileFormProps {
    initialName: string;
    email: string;
}

export default function ProfileForm({ initialName, email }: ProfileFormProps) {
    const { updateProfile, updatePassword, logout } = useAuth();
    const [name, setName] = useState(initialName);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [profileMsg, setProfileMsg] = useState<string | null>(null);
    const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const input =
        "w-full py-4 border-b border-line bg-transparent focus:border-safety focus:outline-none text-charcoal";

    const handleProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileMsg(null);
        setProfileLoading(true);
        const result = await updateProfile(name);
        setProfileLoading(false);
        if (result.error) setProfileError(result.error);
        else setProfileMsg("Profile updated.");
    };

    const handlePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordMsg(null);

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setPasswordLoading(true);
        const result = await updatePassword(password);
        setPasswordLoading(false);
        if (result.error) setPasswordError(result.error);
        else {
            setPasswordMsg("Password updated.");
            setPassword("");
            setConfirm("");
        }
    };

    return (
        <div className="space-y-16">
            <form onSubmit={handleProfile} className="space-y-8">
                <div>
                    <label className="block text-[11px] tracking-[0.18em] uppercase font-bold text-muted mb-2">
                        Email
                    </label>
                    <input type="email" value={email} disabled className={`${input} opacity-50`} />
                </div>
                <div>
                    <label className="block text-[11px] tracking-[0.18em] uppercase font-bold text-muted mb-2">
                        Full name
                    </label>
                    <input
                        type="text"
                        required
                        className={input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {profileError && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{profileError}</p>
                )}
                {profileMsg && (
                    <p className="text-sm text-charcoal bg-premium px-3 py-2 rounded-lg border border-line">
                        {profileMsg}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center gap-2 bg-charcoal text-white px-10 py-4 text-xs uppercase font-bold tracking-widest disabled:opacity-50"
                >
                    {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save profile
                </button>
            </form>

            <form onSubmit={handlePassword} className="space-y-8 pt-8 border-t border-line">
                <h2 className="text-xl font-black text-charcoal">Change password</h2>
                <div>
                    <label className="block text-[11px] tracking-[0.18em] uppercase font-bold text-muted mb-2">
                        New password
                    </label>
                    <input
                        type="password"
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
                        minLength={6}
                        className={input}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>
                {passwordError && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>
                )}
                {passwordMsg && (
                    <p className="text-sm text-charcoal bg-premium px-3 py-2 rounded-lg border border-line">
                        {passwordMsg}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={passwordLoading || !password}
                    className="flex items-center gap-2 border border-line text-charcoal px-10 py-4 text-xs uppercase font-bold tracking-widest disabled:opacity-50"
                >
                    {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update password
                </button>
            </form>

            <div className="pt-8 border-t border-line flex flex-wrap gap-6">
                <Link
                    href="/portal"
                    className="text-[11px] tracking-[0.18em] uppercase font-bold text-safety hover:text-charcoal"
                >
                    ← Back to portal
                </Link>
                <button
                    type="button"
                    onClick={() => logout()}
                    className="text-[11px] tracking-[0.18em] uppercase font-bold text-muted hover:text-charcoal"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

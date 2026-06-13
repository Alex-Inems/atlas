"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateUserRole, updateUserProfileAdmin } from "@/lib/actions/admin";
import type { Profile, UserRole } from "@/lib/types/database";
import { USER_ROLE_LABELS } from "@/lib/types/database";

export default function UserManagementTable({
    users,
    currentUserId,
}: {
    users: Profile[];
    currentUserId: string;
}) {
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRoleChange = (userId: string, role: UserRole) => {
        setMessage(null);
        setError(null);
        startTransition(async () => {
            const reason =
                role === "restricted"
                    ? prompt("Restriction reason (optional):") ?? undefined
                    : undefined;
            const result = await updateUserRole(userId, role, reason);
            if (result.error) setError(result.error);
            else setMessage("User updated.");
        });
    };

    const handleNameSave = (userId: string, fullName: string) => {
        setMessage(null);
        setError(null);
        startTransition(async () => {
            const result = await updateUserProfileAdmin(userId, { full_name: fullName });
            if (result.error) setError(result.error);
            else setMessage("Profile updated.");
        });
    };

    return (
        <div className="space-y-4">
            {message && (
                <p className="text-sm bg-premium border border-line px-4 py-3 text-charcoal">{message}</p>
            )}
            {error && (
                <p className="text-sm bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</p>
            )}

            <div className="bg-white border border-line overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-line text-left text-[10px] tracking-[0.18em] uppercase text-muted">
                            <th className="p-4 font-bold">User</th>
                            <th className="p-4 font-bold">Joined</th>
                            <th className="p-4 font-bold">Role</th>
                            <th className="p-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-line last:border-0">
                                <td className="p-4">
                                    <input
                                        defaultValue={u.full_name ?? ""}
                                        onBlur={(e) => {
                                            if (e.target.value !== (u.full_name ?? "")) {
                                                handleNameSave(u.id, e.target.value);
                                            }
                                        }}
                                        className="block font-semibold text-charcoal bg-transparent border-b border-transparent focus:border-safety focus:outline-none w-full mb-1"
                                    />
                                    <span className="text-muted text-xs">{u.email}</span>
                                    {u.restricted_reason && (
                                        <p className="text-xs text-red-600 mt-1">{u.restricted_reason}</p>
                                    )}
                                </td>
                                <td className="p-4 text-muted whitespace-nowrap">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={u.role}
                                        disabled={pending || u.id === currentUserId}
                                        onChange={(e) =>
                                            handleRoleChange(u.id, e.target.value as UserRole)
                                        }
                                        className="border border-line px-3 py-2 text-charcoal bg-white text-xs uppercase font-bold tracking-wide"
                                    >
                                        {(Object.keys(USER_ROLE_LABELS) as UserRole[]).map((role) => (
                                            <option key={role} value={role}>
                                                {USER_ROLE_LABELS[role]}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {u.role !== "admin" && (
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() => handleRoleChange(u.id, "admin")}
                                                className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-line hover:border-safety"
                                            >
                                                Make admin
                                            </button>
                                        )}
                                        {u.role !== "restricted" && u.id !== currentUserId && (
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() => handleRoleChange(u.id, "restricted")}
                                                className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                Restrict
                                            </button>
                                        )}
                                        {u.role === "restricted" && (
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() => handleRoleChange(u.id, "user")}
                                                className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-line hover:border-safety"
                                            >
                                                Restore access
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pending && (
                <p className="flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </p>
            )}
        </div>
    );
}

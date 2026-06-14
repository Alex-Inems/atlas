"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import { updateUserRole, updateUserProfileAdmin } from "@/lib/actions/admin";
import type { Profile, UserRole } from "@/lib/types/database";
import { USER_ROLE_LABELS } from "@/lib/types/database";

function roleBadgeClass(role: UserRole) {
    if (role === "admin") return "sb-badge sb-badge-brand";
    if (role === "restricted") return "sb-badge sb-badge-danger";
    return "sb-badge sb-badge-neutral";
}

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
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.email?.toLowerCase().includes(q) ||
                u.full_name?.toLowerCase().includes(q) ||
                u.id.toLowerCase().includes(q),
        );
    }, [users, query]);

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
            else setMessage("User updated successfully.");
        });
    };

    const handleNameSave = (userId: string, fullName: string) => {
        setMessage(null);
        setError(null);
        startTransition(async () => {
            const result = await updateUserProfileAdmin(userId, { full_name: fullName });
            if (result.error) setError(result.error);
            else setMessage("Profile updated successfully.");
        });
    };

    return (
        <div>
            {message && <div className="sb-alert sb-alert-success">{message}</div>}
            {error && <div className="sb-alert sb-alert-error">{error}</div>}

            <div className="sb-card">
                <div className="sb-card-header">
                    <div className="sb-search">
                        <Search className="sb-search-icon" />
                        <input
                            type="search"
                            className="sb-input"
                            placeholder="Search email, name, or user id…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <span className="sb-badge sb-badge-neutral">{filtered.length} users</span>
                </div>

                <div className="sb-table-wrap">
                    <table className="sb-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>User UID</th>
                                <th>Created</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="sb-empty">No users match your search.</div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <input
                                                defaultValue={u.full_name ?? ""}
                                                placeholder="Display name"
                                                onBlur={(e) => {
                                                    if (e.target.value !== (u.full_name ?? "")) {
                                                        handleNameSave(u.id, e.target.value);
                                                    }
                                                }}
                                                className="sb-input sb-cell-primary"
                                                style={{ maxWidth: 200, marginBottom: 4 }}
                                            />
                                            <div className="sb-cell-mono">{u.email ?? "—"}</div>
                                            {u.restricted_reason && (
                                                <div
                                                    className="text-xs mt-1"
                                                    style={{ color: "var(--sb-danger)" }}
                                                >
                                                    {u.restricted_reason}
                                                </div>
                                            )}
                                        </td>
                                        <td className="sb-cell-mono">{u.id.slice(0, 8)}…</td>
                                        <td className="sb-cell-mono">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={roleBadgeClass(u.role)}>
                                                {USER_ROLE_LABELS[u.role]}
                                            </span>
                                            <select
                                                value={u.role}
                                                disabled={pending || u.id === currentUserId}
                                                onChange={(e) =>
                                                    handleRoleChange(u.id, e.target.value as UserRole)
                                                }
                                                className="sb-select mt-2"
                                                style={{ maxWidth: 140 }}
                                            >
                                                {(Object.keys(USER_ROLE_LABELS) as UserRole[]).map(
                                                    (role) => (
                                                        <option key={role} value={role}>
                                                            {USER_ROLE_LABELS[role]}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                {u.role !== "admin" && (
                                                    <button
                                                        type="button"
                                                        disabled={pending}
                                                        onClick={() => handleRoleChange(u.id, "admin")}
                                                        className="sb-btn sb-btn-primary sb-btn-sm"
                                                    >
                                                        <UserPlus className="w-3 h-3" />
                                                        Make admin
                                                    </button>
                                                )}
                                                {u.role !== "restricted" && u.id !== currentUserId && (
                                                    <button
                                                        type="button"
                                                        disabled={pending}
                                                        onClick={() =>
                                                            handleRoleChange(u.id, "restricted")
                                                        }
                                                        className="sb-btn sb-btn-danger sb-btn-sm"
                                                    >
                                                        Restrict
                                                    </button>
                                                )}
                                                {u.role === "restricted" && (
                                                    <button
                                                        type="button"
                                                        disabled={pending}
                                                        onClick={() => handleRoleChange(u.id, "user")}
                                                        className="sb-btn sb-btn-default sb-btn-sm"
                                                    >
                                                        Restore
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pending && (
                <div className="sb-loading">
                    <Loader2 className="w-4 h-4 sb-spin" />
                    Saving changes…
                </div>
            )}
        </div>
    );
}

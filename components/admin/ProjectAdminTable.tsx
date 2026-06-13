"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
    createClientProject,
    updateClientProject,
    deleteClientProject,
} from "@/lib/actions/admin";
import type { ClientProject, Profile, ProjectStatus } from "@/lib/types/database";
import { PROJECT_STATUS_LABELS } from "@/lib/types/database";

export default function ProjectAdminTable({
    projects,
    users,
}: {
    projects: (ClientProject & { profiles?: { email: string | null; full_name: string | null } })[];
    users: Profile[];
}) {
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        user_id: users[0]?.id ?? "",
        title: "",
        location: "",
        status: "planning" as ProjectStatus,
        phase: "",
    });

    const run = (fn: () => Promise<{ error: string | null }>) => {
        setMessage(null);
        setError(null);
        startTransition(async () => {
            const result = await fn();
            if (result.error) setError(result.error);
            else setMessage("Saved.");
        });
    };

    return (
        <div className="space-y-6">
            {message && <p className="text-sm bg-premium border border-line px-4 py-3">{message}</p>}
            {error && <p className="text-sm bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</p>}

            <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="bg-charcoal text-white px-6 py-3 text-xs uppercase font-bold tracking-widest"
            >
                {showForm ? "Cancel" : "Add project"}
            </button>

            {showForm && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        run(() => createClientProject(form));
                    }}
                    className="bg-white border border-line p-6 grid md:grid-cols-2 gap-4"
                >
                    <select
                        required
                        value={form.user_id}
                        onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
                        className="border border-line px-3 py-2 text-sm"
                    >
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.full_name ?? u.email}
                            </option>
                        ))}
                    </select>
                    <input
                        required
                        placeholder="Project title"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="border border-line px-3 py-2 text-sm"
                    />
                    <input
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="border border-line px-3 py-2 text-sm"
                    />
                    <input
                        placeholder="Phase e.g. Construction"
                        value={form.phase}
                        onChange={(e) => setForm((f) => ({ ...f, phase: e.target.value }))}
                        className="border border-line px-3 py-2 text-sm"
                    />
                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))
                        }
                        className="border border-line px-3 py-2 text-sm"
                    >
                        {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                            <option key={s} value={s}>
                                {PROJECT_STATUS_LABELS[s]}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={pending}
                        className="bg-safety text-white py-2 text-xs uppercase font-bold tracking-widest"
                    >
                        Create
                    </button>
                </form>
            )}

            <div className="bg-white border border-line overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-line text-left text-[10px] tracking-[0.18em] uppercase text-muted">
                            <th className="p-4 font-bold">Project</th>
                            <th className="p-4 font-bold">Client</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p) => {
                            const client = users.find((u) => u.id === p.user_id);
                            return (
                                <tr key={p.id} className="border-b border-line last:border-0">
                                    <td className="p-4">
                                        <p className="font-semibold text-charcoal">{p.title}</p>
                                        <p className="text-xs text-muted">{p.location}</p>
                                        <p className="text-xs text-muted">{p.phase}</p>
                                    </td>
                                    <td className="p-4 text-muted text-xs">
                                        {client?.full_name ?? client?.email ?? p.user_id.slice(0, 8)}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            defaultValue={p.status}
                                            disabled={pending}
                                            onChange={(e) =>
                                                run(() =>
                                                    updateClientProject(p.id, {
                                                        status: e.target.value as ProjectStatus,
                                                    }),
                                                )
                                            }
                                            className="border border-line px-2 py-1 text-xs uppercase font-bold"
                                        >
                                            {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map(
                                                (s) => (
                                                    <option key={s} value={s}>
                                                        {PROJECT_STATUS_LABELS[s]}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            defaultValue={p.user_id}
                                            disabled={pending}
                                            onChange={(e) =>
                                                run(() =>
                                                    updateClientProject(p.id, { user_id: e.target.value }),
                                                )
                                            }
                                            className="border border-line px-2 py-1 text-xs mb-2 block w-full max-w-[180px]"
                                        >
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.full_name ?? u.email}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            disabled={pending}
                                            onClick={() => {
                                                if (confirm("Delete this project?")) {
                                                    run(() => deleteClientProject(p.id));
                                                }
                                            }}
                                            className="text-[10px] uppercase tracking-widest font-bold text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

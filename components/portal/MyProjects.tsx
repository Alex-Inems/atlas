import Link from "next/link";
import { PROJECT_STATUS_LABELS, type ClientProject } from "@/lib/types/database";

function statusBadge(status: ClientProject["status"]) {
    if (status === "completed") return "sb-badge sb-badge-brand";
    if (status === "in_progress") return "sb-badge sb-badge-warning";
    return "sb-badge sb-badge-neutral";
}

export default function MyProjects({ projects }: { projects: ClientProject[] }) {
    if (!projects.length) {
        return (
            <div className="sb-card" style={{ marginTop: 32 }}>
                <div className="sb-empty">
                    No active projects yet. Once your site visit is confirmed, your project workspace
                    will appear here.
                </div>
            </div>
        );
    }

    return (
        <div className="sb-card" style={{ marginTop: 32 }}>
            <div className="sb-card-header">
                <h2 className="sb-card-title">My projects</h2>
                <span className="sb-badge sb-badge-neutral">{projects.length}</span>
            </div>
            <ul className="sb-list">
                {projects.map((p) => (
                    <li key={p.id} className="sb-list-item">
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={statusBadge(p.status)}>
                                    {PROJECT_STATUS_LABELS[p.status]}
                                </span>
                                {p.phase && (
                                    <span className="sb-list-item-meta">{p.phase}</span>
                                )}
                            </div>
                            <p className="sb-list-item-title">{p.title}</p>
                            {p.location && <p className="sb-list-item-meta">{p.location}</p>}
                        </div>
                        <Link href={`/portal/projects/${p.id}`} className="sb-btn sb-btn-default sb-btn-sm">
                            Open →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

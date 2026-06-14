import Link from "next/link";
import DocumentDownloadButton from "@/components/portal/DocumentDownloadButton";
import {
    PROJECT_STATUS_LABELS,
    type ClientProject,
    type ProjectDocument,
    type ProjectEvent,
} from "@/lib/types/database";

export default function ProjectDetailView({
    project,
    documents,
    events,
}: {
    project: ClientProject;
    documents: ProjectDocument[];
    events: ProjectEvent[];
}) {
    return (
        <div className="space-y-6">
            <Link href="/portal/projects" className="sb-btn sb-btn-ghost sb-btn-sm">
                ← All projects
            </Link>

            <div className="sb-card">
                <div className="sb-card-header">
                    <div>
                        <h2 className="sb-card-title">{project.title}</h2>
                        {project.location && (
                            <p className="sb-list-item-meta">{project.location}</p>
                        )}
                    </div>
                    <span className="sb-badge sb-badge-brand">
                        {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                </div>
                <div className="sb-card-body-padded">
                    {project.phase && (
                        <p className="text-sm mb-4">
                            <span className="sb-label">Current phase: </span>
                            {project.phase}
                        </p>
                    )}
                    <p className="sb-list-item-meta">
                        Last updated {new Date(project.updated_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="sb-card">
                <div className="sb-card-header">
                    <h3 className="sb-card-title">Documents</h3>
                    <span className="sb-badge sb-badge-neutral">{documents.length}</span>
                </div>
                {documents.length ? (
                    <ul className="sb-list">
                        {documents.map((d) => (
                            <li key={d.id} className="sb-list-item" style={{ cursor: "default" }}>
                                <DocumentDownloadButton documentId={d.id} fileName={d.file_name} />
                                <span className="sb-list-item-meta">
                                    {new Date(d.created_at).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="sb-empty">No documents uploaded yet.</div>
                )}
            </div>

            {events.length > 0 && (
                <div className="sb-card">
                    <div className="sb-card-header">
                        <h3 className="sb-card-title">Activity</h3>
                    </div>
                    <ul className="sb-list">
                        {events.map((e) => (
                            <li key={e.id} className="sb-list-item" style={{ cursor: "default" }}>
                                <div>
                                    <p className="sb-list-item-title">{e.message}</p>
                                    <p className="sb-list-item-meta">
                                        {new Date(e.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

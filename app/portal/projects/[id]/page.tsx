import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppPageHero from "@/components/portal/AppPageHero";
import ProjectDetailView from "@/components/portal/ProjectDetailView";
import { requireAuth } from "@/lib/admin/auth";
import type { ClientProject, ProjectDocument, ProjectEvent } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Project | Inema",
    robots: { index: false, follow: false },
};

export default async function PortalProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { supabase, user } = await requireAuth();

    const { data: project } = await supabase
        .from("client_projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!project) notFound();

    const [{ data: documents }, { data: events }] = await Promise.all([
        supabase
            .from("project_documents")
            .select("*")
            .eq("project_id", id)
            .order("created_at", { ascending: false }),
        supabase
            .from("project_events")
            .select("*")
            .eq("project_id", id)
            .order("created_at", { ascending: false }),
    ]);

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Project"
                title={(project as ClientProject).title}
                description={(project as ClientProject).location ?? ""}
            />
            <div className="sb-content-wrap-narrow">
                <ProjectDetailView
                    project={project as ClientProject}
                    documents={(documents as ProjectDocument[]) ?? []}
                    events={(events as ProjectEvent[]) ?? []}
                />
            </div>
        </div>
    );
}

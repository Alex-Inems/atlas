import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_STATUS_LABELS, type ClientProject } from "@/lib/types/database";

export const metadata: Metadata = {
    title: "Portal | Atlas Build",
    robots: { index: false, follow: false },
};

const statusColor: Record<ClientProject["status"], string> = {
    planning: "text-muted border-line",
    in_progress: "text-safety border-safety/30",
    review: "text-charcoal border-charcoal/20",
    completed: "text-charcoal border-charcoal bg-premium",
};

export default async function PortalPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/?login=1");

    const { data: projects } = await supabase
        .from("client_projects")
        .select("*")
        .order("updated_at", { ascending: false });

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="—"
                label="Client portal"
                title="Your projects"
                description="Track active builds, phases, and status updates from your Atlas project team."
            />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-sm text-muted">
                            Signed in as{" "}
                            <span className="font-semibold text-charcoal">{user.email}</span>
                        </p>
                        <Link
                            href="/profile"
                            className="text-[11px] tracking-[0.18em] uppercase font-bold text-safety hover:text-charcoal transition-colors"
                        >
                            Account settings →
                        </Link>
                    </div>

                    {!projects?.length ? (
                        <div className="border border-line bg-premium p-12 md:p-16 text-center">
                            <p className="text-2xl font-black text-charcoal mb-3">No projects yet</p>
                            <p className="text-muted max-w-md mx-auto">
                                Your Atlas project manager will add your active builds here. Need
                                help?{" "}
                                <Link href="/contact" className="text-safety font-semibold">
                                    Contact us
                                </Link>
                                .
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-px bg-line">
                            {projects.map((project) => (
                                <article
                                    key={project.id}
                                    className="bg-white p-8 md:p-10 hover:bg-premium transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <span
                                            className={`text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 border ${statusColor[project.status as ClientProject["status"]]}`}
                                        >
                                            {PROJECT_STATUS_LABELS[project.status as ClientProject["status"]]}
                                        </span>
                                        {project.phase && (
                                            <span className="text-[10px] tracking-[0.18em] uppercase text-muted font-bold">
                                                {project.phase}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-black text-charcoal mb-2">
                                        {project.title}
                                    </h2>
                                    {project.location && (
                                        <p className="text-sm text-muted mb-4">{project.location}</p>
                                    )}
                                    <p className="text-[10px] text-muted/60 tracking-wide">
                                        Updated{" "}
                                        {new Date(project.updated_at).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

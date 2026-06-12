import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import { landmarkProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata("projects");

export default function ProjectsPage() {
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="01"
                label="Portfolio"
                title="Landmark deliveries"
                description="Real completions with verified architects, contractors, heights, and dates — the global standard we build toward."
            />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-24">
                    {landmarkProjects.map((p, i) => (
                        <article
                            key={p.id}
                            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
                        >
                            <div className={`relative aspect-[4/3] overflow-hidden bg-charcoal ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                                <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute top-4 left-4 bg-safety text-white px-3 py-1 text-[10px] tracking-widest uppercase font-bold">
                                    {p.year}
                                </div>
                            </div>
                            <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                                <p className="text-safety text-[11px] tracking-[0.22em] uppercase font-bold">{p.location}</p>
                                <h2 className="text-3xl md:text-4xl font-black text-charcoal mt-3 mb-4 leading-tight">{p.title}</h2>
                                <p className="text-muted leading-relaxed mb-8">{p.description}</p>
                                <dl className="grid grid-cols-2 gap-4 text-sm border-t border-line pt-8">
                                    <div><dt className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Architect</dt><dd className="text-charcoal">{p.architect}</dd></div>
                                    <div><dt className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Builder</dt><dd className="text-charcoal">{p.builder}</dd></div>
                                    <div><dt className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Height</dt><dd className="text-charcoal">{p.height}</dd></div>
                                    <div><dt className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Scale</dt><dd className="text-charcoal">{p.area}</dd></div>
                                </dl>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="py-16 bg-premium border-y border-line">
                <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
                    <p className="text-muted text-sm max-w-xl mx-auto">
                        Project data sourced from architect press releases, Dezeen, SOM, BLS-adjacent industry reporting, and developer announcements.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 mt-8 text-safety text-[11px] tracking-[0.2em] uppercase font-bold hover:text-charcoal transition-colors">
                        Discuss your project <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <PageCTA title="Your project. Same rigor." />
        </div>
    );
}

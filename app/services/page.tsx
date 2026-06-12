import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import { services } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata("services");

export default function ServicesPage() {
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="02"
                label="Capabilities"
                title="What we deliver"
                description="Six integrated disciplines — from pre-construction through certificate of occupancy."
            />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    {services.map((s, i) => (
                        <div key={s.num} className={`grid lg:grid-cols-12 gap-8 py-16 border-b border-line ${i === 0 ? "border-t" : ""}`}>
                            <div className="lg:col-span-2">
                                <span className="text-5xl font-black font-mono text-charcoal/10">{s.num}</span>
                            </div>
                            <div className="lg:col-span-4">
                                <h2 className="text-2xl md:text-3xl font-black text-charcoal">{s.title}</h2>
                            </div>
                            <div className="lg:col-span-6">
                                <p className="text-muted leading-relaxed mb-6">{s.description}</p>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {s.capabilities.map(c => (
                                        <li key={c} className="flex items-center gap-2 text-sm text-charcoal">
                                            <span className="w-1.5 h-1.5 bg-safety shrink-0" />{c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-charcoal text-white">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-12 text-center">
                    {[
                        { val: "74%", label: "US contractors using BIM", src: "PlanRadar / NIBS" },
                        { val: "15–30%", label: "Schedule savings via design-build", src: "DBIA" },
                        { val: "70%", label: "Project cost set in pre-construction", src: "Industry standard" },
                    ].map(item => (
                        <div key={item.label}>
                            <div className="text-4xl font-black font-mono text-safety">{item.val}</div>
                            <p className="text-sm mt-3">{item.label}</p>
                            <p className="text-[10px] text-white/30 mt-2">{item.src}</p>
                        </div>
                    ))}
                </div>
            </section>

            <PageCTA />
        </div>
    );
}

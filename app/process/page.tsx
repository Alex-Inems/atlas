import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import { processSteps } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata("process");

const phaseImages = [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
];

export default function ProcessPage() {
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="03"
                label="Method"
                title="The Atlas method"
                description="Five gated phases. Every deliverable documented. BIM coordination from design development onward."
            />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-32">
                    {processSteps.map((step, i) => (
                        <div key={step.num} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                <span className="text-safety font-mono text-sm font-bold">{step.num}</span>
                                <h2 className="text-3xl md:text-4xl font-black text-charcoal mt-4 mb-6">{step.title}</h2>
                                <p className="text-muted leading-relaxed text-lg mb-8">{step.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {step.deliverables.map(d => (
                                        <span key={d} className="text-xs px-4 py-2 border border-line text-charcoal font-medium">{d}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={`aspect-[4/3] overflow-hidden bg-premium ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                <img src={phaseImages[i]} alt={step.title} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-premium border-y border-line">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-black text-charcoal mb-4">BIM from LOD 300+</h2>
                    <p className="text-muted leading-relaxed">
                        74% of US contractors and 70% of architects now use BIM on billable work. We coordinate MEP clashes
                        in-model before they become field RFIs — the US BIM market is projected to reach $7.69B by 2034.
                    </p>
                    <p className="text-[10px] text-muted/60 mt-4">Sources: PlanRadar, Precedence Research</p>
                </div>
            </section>

            <PageCTA title="Let's define phase one." />
        </div>
    );
}

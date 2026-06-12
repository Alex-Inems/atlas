import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import { leadership, companyInfo } from "@/lib/data";

export const metadata: Metadata = {
    title: "Team | Atlas Build",
    description: "Atlas Build leadership and operations — PT Atlas Jaya Konstruksi, Jakarta.",
};

export default function TeamPage() {
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="05"
                label="People"
                title="Built by specialists"
                description={`${companyInfo.legalName} — founded ${companyInfo.founded}, drawing on construction industry heritage dating to the 1940s.`}
            />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16">
                    {leadership.map((member, i) => (
                        <div key={member.name} className="border-t-2 border-charcoal pt-8">
                            <span className="text-safety font-mono text-xs font-bold">0{i + 1}</span>
                            <h2 className="text-2xl font-black text-charcoal mt-4">{member.name}</h2>
                            <p className="text-safety text-[11px] tracking-[0.2em] uppercase font-bold mt-2">{member.role}</p>
                            <p className="text-muted mt-4 leading-relaxed">{member.note}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-charcoal text-white">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-12">
                    {[
                        { title: "Integrity", desc: "Transparent pricing, documented change orders, and weekly owner reporting on every active site." },
                        { title: "Precision", desc: "Millimeter tolerances on structural steel, post-tension slabs, and curtain wall alignment." },
                        { title: "Safety", desc: "OSHA-aligned protocols. Daily stand-downs. Fall protection on every elevation above 6 feet." },
                    ].map(v => (
                        <div key={v.title}>
                            <h3 className="text-xl font-black text-safety mb-4">{v.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <PageCTA title="Join a project team." description={`${companyInfo.email} · ${companyInfo.phone}`} />
        </div>
    );
}

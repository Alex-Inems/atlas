"use client";

import { leadership, companyInfo } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const Team = () => (
    <section id="about" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Reveal className="mb-16">
                <SectionHeader
                    number="05"
                    label="People"
                    title={companyInfo.name}
                    description={`${companyInfo.legalName} · Est. ${companyInfo.founded} · ${companyInfo.employees} professionals · ${companyInfo.headquarters}`}
                />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
                {leadership.map((member, i) => (
                    <Reveal key={member.name} delay={i * 0.08}>
                        <div className="bg-premium p-8 md:p-10 h-full hover:bg-charcoal hover:text-white group transition-colors duration-400">
                            <div className="w-10 h-10 bg-safety/10 group-hover:bg-safety/20 flex items-center justify-center mb-6">
                                <span className="text-safety font-mono text-xs font-bold">0{i + 1}</span>
                            </div>
                            <h3 className="text-lg font-black text-charcoal group-hover:text-white transition-colors">{member.name}</h3>
                            <p className="text-safety text-[10px] tracking-[0.2em] uppercase font-bold mt-2">{member.role}</p>
                            <p className="text-muted group-hover:text-white/40 text-sm mt-4 leading-relaxed transition-colors">{member.note}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Team;

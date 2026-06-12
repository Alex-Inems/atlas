"use client";

import Link from "next/link";
import { services } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const Services = () => (
    <section id="services" className="py-24 md:py-32 bg-premium border-y border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Reveal className="mb-16">
                <SectionHeader number="02" label="Capabilities" title="Full-spectrum delivery" description="Six core disciplines aligned with AIA general contracting and design-build standards." />
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
                {services.map((s, i) => (
                    <Reveal key={s.num} delay={i * 0.05}>
                        <Link href="/services" className="group block bg-white p-8 md:p-10 h-full hover:bg-charcoal transition-colors duration-400">
                            <span className="text-safety font-mono text-xs font-bold">{s.num}</span>
                            <h3 className="text-xl font-black text-charcoal group-hover:text-white mt-4 mb-3 transition-colors">{s.title}</h3>
                            <p className="text-muted group-hover:text-white/50 text-sm leading-relaxed transition-colors">{s.description}</p>
                            <ul className="mt-6 space-y-2">
                                {s.capabilities.slice(0, 3).map(c => (
                                    <li key={c} className="text-[11px] text-muted group-hover:text-white/40 flex items-center gap-2 transition-colors">
                                        <span className="w-1 h-1 bg-safety shrink-0" />{c}
                                    </li>
                                ))}
                            </ul>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Services;

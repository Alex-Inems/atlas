"use client";

import { industryStats } from "@/lib/data";
import Reveal from "./Reveal";

const Stats = () => (
    <section className="bg-charcoal text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Reveal>
                <p className="text-safety text-[11px] tracking-[0.28em] uppercase font-bold mb-12">Industry context</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                {industryStats.map((s, i) => (
                    <Reveal key={s.label} delay={i * 0.08}>
                        <div className="bg-charcoal p-8 md:p-10 h-full">
                            <div className="text-4xl md:text-5xl font-black font-mono text-safety tracking-tight">{s.value}</div>
                            <p className="text-sm font-semibold text-white mt-3">{s.label}</p>
                            <p className="text-[10px] text-white/30 mt-2 tracking-wide">{s.source}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Stats;

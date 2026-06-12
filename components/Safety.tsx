"use client";

import { safetyStats } from "@/lib/data";
import Reveal from "./Reveal";

const Safety = () => (
    <section id="safety" className="py-24 md:py-32 bg-premium border-y border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <Reveal>
                    <span className="text-safety font-mono text-sm font-bold">04</span>
                    <h2 className="text-3xl md:text-5xl font-black text-charcoal leading-[1.05] mt-4 mb-6">
                        Safety is measured.<br />
                        <span className="text-safety">Not assumed.</span>
                    </h2>
                    <p className="text-muted leading-relaxed max-w-md">
                        Construction recorded 1,075 US fatalities in 2023 — the highest of any sector. We run daily stand-downs,
                        fall-protection programs, and OSHA-aligned site protocols on every active job.
                    </p>
                    <p className="text-[10px] text-muted/60 mt-6">Source: BLS Census of Fatal Occupational Injuries, 2023</p>
                </Reveal>
                <div className="grid sm:grid-cols-2 gap-px bg-line">
                    {safetyStats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08}>
                            <div className="bg-white p-8">
                                <div className="text-3xl font-black font-mono text-safety">
                                    {s.value}{s.unit && <span className="text-lg text-charcoal">{s.unit}</span>}
                                </div>
                                <p className="text-sm font-semibold text-charcoal mt-2">{s.label}</p>
                                <p className="text-[10px] text-muted mt-2 leading-relaxed">{s.note}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default Safety;

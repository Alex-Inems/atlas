"use client";

import Link from "next/link";
import { processSteps } from "@/lib/data";
import { useSelectableIndex } from "@/hooks/useSelectableIndex";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const ProcessTimeline = () => {
    const { index: active, select } = useSelectableIndex({
        count: processSteps.length,
        enableKeyboard: true,
    });

    const step = processSteps[active];

    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <Reveal className="mb-16">
                    <SectionHeader
                        number="03"
                        label="Method"
                        title="Five phases. Zero surprises."
                        description="From feasibility through certificate of occupancy — every gate documented."
                    />
                </Reveal>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-5 space-y-1">
                        <div role="group" aria-label="Process phases">
                            {processSteps.map((s, i) => {
                                const isActive = active === i;
                                return (
                                    <button
                                        key={s.num}
                                        type="button"
                                        onClick={() => select(i)}
                                        className={`w-full text-left p-5 border-l-2 transition-all ${
                                            isActive
                                                ? "border-safety bg-premium"
                                                : "border-transparent hover:border-charcoal/20"
                                        }`}
                                    >
                                        <span
                                            className={`font-mono text-xs font-bold ${
                                                isActive ? "text-safety" : "text-charcoal/20"
                                            }`}
                                        >
                                            {s.num}
                                        </span>
                                        <span
                                            className={`block text-base font-bold mt-1 ${
                                                isActive ? "text-charcoal" : "text-muted"
                                            }`}
                                        >
                                            {s.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <Link
                            href="/process"
                            className="inline-block mt-6 text-[11px] tracking-[0.2em] uppercase font-bold text-safety hover:text-charcoal transition-colors"
                        >
                            Full process →
                        </Link>
                    </div>

                    <Reveal className="lg:col-span-7">
                        <div className="bg-charcoal text-white p-10 md:p-14 min-h-[360px] flex flex-col justify-between">
                            <div>
                                <span className="text-safety font-mono text-sm font-bold">{step.num}</span>
                                <h3 className="text-3xl font-black mt-4 mb-6">{step.title}</h3>
                                <p className="text-white/50 leading-relaxed">{step.description}</p>
                            </div>
                            <div className="mt-10 pt-8 border-t border-white/10">
                                <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-bold mb-4">
                                    Deliverables
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {step.deliverables.map((d) => (
                                        <span
                                            key={d}
                                            className="text-xs px-3 py-1.5 border border-white/15 text-white/70"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;

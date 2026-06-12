"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { landmarkProjects } from "@/lib/data";
import { createFacetedCollection } from "@/lib/filters/faceted";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { MOTION } from "@/lib/motion/tokens";

const categories = ["all", "commercial"] as const;
type CategoryFilter = (typeof categories)[number];

const projectCollection = createFacetedCollection(landmarkProjects, [
    {
        key: "category",
        accessor: (p) => p.category,
        options: ["commercial"],
    },
]);

const ProjectsGallery = () => {
    const [filter, setFilter] = useState<CategoryFilter>("all");

    const featured = projectCollection.all[0];
    const list = projectCollection.all
        .slice(1)
        .filter((p) => filter === "all" || p.category === filter);

    return (
        <section id="projects" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <Reveal>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                        <SectionHeader
                            number="01"
                            label="Landmark delivery"
                            title="Projects shaping skylines"
                            description="Verified completions from the global portfolio we benchmark against — real architects, heights, and delivery dates."
                        />
                        <div className="flex gap-2">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setFilter(c)}
                                    className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase font-bold transition-colors ${
                                        filter === c
                                            ? "bg-charcoal text-white"
                                            : "text-muted hover:text-charcoal"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal>
                    <Link href="/projects" className="group grid lg:grid-cols-2 bg-charcoal overflow-hidden mb-8">
                        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="p-10 md:p-14 flex flex-col justify-between text-white">
                            <div>
                                <span className="text-safety text-[11px] tracking-[0.22em] uppercase font-bold">
                                    {featured.year} · {featured.location}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black mt-4 mb-4 leading-tight">
                                    {featured.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">{featured.description}</p>
                            </div>
                            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-white/30 block mb-1">Architect</span>
                                    {featured.architect}
                                </div>
                                <div>
                                    <span className="text-white/30 block mb-1">Height</span>
                                    {featured.height}
                                </div>
                                <div>
                                    <span className="text-white/30 block mb-1">Builder</span>
                                    {featured.builder}
                                </div>
                                <div>
                                    <span className="text-white/30 block mb-1">Area</span>
                                    {featured.area}
                                </div>
                            </div>
                        </div>
                    </Link>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-px bg-line">
                    {list.slice(0, 4).map((p, i) => (
                        <Reveal key={p.id} delay={i * MOTION.stagger.revealDefault * 0.75}>
                            <Link
                                href="/projects"
                                className="group flex gap-0 bg-premium hover:bg-white transition-colors"
                            >
                                <div className="w-32 md:w-40 shrink-0 overflow-hidden">
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="w-full h-full min-h-[140px] object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex flex-col justify-center min-w-0 flex-1">
                                    <span className="text-[10px] tracking-[0.2em] uppercase text-safety font-bold">
                                        {p.year}
                                    </span>
                                    <h3 className="text-lg font-bold text-charcoal mt-1 truncate">{p.title}</h3>
                                    <p className="text-xs text-muted mt-1">
                                        {p.location} · {p.height}
                                    </p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-safety self-center mr-6 shrink-0 transition-colors" />
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsGallery;

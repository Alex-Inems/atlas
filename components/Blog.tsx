"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const Blog = () => (
    <section id="blog" className="py-24 md:py-32 bg-premium border-t border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <SectionHeader number="06" label="Intelligence" title="Industry signals" description="Facts from BLS, OSHA, and market research — not opinion." />
                <Link href="/blog" className="text-[11px] tracking-[0.2em] uppercase font-bold text-charcoal hover:text-safety flex items-center gap-2 shrink-0">
                    All articles <ArrowUpRight className="w-4 h-4" />
                </Link>
            </Reveal>
            <div className="divide-y divide-line border-y border-line bg-white">
                {blogPosts.slice(0, 4).map((post, i) => (
                    <Reveal key={post.title} delay={i * 0.05}>
                        <Link href="/blog" className="group grid md:grid-cols-[100px_1fr_auto] gap-6 p-6 md:p-8 hover:bg-premium transition-colors items-center">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-safety font-bold">{post.category}</span>
                            <div>
                                <h3 className="text-lg font-bold text-charcoal group-hover:text-safety transition-colors">{post.title}</h3>
                                <p className="text-sm text-muted mt-2 line-clamp-1">{post.excerpt}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-muted">{post.date}</p>
                                <p className="text-[10px] text-muted/60 mt-1">{post.source}</p>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Blog;

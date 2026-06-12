"use client";

import { testimonial } from "@/lib/data";
import Reveal from "./Reveal";

const Testimonial = () => (
    <section className="py-24 md:py-32 bg-charcoal text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Reveal>
                <div className="relative">
                    <span className="absolute -top-8 -left-2 text-[12rem] font-black text-white/[0.03] leading-none select-none pointer-events-none">&ldquo;</span>
                    <blockquote className="text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight max-w-4xl relative z-10">
                        {testimonial.quote}
                    </blockquote>
                    <footer className="mt-12 flex items-center gap-5">
                        <div className="w-12 h-12 bg-safety flex items-center justify-center font-black text-sm">
                            {testimonial.author.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <p className="font-bold">{testimonial.author}</p>
                            <p className="text-white/40 text-sm">{testimonial.role}</p>
                        </div>
                    </footer>
                </div>
            </Reveal>
        </div>
    </section>
);

export default Testimonial;

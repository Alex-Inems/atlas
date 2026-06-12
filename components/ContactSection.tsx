"use client";

import { useState } from "react";
import { companyInfo } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const ContactSection = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const input = "w-full py-4 border-0 border-b border-line bg-transparent focus:border-safety focus:outline-none text-charcoal text-sm placeholder:text-muted/40";

    return (
        <section id="contact" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                    <Reveal>
                        <SectionHeader number="07" label="Contact" title="Start your project" description="We respond within one business day." />
                        <div className="mt-12 space-y-8">
                            {[
                                { label: "Headquarters", value: companyInfo.headquarters },
                                { label: "Email", value: companyInfo.email },
                                { label: "Phone", value: companyInfo.phone },
                                { label: "Entity", value: companyInfo.legalName },
                            ].map(item => (
                                <div key={item.label}>
                                    <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-bold mb-1">{item.label}</p>
                                    <p className="text-charcoal text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <form
                            onSubmit={e => { e.preventDefault(); alert("Thank you — we'll be in touch."); }}
                            className="space-y-8"
                        >
                            <input type="text" placeholder="Name *" required className={input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            <input type="email" placeholder="Email *" required className={input} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                            <textarea placeholder="Project scope, location, timeline *" required rows={5} className={`${input} resize-none`} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                            <button type="submit" className="bg-safety text-white px-10 py-4 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-charcoal transition-colors">
                                Send inquiry
                            </button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;

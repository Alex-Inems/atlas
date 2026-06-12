"use client";

import Link from "next/link";
import { companyInfo } from "@/lib/data";

const Footer = () => (
    <footer className="bg-charcoal text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
            <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-5">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-px bg-safety" />
                        <span className="text-sm font-black tracking-[0.32em]">ATLAS</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm">{companyInfo.description}</p>
                    <p className="text-[10px] text-white/25 mt-4">{companyInfo.legalName} · Est. {companyInfo.founded}</p>
                </div>
                <div className="md:col-span-3">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-bold mb-5">Navigate</p>
                    <ul className="space-y-3">
                        {["Projects", "Services", "Process", "Team", "Blog", "Contact"].map(item => (
                            <li key={item}>
                                <Link href={`/${item.toLowerCase()}`} className="text-sm text-white/50 hover:text-safety transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-4">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-bold mb-5">Contact</p>
                    <p className="text-sm text-white/50">{companyInfo.email}</p>
                    <p className="text-sm text-white/50 mt-2">{companyInfo.phone}</p>
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">{companyInfo.headquarters}</p>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-[10px] tracking-[0.18em] uppercase text-white/25">
                <span>© 2025 {companyInfo.name}</span>
                <span>General contractor · Design-build · Jakarta</span>
            </div>
        </div>
    </footer>
);

export default Footer;

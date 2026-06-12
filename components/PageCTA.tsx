import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PageCTAProps {
    title?: string;
    description?: string;
}

const PageCTA = ({
    title = "Ready to build?",
    description = "Tell us about your project scope, timeline, and location.",
}: PageCTAProps) => (
    <section className="py-24 md:py-32 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
                <p className="text-safety text-[11px] tracking-[0.28em] uppercase font-bold mb-4">Next step</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">{title}</h2>
                <p className="text-white/40 mt-4 max-w-md">{description}</p>
            </div>
            <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-safety text-white px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-white hover:text-charcoal transition-colors shrink-0"
            >
                Start a project <ArrowUpRight className="w-4 h-4" />
            </Link>
        </div>
    </section>
);

export default PageCTA;

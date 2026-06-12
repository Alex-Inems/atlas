interface PageHeroProps {
    number: string;
    label: string;
    title: string;
    description?: string;
}

const PageHero = ({ number, label, title, description }: PageHeroProps) => (
    <section className="pt-32 md:pt-40 pb-20 md:pb-28 bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-safety font-mono text-sm font-bold">{number}</span>
                <span className="w-12 h-px bg-charcoal/10" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-muted font-semibold">{label}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-charcoal leading-[0.95] tracking-tight max-w-4xl">
                {title}
            </h1>
            {description && (
                <p className="text-muted text-lg md:text-xl leading-relaxed mt-8 max-w-2xl">{description}</p>
            )}
        </div>
    </section>
);

export default PageHero;

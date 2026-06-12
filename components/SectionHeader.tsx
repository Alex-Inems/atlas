interface SectionHeaderProps {
    number: string;
    label: string;
    title: string;
    description?: string;
    align?: "left" | "center";
}

const SectionHeader = ({ number, label, title, description, align = "left" }: SectionHeaderProps) => (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
        <div className={`flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
            <span className="text-safety font-mono text-sm font-bold">{number}</span>
            <span className="w-10 h-px bg-charcoal/15" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-muted font-semibold">{label}</span>
        </div>
        <h2 className="text-3xl md:text-[2.75rem] font-black text-charcoal leading-[1.05] tracking-tight">{title}</h2>
        {description && (
            <p className={`text-muted text-base md:text-lg leading-relaxed mt-5 ${align === "center" ? "" : "max-w-lg"}`}>
                {description}
            </p>
        )}
    </div>
);

export default SectionHeader;

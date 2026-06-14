export default function AppPageHero({
    label,
    title,
    description,
}: {
    label: string;
    title: string;
    description?: string;
}) {
    return (
        <section className="sb-page-hero">
            <div className="sb-page-hero-inner">
                <p className="sb-page-eyebrow">{label}</p>
                <h1 className="sb-page-heading">{title}</h1>
                {description && <p className="sb-page-sub">{description}</p>}
            </div>
        </section>
    );
}

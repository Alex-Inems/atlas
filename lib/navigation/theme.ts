export type NavSurface = "hero" | "default";

export const resolveNavSurface = (isHome: boolean, pastHero: boolean): NavSurface =>
    isHome && !pastHero ? "hero" : "default";

export const navLinkClass = (surface: NavSurface, active: boolean): string => {
    if (surface === "hero") {
        return `relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
            active ? "text-white" : "text-white/80 hover:text-white"
        }`;
    }
    return `relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
        active ? "text-safety" : "text-charcoal/50 hover:text-charcoal"
    }`;
};

export const navActionClass = (surface: NavSurface): string =>
    surface === "hero"
        ? "text-white/80 hover:text-white"
        : "text-muted hover:text-charcoal";

export const navCtaClass = (surface: NavSurface): string =>
    surface === "hero"
        ? "border border-white/50 text-white hover:bg-white hover:text-charcoal"
        : "bg-charcoal text-white hover:bg-safety";

export const navLogoLineClass = (surface: NavSurface): string =>
    surface === "hero" ? "bg-white" : "bg-safety";

export const navLogoTextClass = (surface: NavSurface): string =>
    surface === "hero" ? "text-white" : "text-charcoal";

export const navMenuIconClass = (surface: NavSurface): string =>
    surface === "hero" ? "text-white" : "text-charcoal";

export const navActiveUnderlineClass = (surface: NavSurface): string =>
    surface === "hero" ? "bg-white" : "bg-safety";

export const navActiveLayoutId = (surface: NavSurface): string =>
    surface === "hero" ? "nav-active-hero" : "nav-active";

export const HERO_ELEMENT_ID = "hero";
export const HERO_SCROLL_OFFSET = 80;

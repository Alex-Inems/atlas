export type NavSurface = "hero" | "default" | "dashboard";

const DASHBOARD_PREFIXES = ["/portal", "/profile"];

export const isDashboardRoute = (pathname: string): boolean =>
    DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p));

export const resolveNavSurface = (
    pathname: string,
    isHome: boolean,
    pastHero: boolean,
): NavSurface => {
    if (isDashboardRoute(pathname)) return "dashboard";
    if (isHome && !pastHero) return "hero";
    return "default";
};

export const navLinkClass = (surface: NavSurface, active: boolean): string => {
    if (surface === "hero") {
        return `relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
            active ? "text-white" : "text-white/80 hover:text-white"
        }`;
    }
    if (surface === "dashboard") {
        return `relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
            active ? "text-[#3ecf8e]" : "text-white/50 hover:text-white/90"
        }`;
    }
    return `relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
        active ? "text-safety" : "text-charcoal/50 hover:text-charcoal"
    }`;
};

export const navActionClass = (surface: NavSurface): string => {
    if (surface === "hero") return "text-white/80 hover:text-white";
    if (surface === "dashboard") return "text-white/60 hover:text-white/90";
    return "text-muted hover:text-charcoal";
};

export const navCtaClass = (surface: NavSurface): string => {
    if (surface === "hero") {
        return "border border-white/50 text-white hover:bg-white hover:text-charcoal";
    }
    if (surface === "dashboard") {
        return "bg-[#3ecf8e] text-[#0d0d0d] hover:bg-[#38bc81]";
    }
    return "bg-charcoal text-white hover:bg-safety";
};

export const navLogoLineClass = (surface: NavSurface): string => {
    if (surface === "hero") return "bg-white";
    if (surface === "dashboard") return "bg-[#3ecf8e]";
    return "bg-safety";
};

export const navLogoTextClass = (surface: NavSurface): string => {
    if (surface === "hero") return "text-white";
    if (surface === "dashboard") return "text-white";
    return "text-charcoal";
};

export const navMenuIconClass = (surface: NavSurface): string => {
    if (surface === "hero") return "text-white";
    if (surface === "dashboard") return "text-white";
    return "text-charcoal";
};

export const navActiveUnderlineClass = (surface: NavSurface): string => {
    if (surface === "hero") return "bg-white";
    if (surface === "dashboard") return "bg-[#3ecf8e]";
    return "bg-safety";
};

export const navActiveLayoutId = (surface: NavSurface): string => {
    if (surface === "hero") return "nav-active-hero";
    if (surface === "dashboard") return "nav-active-dashboard";
    return "nav-active";
};

export const navHeaderClass = (surface: NavSurface): string => {
    if (surface === "dashboard") {
        return "bg-[#141414]/95 border-b border-white/[0.06] backdrop-blur-md";
    }
    return "";
};

export const HERO_ELEMENT_ID = "hero";
export const HERO_SCROLL_OFFSET = 80;

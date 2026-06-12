import type { NavLink } from "@/lib/types/content";

export const PRIMARY_NAV_LINKS = [
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "Team", href: "/team" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
] as const satisfies readonly NavLink[];

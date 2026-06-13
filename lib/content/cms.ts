import { createClient } from "@/lib/supabase/server";
import type { PageHeroContent, PageSlug } from "@/lib/types/database";
import { companyInfo, testimonial } from "@/lib/data";

const DEFAULT_HERO: Partial<Record<PageSlug, PageHeroContent>> = {
    projects: {
        number: "01",
        label: "Landmark delivery",
        title: "Projects shaping skylines",
        description:
            "Verified completions from the global portfolio we benchmark against — real architects, heights, and delivery dates.",
    },
    services: {
        number: "02",
        label: "Capabilities",
        title: "Full-spectrum delivery",
        description:
            "Six core disciplines aligned with AIA general contracting and design-build standards.",
    },
    process: {
        number: "03",
        label: "Method",
        title: "Five phases. Zero surprises.",
        description: "From feasibility through certificate of occupancy — every gate documented.",
    },
    team: {
        number: "05",
        label: "People",
        title: "Built by specialists",
        description: `${companyInfo.legalName} — founded ${companyInfo.founded}.`,
    },
    blog: {
        number: "06",
        label: "Intelligence",
        title: "Industry signals",
        description: "Facts from BLS, OSHA, and market research — not opinion.",
    },
    contact: {
        number: "07",
        label: "Contact",
        title: "Start a conversation",
        description: "We respond within one business day.",
    },
};

const DEFAULT_COMPANY = {
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    phone: companyInfo.phone,
    email: companyInfo.email,
    headquarters: companyInfo.headquarters,
    description: companyInfo.description,
    testimonialQuote: testimonial.quote,
    testimonialAuthor: testimonial.author,
    testimonialRole: testimonial.role,
};

export async function getPageContent(slug: PageSlug) {
    const supabase = await createClient();
    const { data } = await supabase.from("site_pages").select("content").eq("slug", slug).single();

    const defaults =
        slug === "company"
            ? DEFAULT_COMPANY
            : ((DEFAULT_HERO[slug] as Record<string, unknown>) ?? {});

    return { ...(defaults as Record<string, unknown>), ...(data?.content ?? {}) };
}

export async function getPageHero(slug: PageSlug): Promise<PageHeroContent> {
    const content = await getPageContent(slug);
    const defaults = DEFAULT_HERO[slug] ?? {};

    return {
        number: (content.number as string) ?? defaults.number ?? "01",
        label: (content.label as string) ?? defaults.label ?? "",
        title: (content.title as string) ?? defaults.title ?? "",
        description: (content.description as string) ?? defaults.description ?? "",
    };
}

export async function getCompanyContent() {
    return getPageContent("company");
}

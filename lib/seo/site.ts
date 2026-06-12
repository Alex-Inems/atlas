import type { Metadata } from "next";
import { companyInfo } from "@/lib/data";

export const siteName = companyInfo.name;
export const siteUrl = `https://${companyInfo.website}`;

export const defaultDescription =
    "Jakarta construction company — one team from planning to handover. Offices, commercial, and residential builds with clear timelines and weekly updates.";

export type PageKey =
    | "home"
    | "projects"
    | "services"
    | "process"
    | "team"
    | "blog"
    | "contact";

interface PageSeo {
    title: string;
    description: string;
}

export const pageSeo: Record<PageKey, PageSeo> = {
    home: {
        title: "Atlas Build | Construction Company Jakarta",
        description:
            "One team from planning to handover. Offices, commercial, and residential builds in Jakarta—clear timelines, weekly updates, no surprises.",
    },
    projects: {
        title: "Our Projects | Atlas Build Jakarta",
        description:
            "See the kind of buildings we deliver—landmark towers and complex sites handled with care, precision, and on-time completion.",
    },
    services: {
        title: "What We Build | Atlas Build",
        description:
            "Design, structure, interiors, and systems—one company accountable for your whole project. Less coordination for you, better results.",
    },
    process: {
        title: "How We Work | Atlas Build",
        description:
            "Five simple phases: discover, design, plan, build, hand over. You always know what's happening and what's next.",
    },
    team: {
        title: "Our Team | Atlas Build Jakarta",
        description:
            "Experienced project leaders based in Jakarta. Real people you can call—not a faceless contractor.",
    },
    blog: {
        title: "Insights | Atlas Build",
        description:
            "Practical updates on construction, safety, and building trends—written in plain language, backed by real data.",
    },
    contact: {
        title: "Get a Quote | Atlas Build Jakarta",
        description: `Tell us about your project. We respond within one business day. Call ${companyInfo.phone} or email ${companyInfo.email}.`,
    },
};

export const buildMetadata = (page: PageKey): Metadata => {
    const { title, description } = pageSeo[page];

    return {
        title,
        description,
        openGraph: {
            type: "website",
            siteName,
            title,
            description,
            url: page === "home" ? siteUrl : `${siteUrl}/${page}`,
            locale: "en_ID",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
};

export const localBusinessJsonLd = () => ({
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    description: defaultDescription,
    url: siteUrl,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    foundingDate: companyInfo.founded,
    address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Dr. Makaliwe Raya No. 28",
        addressLocality: "West Jakarta",
        addressRegion: "Jakarta",
        addressCountry: "ID",
    },
    areaServed: {
        "@type": "City",
        name: "Jakarta",
    },
});

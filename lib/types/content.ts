import type { PhaseIndex } from "./branded";

export type ProjectCategory = "commercial" | "residential" | "infrastructure";

export interface IndustryStat {
    value: string;
    label: string;
    source: string;
}

export interface SafetyStat {
    value: string;
    unit?: string;
    label: string;
    note: string;
}

export interface LandmarkProject {
    id: string;
    title: string;
    location: string;
    year: string;
    category: ProjectCategory;
    architect: string;
    builder: string;
    developer: string;
    height: string;
    floors: string;
    area: string;
    image: string;
    description: string;
}

export interface ServiceOffering {
    num: string;
    title: string;
    description: string;
    capabilities: readonly string[];
}

export interface ProcessStep {
    num: string;
    title: string;
    description: string;
    deliverables: readonly string[];
}

export interface BlogPost {
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    source: string;
}

export interface CompanyInfo {
    name: string;
    legalName: string;
    founded: string;
    headquarters: string;
    phone: string;
    email: string;
    website: string;
    employees: string;
    description: string;
}

export interface Leader {
    name: string;
    role: string;
    note: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
}

export type TransformOrigin = `${"center" | "left" | "right"} ${"top" | "center" | "bottom"}`;

export interface CinematicMediaFrame {
    readonly image: string;
    readonly transformOrigin: TransformOrigin;
    readonly kenBurnsScale: number;
    readonly kenBurnsDurationMs: number;
}

export interface HeroPhase {
    readonly num: string;
    readonly title: string;
    readonly headline: string;
    readonly description: string;
    readonly accentLineIndex: PhaseIndex;
    readonly media: CinematicMediaFrame;
}

export interface NavLink {
    readonly label: string;
    readonly href: `/${string}`;
}

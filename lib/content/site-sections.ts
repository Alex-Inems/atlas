import type { ComponentType } from "react";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProjectsGallery from "@/components/ProjectsGallery";
import Services from "@/components/Services";
import ProcessTimeline from "@/components/ProcessTimeline";
import Safety from "@/components/Safety";
import Team from "@/components/Team";
import Testimonial from "@/components/Testimonial";
import Blog from "@/components/Blog";
import ContactSection from "@/components/ContactSection";

export interface SiteSection {
    readonly id: string;
    readonly Component: ComponentType;
}

/** Declarative homepage composition — order is data, not JSX nesting depth. */
export const HOME_SECTIONS = [
    { id: "hero", Component: Hero },
    { id: "stats", Component: Stats },
    { id: "projects", Component: ProjectsGallery },
    { id: "services", Component: Services },
    { id: "process", Component: ProcessTimeline },
    { id: "safety", Component: Safety },
    { id: "team", Component: Team },
    { id: "testimonial", Component: Testimonial },
    { id: "blog", Component: Blog },
    { id: "contact", Component: ContactSection },
] as const satisfies readonly SiteSection[];

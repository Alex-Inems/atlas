export type UserRole = "user" | "admin" | "restricted";
export type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: UserRole;
    restricted_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface ClientProject {
    id: string;
    user_id: string;
    title: string;
    location: string | null;
    status: ProjectStatus;
    phase: string | null;
    updated_at: string;
    created_at: string;
}

export interface SitePage {
    slug: string;
    title: string;
    content: Record<string, unknown>;
    updated_at: string;
    updated_by: string | null;
}

export interface AdminStats {
    totalUsers: number;
    adminUsers: number;
    restrictedUsers: number;
    totalProjects: number;
    totalPages: number;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    planning: "Planning",
    in_progress: "In Progress",
    review: "Under Review",
    completed: "Completed",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    user: "User",
    admin: "Admin",
    restricted: "Restricted",
};

export const EDITABLE_PAGE_SLUGS = [
    "home",
    "projects",
    "services",
    "process",
    "team",
    "blog",
    "contact",
    "company",
] as const;

export type PageSlug = (typeof EDITABLE_PAGE_SLUGS)[number];

export interface PageHeroContent {
    label?: string;
    title?: string;
    description?: string;
    number?: string;
}

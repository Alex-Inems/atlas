export type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
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

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    planning: "Planning",
    in_progress: "In Progress",
    review: "Under Review",
    completed: "Completed",
};

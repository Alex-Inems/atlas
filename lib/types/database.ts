export type UserRole = "user" | "admin" | "restricted";

export type BookingServiceType =
    | "initial_consultation"
    | "feasibility_site_visit"
    | "design_build_intake"
    | "safety_compliance_walkthrough"
    | "project_kickoff"
    | "progress_inspection";

export type BookingStatus =
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show"
    | "reschedule_requested";

export type BookingTimeSlot = "morning_08_12" | "afternoon_13_17" | "full_day";

export type BookingBudgetRange =
    | "under_500m"
    | "500m_2b"
    | "2b_10b"
    | "10b_50b"
    | "over_50b"
    | "undisclosed";

export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: UserRole;
    restricted_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: string;
    reference: string;
    user_id: string;
    service_type: BookingServiceType;
    status: BookingStatus;
    preferred_date: string;
    preferred_time_slot: BookingTimeSlot;
    timezone: string;
    scheduled_start: string | null;
    scheduled_end: string | null;
    site_address: string;
    site_city: string;
    project_scope: string;
    budget_range: BookingBudgetRange | null;
    contact_phone: string;
    company_name: string | null;
    special_requirements: string | null;
    admin_notes: string | null;
    cancellation_reason: string | null;
    confirmed_at: string | null;
    completed_at: string | null;
    reschedule_preferred_date: string | null;
    reschedule_preferred_time_slot: BookingTimeSlot | null;
    reschedule_note: string | null;
    project_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface BookingEvent {
    id: string;
    booking_id: string;
    event_type: string;
    message: string;
    actor_id: string | null;
    metadata: Record<string, unknown> | null;
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
    totalBookings: number;
    pendingBookings: number;
    totalPages: number;
}

export const BOOKING_SERVICE_LABELS: Record<BookingServiceType, string> = {
    initial_consultation: "Initial Consultation",
    feasibility_site_visit: "Feasibility & Site Visit",
    design_build_intake: "Design-Build Intake",
    safety_compliance_walkthrough: "Safety & Compliance Walkthrough",
    project_kickoff: "Project Kickoff Meeting",
    progress_inspection: "Progress Inspection",
};

export const BOOKING_SERVICE_DESCRIPTIONS: Record<BookingServiceType, string> = {
    initial_consultation:
        "30-minute discovery call to scope your project, timeline, and delivery model.",
    feasibility_site_visit:
        "On-site assessment of geotechnical, access, and constructability constraints.",
    design_build_intake:
        "Structured intake for design development, BIM coordination, and permitting path.",
    safety_compliance_walkthrough:
        "OSHA-aligned site safety review and compliance documentation walkthrough.",
    project_kickoff:
        "Mobilization meeting with project team, milestones, and communication protocol.",
    progress_inspection:
        "Milestone inspection with phase gate documentation and punch-list review.",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
    pending: "Pending review",
    confirmed: "Confirmed",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
    reschedule_requested: "Reschedule requested",
};

export const BOOKING_TIME_SLOT_LABELS: Record<BookingTimeSlot, string> = {
    morning_08_12: "Morning · 08:00–12:00 WIB",
    afternoon_13_17: "Afternoon · 13:00–17:00 WIB",
    full_day: "Full day · 08:00–17:00 WIB",
};

export const BOOKING_BUDGET_LABELS: Record<BookingBudgetRange, string> = {
    under_500m: "Under IDR 500M",
    "500m_2b": "IDR 500M – 2B",
    "2b_10b": "IDR 2B – 10B",
    "10b_50b": "IDR 10B – 50B",
    over_50b: "Over IDR 50B",
    undisclosed: "Prefer not to disclose",
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

export interface CreateBookingInput {
    service_type: BookingServiceType;
    preferred_date: string;
    preferred_time_slot: BookingTimeSlot;
    site_address: string;
    site_city: string;
    project_scope: string;
    budget_range?: BookingBudgetRange | null;
    contact_phone: string;
    company_name?: string;
    special_requirements?: string;
}

export type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

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

export interface ProjectDocument {
    id: string;
    project_id: string;
    file_name: string;
    storage_path: string;
    mime_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    created_at: string;
}

export interface ProjectEvent {
    id: string;
    project_id: string;
    event_type: string;
    message: string;
    actor_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export type InquiryStatus = "new" | "in_progress" | "resolved" | "spam";

export interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    user_id: string | null;
    status: InquiryStatus;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
    new: "New",
    in_progress: "In progress",
    resolved: "Resolved",
    spam: "Spam",
};

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export interface Quote {
    id: string;
    reference: string;
    user_id: string;
    project_id: string | null;
    booking_id: string | null;
    title: string;
    status: QuoteStatus;
    subtotal: number;
    tax_rate: number;
    total: number;
    currency: string;
    valid_until: string | null;
    notes: string | null;
    stripe_payment_intent_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface QuoteLineItem {
    id: string;
    quote_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    sort_order: number;
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    accepted: "Accepted",
    declined: "Declined",
    expired: "Expired",
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

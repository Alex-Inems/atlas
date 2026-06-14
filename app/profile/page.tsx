import type { Metadata } from "next";
import AppPageHero from "@/components/portal/AppPageHero";
import ProfileForm from "@/components/ProfileForm";
import AccountStatus from "@/components/AccountStatus";
import { requireAuth } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Account | Inema",
    robots: { index: false, follow: false },
};

export default async function ProfilePage() {
    const { user, profile } = await requireAuth();

    const initialName =
        profile?.full_name ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "";

    return (
        <div className="sb-app-page">
            <AppPageHero
                label="Account"
                title="Profile settings"
                description="Update your name and password."
            />
            <div className="sb-content-wrap-narrow">
                <AccountStatus role={profile?.role} email={user.email ?? ""} />
                <ProfileForm initialName={initialName} email={user.email ?? ""} dark />
            </div>
        </div>
    );
}

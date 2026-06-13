import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProfileForm from "@/components/ProfileForm";
import { requireAuth } from "@/lib/admin/auth";

export const metadata: Metadata = {
    title: "Account | Atlas Build",
    robots: { index: false, follow: false },
};

export default async function ProfilePage() {
    const { supabase, user } = await requireAuth();

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

    const initialName =
        profile?.full_name ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "";

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="—"
                label="Account"
                title="Profile settings"
                description="Update your name and password."
            />
            <section className="py-16">
                <div className="max-w-lg mx-auto px-6 md:px-10">
                    <ProfileForm initialName={initialName} email={user.email ?? ""} />
                </div>
            </section>
        </div>
    );
}

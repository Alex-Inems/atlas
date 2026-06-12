import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata("contact");

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number="07"
                label="Contact"
                title="Start a conversation"
                description="We respond within one business day."
            />
            <ContactForm />
        </div>
    );
}

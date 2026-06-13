import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo/site";
import { getPageHero } from "@/lib/content/cms";

export const metadata = buildMetadata("contact");

export default async function ContactPage() {
    const hero = await getPageHero("contact");

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number={hero.number ?? "07"}
                label={hero.label ?? "Contact"}
                title={hero.title ?? "Start a conversation"}
                description={hero.description ?? "We respond within one business day."}
            />
            <ContactForm />
        </div>
    );
}

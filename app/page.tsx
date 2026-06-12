import HomePage from "@/components/HomePage";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata("home");

export default function Page() {
    return <HomePage />;
}

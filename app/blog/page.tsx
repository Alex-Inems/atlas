import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import { blogPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/site";
import { getPageHero } from "@/lib/content/cms";

export const metadata = buildMetadata("blog");

export default async function BlogPage() {
    const hero = await getPageHero("blog");
    const featured = blogPosts[0];
    return (
        <div className="bg-white min-h-screen">
            <PageHero
                number={hero.number ?? "06"}
                label={hero.label ?? "Intelligence"}
                title={hero.title ?? "Industry signals"}
                description={hero.description ?? ""}
            />
            <section className="py-16 border-b border-line">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-safety font-bold mb-4">Featured</p>
                    <h2 className="text-3xl font-black text-charcoal max-w-3xl mb-6">{featured.title}</h2>
                    <p className="text-muted max-w-2xl mb-4">{featured.excerpt}</p>
                    <p className="text-xs text-muted">{featured.date} · Source: {featured.source}</p>
                </div>
            </section>
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-10 divide-y divide-line">
                    {blogPosts.map(post => (
                        <article key={post.title} className="py-10">
                            <span className="text-[10px] uppercase text-safety font-bold">{post.category}</span>
                            <h3 className="text-xl font-bold text-charcoal mt-2 mb-3">{post.title}</h3>
                            <p className="text-muted text-sm">{post.excerpt}</p>
                            <p className="text-xs text-muted mt-3">{post.date} · {post.source}</p>
                        </article>
                    ))}
                </div>
            </section>
            <PageCTA />
        </div>
    );
}

import Link from "next/link";
import { LayoutDashboard, Users, FileText, FolderKanban, ArrowLeft } from "lucide-react";

const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/pages", label: "Pages", icon: FileText },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export default function AdminShell({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="min-h-screen bg-premium pt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-safety font-mono text-sm font-bold">Admin</p>
                        <h1 className="text-3xl md:text-4xl font-black text-charcoal mt-2">{title}</h1>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold text-muted hover:text-charcoal"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to site
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    <aside className="lg:col-span-3">
                        <nav className="bg-white border border-line divide-y divide-line">
                            {links.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-charcoal hover:bg-premium transition-colors"
                                >
                                    <Icon className="w-4 h-4 text-safety" />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                    <main className="lg:col-span-9">{children}</main>
                </div>
            </div>
        </div>
    );
}

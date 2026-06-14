import Link from "next/link";
import type { UserRole } from "@/lib/types/database";

export default function AccountStatus({
    role,
    email,
}: {
    role: UserRole | null | undefined;
    email: string;
}) {
    const isAdmin = role === "admin";

    return (
        <div className="sb-card" style={{ marginBottom: 24 }}>
            <div className="sb-card-header">
                <h2 className="sb-card-title">Account</h2>
                {isAdmin && (
                    <span className="sb-badge sb-badge-brand">Admin</span>
                )}
            </div>
            <div className="sb-card-body-padded">
                <div className="sb-field" style={{ marginBottom: 12 }}>
                    <p className="sb-label">Signed in as</p>
                    <p className="sb-cell-primary">{email}</p>
                </div>
                <div className="sb-field" style={{ marginBottom: isAdmin ? 12 : 0 }}>
                    <p className="sb-label">Role</p>
                    <p className="sb-cell-primary capitalize">{role ?? "unknown"}</p>
                </div>

                {isAdmin ? (
                    <Link href="/admin" className="sb-btn sb-btn-primary sb-btn-sm">
                        Open admin dashboard
                    </Link>
                ) : (
                    <p className="sb-page-sub" style={{ marginTop: 8 }}>
                        Not admin yet? Configure{" "}
                        <code className="sb-cell-mono">ADMIN_BOOTSTRAP_EMAIL</code> in{" "}
                        <code className="sb-cell-mono">.env.local</code> or run{" "}
                        <code className="sb-cell-mono">supabase/fix_admin.sql</code>.
                    </p>
                )}
            </div>
        </div>
    );
}

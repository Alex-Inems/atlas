import AdminBodyLock from "@/components/admin/AdminBodyLock";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminBodyLock />
            {children}
        </>
    );
}

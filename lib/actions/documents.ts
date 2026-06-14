"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireAuth } from "@/lib/admin/auth";
import { logProjectEvent } from "@/lib/events/log";

const ALLOWED_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/vnd.dwg",
    "application/acad",
    "application/octet-stream",
]);
const MAX_BYTES = 25 * 1024 * 1024;

export async function uploadProjectDocument(projectId: string, formData: FormData) {
    const { supabase, user } = await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { error: "No file provided." };
    if (file.size > MAX_BYTES) return { error: "File must be under 25 MB." };
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
        return { error: "Allowed types: PDF, JPG, PNG, WEBP, DWG." };
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${projectId}/${Date.now()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
        });

    if (uploadError) return { error: uploadError.message };

    const { error: dbError } = await supabase.from("project_documents").insert({
        project_id: projectId,
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type || null,
        file_size: file.size,
        uploaded_by: user.id,
    });

    if (dbError) {
        await supabase.storage.from("project-documents").remove([storagePath]);
        return { error: dbError.message };
    }

    await logProjectEvent(projectId, "document_uploaded", `Uploaded ${file.name}`, user.id);
    revalidatePath(`/portal/projects/${projectId}`);
    revalidatePath("/admin/projects");
    return { error: null };
}

export async function getDocumentDownloadUrl(documentId: string) {
    const { supabase, user, profile } = await requireAuth();
    const isAdmin = profile?.role === "admin";

    const { data: doc } = await supabase
        .from("project_documents")
        .select("*")
        .eq("id", documentId)
        .single();

    if (!doc) return { error: "Document not found.", url: null };

    const { data: project } = await supabase
        .from("client_projects")
        .select("user_id")
        .eq("id", doc.project_id)
        .single();

    if (!isAdmin && project?.user_id !== user.id) return { error: "Access denied.", url: null };

    const { data, error } = await supabase.storage
        .from("project-documents")
        .createSignedUrl(doc.storage_path, 3600);

    if (error || !data?.signedUrl) return { error: error?.message ?? "Could not generate link.", url: null };
    return { error: null, url: data.signedUrl };
}

"use client";

import { useEffect } from "react";

export default function AdminBodyLock() {
    useEffect(() => {
        document.body.classList.add("admin-active");
        return () => document.body.classList.remove("admin-active");
    }, []);

    return null;
}

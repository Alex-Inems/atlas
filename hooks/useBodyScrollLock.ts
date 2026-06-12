"use client";

import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean): void {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = locked ? "hidden" : "";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [locked]);
}

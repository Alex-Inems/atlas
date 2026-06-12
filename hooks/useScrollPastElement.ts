"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Tracks whether the viewport has scrolled past `elementId` by `offset` px.
 * Uses rAF-coalesced scroll + ResizeObserver for layout-shift resilience.
 */
export function useScrollPastElement(elementId: string, offset = 80): boolean {
    const [past, setPast] = useState(false);
    const rafRef = useRef<number | null>(null);
    const pastRef = useRef(false);

    useEffect(() => {
        const measure = () => {
            const el = document.getElementById(elementId);
            const heroBottom = el ? el.offsetTop + el.offsetHeight : window.innerHeight;
            const next = window.scrollY >= heroBottom - offset;
            if (next !== pastRef.current) {
                pastRef.current = next;
                setPast(next);
            }
        };

        const onScroll = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                measure();
            });
        };

        const el = document.getElementById(elementId);
        const ro = el ? new ResizeObserver(measure) : null;
        ro?.observe(el!);

        window.addEventListener("scroll", onScroll, { passive: true });
        measure();

        return () => {
            window.removeEventListener("scroll", onScroll);
            ro?.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [elementId, offset]);

    return past;
}

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface MotionPreference {
    readonly reducedMotion: boolean;
}

const MotionPreferenceContext = createContext<MotionPreference>({ reducedMotion: false });

export const useMotionPreference = (): MotionPreference =>
    useContext(MotionPreferenceContext);

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReducedMotion(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return (
        <MotionPreferenceContext.Provider value={{ reducedMotion }}>
            {children}
        </MotionPreferenceContext.Provider>
    );
}

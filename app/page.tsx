"use client";

import { HOME_SECTIONS } from "@/lib/content/site-sections";

export default function LuxuryConstruction() {
    return (
        <div className="bg-white">
            {HOME_SECTIONS.map(({ id, Component }) => (
                <Component key={id} />
            ))}
        </div>
    );
}

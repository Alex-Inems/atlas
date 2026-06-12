"use client";

import { HOME_SECTIONS } from "@/lib/content/site-sections";

const HomePage = () => (
    <div className="bg-white">
        {HOME_SECTIONS.map(({ id, Component }) => (
            <Component key={id} />
        ))}
    </div>
);

export default HomePage;

import type { CubicBezier } from "./easing";
import { BRAND_EASE } from "./easing";

export const MOTION = {
    ease: {
        brand: BRAND_EASE satisfies CubicBezier,
        in: [0.4, 0, 1, 1] as const,
        out: [0, 0, 0.2, 1] as const,
    },
    duration: {
        reveal: 0.65,
        heroLine: 0.7,
        heroBadge: 0.6,
        heroExit: 0.35,
        crossfade: 1.4,
        kenBurns: 5,
        navMenu: 0.3,
    },
    distance: {
        revealY: 32,
        heroFallY: 90,
        heroBadgeY: 60,
    },
    stagger: {
        heroLineBase: 0.1,
        heroLineStep: 0.14,
        heroDescription: 0.38,
        revealDefault: 0.08,
        navMobileItem: 0.04,
    },
    viewport: {
        revealMargin: "-60px",
        revealOnce: true,
    },
    hero: {
        phaseIntervalMs: 5000,
        tickerThrottleMs: 50,
    },
    cinematic: {
        kenBurnsFromScale: 1.08,
        vignetteOpacity: 0.45,
        overlayOpacity: 0.5,
    },
} as const;

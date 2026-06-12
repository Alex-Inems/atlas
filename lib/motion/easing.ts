/** Cubic-bezier evaluation via De Casteljau — no DOM dependency. */
export type CubicBezier = readonly [number, number, number, number];

const cubicAt = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

/** Sample x(t) along the curve to approximate y for input x ∈ [0,1]. */
export const cubicBezier = ([x1, y1, x2, y2]: CubicBezier) => (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 8; i++) {
        const cx = cubicAt(t, 0, x1, x2, 1) - x;
        const dx = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
        if (Math.abs(dx) < 1e-6) break;
        t -= cx / dx;
        t = Math.max(0, Math.min(1, t));
    }
    return cubicAt(t, 0, y1, y2, 1);
};

export const BRAND_EASE: CubicBezier = [0.22, 1, 0.36, 1];
export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

import type { NormalizedProgress } from "@/lib/types/branded";
import { asProgress } from "@/lib/types/branded";

export const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const mod = (n: number, m: number): number => ((n % m) + m) % m;

export const normalizeProgress = (elapsed: number, duration: number): NormalizedProgress =>
    asProgress(clamp(elapsed / duration, 0, 1));

export const padPhaseNumber = (index: number, total: number): string =>
    String(index + 1).padStart(String(total).length, "0");

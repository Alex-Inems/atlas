/** Nominal typing — prevents accidental mixing of semantically distinct numbers/strings. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type PhaseIndex = Brand<number, "PhaseIndex">;
export type Milliseconds = Brand<number, "Milliseconds">;
export type NormalizedProgress = Brand<number, "NormalizedProgress">;

export const asPhaseIndex = (n: number): PhaseIndex => n as PhaseIndex;
export const asMilliseconds = (n: number): Milliseconds => n as Milliseconds;
export const asProgress = (n: number): NormalizedProgress => n as NormalizedProgress;

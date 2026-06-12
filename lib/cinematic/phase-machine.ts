import { mod, normalizeProgress } from "@/lib/utils/math";
import type { NormalizedProgress } from "@/lib/types/branded";

export interface PhaseMachineState {
    readonly index: number;
    readonly progress: NormalizedProgress;
    readonly epoch: number;
    readonly paused: boolean;
    readonly pauseAnchor: number | null;
}

export type PhaseMachineAction =
    | { readonly type: "TICK"; readonly now: number; readonly interval: number; readonly count: number }
    | { readonly type: "GOTO"; readonly index: number; readonly now: number; readonly count: number }
    | { readonly type: "PAUSE"; readonly now: number }
    | { readonly type: "RESUME"; readonly now: number }
    | { readonly type: "VISIBILITY"; readonly hidden: boolean; readonly now: number };

export const createInitialPhaseState = (now: number): PhaseMachineState => ({
    index: 0,
    progress: normalizeProgress(0, 1),
    epoch: now,
    paused: false,
    pauseAnchor: null,
});

const advanceEpoch = (state: PhaseMachineState, now: number, count: number): PhaseMachineState => {
    const nextIndex = mod(state.index + 1, count);
    return {
        ...state,
        index: nextIndex,
        progress: normalizeProgress(0, 1),
        epoch: now,
    };
};

export const phaseMachineReducer = (
    state: PhaseMachineState,
    action: PhaseMachineAction,
): PhaseMachineState => {
    switch (action.type) {
        case "PAUSE":
            if (state.paused) return state;
            return { ...state, paused: true, pauseAnchor: action.now };

        case "RESUME": {
            if (!state.paused || state.pauseAnchor === null) return state;
            const drift = action.now - state.pauseAnchor;
            return {
                ...state,
                paused: false,
                pauseAnchor: null,
                epoch: state.epoch + drift,
            };
        }

        case "VISIBILITY":
            return action.hidden
                ? phaseMachineReducer(state, { type: "PAUSE", now: action.now })
                : phaseMachineReducer(state, { type: "RESUME", now: action.now });

        case "GOTO": {
            const bounded = mod(action.index, action.count);
            return {
                ...state,
                index: bounded,
                progress: normalizeProgress(0, 1),
                epoch: action.now,
                paused: false,
                pauseAnchor: null,
            };
        }

        case "TICK": {
            if (state.paused) return state;
            const elapsed = action.now - state.epoch;
            if (elapsed >= action.interval) {
                return advanceEpoch(state, action.now, action.count);
            }
            return {
                ...state,
                progress: normalizeProgress(elapsed, action.interval),
            };
        }

        default:
            return state;
    }
};

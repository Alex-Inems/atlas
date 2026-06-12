"use client";

import { useReducer, useEffect, useCallback } from "react";
import {
    createInitialPhaseState,
    phaseMachineReducer,
    type PhaseMachineState,
} from "@/lib/cinematic/phase-machine";
import { cinematicTicker } from "@/lib/cinematic/ticker";
import { MOTION } from "@/lib/motion/tokens";
import { asMilliseconds } from "@/lib/types/branded";

interface OrchestratorConfig {
    readonly phaseCount: number;
    readonly intervalMs?: number;
}

export interface PhaseOrchestrator {
    readonly state: PhaseMachineState;
    readonly progress: number;
    readonly activeIndex: number;
    goTo: (index: number) => void;
}

export function usePhaseOrchestrator({
    phaseCount,
    intervalMs = MOTION.hero.phaseIntervalMs,
}: OrchestratorConfig): PhaseOrchestrator {
    const interval = asMilliseconds(intervalMs);

    const [state, dispatch] = useReducer(
        phaseMachineReducer,
        undefined,
        () => createInitialPhaseState(performance.now()),
    );

    const goTo = useCallback((index: number) => {
        dispatch({ type: "GOTO", index, now: performance.now(), count: phaseCount });
    }, [phaseCount]);

    useEffect(() => {
        let lastTick = 0;
        const throttle = MOTION.hero.tickerThrottleMs;

        return cinematicTicker.subscribe((now) => {
            if (now - lastTick < throttle) return;
            lastTick = now;
            dispatch({ type: "TICK", now, interval, count: phaseCount });
        });
    }, [interval, phaseCount]);

    useEffect(() => {
        const onVisibility = () => {
            dispatch({
                type: "VISIBILITY",
                hidden: document.hidden,
                now: performance.now(),
            });
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    return {
        state,
        progress: state.progress as number,
        activeIndex: state.index,
        goTo,
    };
}

"use client";

import { useReducer, useCallback, useEffect } from "react";
import { selectableReducer, NAVIGABLE_KEYS } from "@/lib/state/selectable";

interface SelectableIndexOptions {
    readonly count: number;
    readonly initial?: number;
    readonly enableKeyboard?: boolean;
}

export function useSelectableIndex({
    count,
    initial = 0,
    enableKeyboard = false,
}: SelectableIndexOptions) {
    const [state, dispatch] = useReducer(selectableReducer, { index: initial });

    const select = useCallback((index: number) => {
        dispatch({ type: "SELECT", index, count });
    }, [count]);

    useEffect(() => {
        if (!enableKeyboard) return;

        const onKey = (e: KeyboardEvent) => {
            if (!NAVIGABLE_KEYS.has(e.key)) return;
            e.preventDefault();
            dispatch({
                type: "KEY",
                key: e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
                count,
            });
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [enableKeyboard, count]);

    return { index: state.index, select };
}

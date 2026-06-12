import { mod } from "@/lib/utils/math";

export interface SelectableState {
    readonly index: number;
}

export type SelectableAction =
    | { readonly type: "SELECT"; readonly index: number; readonly count: number }
    | { readonly type: "NEXT"; readonly count: number }
    | { readonly type: "PREV"; readonly count: number }
    | { readonly type: "KEY"; readonly key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"; readonly count: number };

export const selectableReducer = (
    state: SelectableState,
    action: SelectableAction,
): SelectableState => {
    switch (action.type) {
        case "SELECT":
            return { index: mod(action.index, action.count) };
        case "NEXT":
            return { index: mod(state.index + 1, action.count) };
        case "PREV":
            return { index: mod(state.index - 1, action.count) };
        case "KEY": {
            const delta = action.key === "ArrowDown" || action.key === "ArrowRight" ? 1 : -1;
            return { index: mod(state.index + delta, action.count) };
        }
        default:
            return state;
    }
};

export const NAVIGABLE_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

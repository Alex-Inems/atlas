export type FacetKey<T extends Record<string, unknown>> = keyof T & string;

export interface FacetDefinition<T, K extends FacetKey<Record<string, unknown>>> {
    readonly key: K;
    readonly accessor: (item: T) => string;
    readonly options: readonly string[];
}

export interface FacetedCollection<T, K extends string> {
    readonly all: readonly T[];
    readonly facets: Readonly<Record<K, readonly string[]>>;
    resolve: (active: Partial<Record<K, string>>) => readonly T[];
}

export function createFacetedCollection<
    T,
    const D extends readonly FacetDefinition<T, FacetKey<Record<string, unknown>>>[],
>(
    items: readonly T[],
    definitions: D,
): FacetedCollection<T, D[number]["key"]> {
    type Key = D[number]["key"];

    const facets = definitions.reduce(
        (acc, def) => {
            const values = new Set<string>();
            for (const item of items) values.add(def.accessor(item));
            acc[def.key as Key] = [...values].sort();
            return acc;
        },
        {} as Record<Key, string[]>,
    );

    const resolve = (active: Partial<Record<Key, string>>): readonly T[] => {
        const entries = Object.entries(active) as [Key, string | undefined][];
        const filters = entries.filter(([, v]) => v && v !== "all") as [Key, string][];

        if (filters.length === 0) return items;

        return items.filter((item) =>
            filters.every(([key, value]) => {
                const def = definitions.find((d) => d.key === key);
                return def ? def.accessor(item) === value : true;
            }),
        );
    };

    return { all: items, facets: facets as Readonly<Record<Key, readonly string[]>>, resolve };
}

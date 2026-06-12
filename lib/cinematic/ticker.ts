type TickListener = (now: number, delta: number) => void;

/**
 * Singleton RAF ticker — single animation clock for the entire app.
 * Subscribers receive high-resolution timestamps without per-component setInterval.
 */
class RafTicker {
    private rafId: number | null = null;
    private lastNow = 0;
    private readonly listeners = new Set<TickListener>();

    subscribe(listener: TickListener): () => void {
        this.listeners.add(listener);
        if (this.listeners.size === 1) this.start();
        return () => {
            this.listeners.delete(listener);
            if (this.listeners.size === 0) this.stop();
        };
    }

    private tick = (now: number) => {
        const delta = this.lastNow ? now - this.lastNow : 0;
        this.lastNow = now;
        for (const listener of this.listeners) listener(now, delta);
        this.rafId = requestAnimationFrame(this.tick);
    };

    private start() {
        if (this.rafId !== null) return;
        this.lastNow = 0;
        this.rafId = requestAnimationFrame(this.tick);
    }

    private stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.lastNow = 0;
    }
}

export const cinematicTicker = new RafTicker();

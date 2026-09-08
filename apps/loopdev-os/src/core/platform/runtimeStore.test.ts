import { describe, expect, it, vi } from 'vitest';
import { createRuntimeStore, type RuntimeState } from './runtimeStore';

type ExampleState = RuntimeState & { count: number };

const seed = (): ExampleState => ({ count: 0 });

describe('createRuntimeStore', () => {
  it('starts from the seed and applies pure commands', () => {
    const store = createRuntimeStore(seed);

    expect(store.getState()).toEqual({ count: 0 });
    expect(store.dispatch((state) => ({ ...state, count: state.count + 1 }))).toEqual({
      count: 1,
    });
  });

  it('resets to a fresh seed without sharing state', () => {
    const store = createRuntimeStore(seed);
    store.dispatch((state) => ({ ...state, count: 3 }));

    expect(store.reset()).toEqual({ count: 0 });
    expect(store.getState()).not.toBe(seed());
  });

  it('notifies subscribers and allows cleanup', () => {
    const store = createRuntimeStore(seed);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.dispatch((state) => ({ ...state, count: 1 }));
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsubscribe();
    store.reset();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

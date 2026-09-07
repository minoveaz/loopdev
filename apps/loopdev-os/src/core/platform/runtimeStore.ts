export type RuntimeState = Record<string, unknown>;
export type RuntimeCommand<TState extends RuntimeState> = (state: TState) => TState;
export type RuntimeListener<TState extends RuntimeState> = (state: TState) => void;

export interface RuntimeStore<TState extends RuntimeState> {
  getState: () => TState;
  dispatch: (command: RuntimeCommand<TState>) => TState;
  reset: () => TState;
  subscribe: (listener: RuntimeListener<TState>) => () => void;
}

export function createRuntimeStore<TState extends RuntimeState>(
  seed: () => TState,
): RuntimeStore<TState> {
  let state = seed();
  const listeners = new Set<RuntimeListener<TState>>();

  const publish = () => {
    listeners.forEach((listener) => listener(state));
  };

  return {
    getState: () => state,
    dispatch: (command) => {
      state = command(state);
      publish();
      return state;
    },
    reset: () => {
      state = seed();
      publish();
      return state;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

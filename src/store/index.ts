export type stateListener = () => void;

export type setStateArg<T> = (state: T) => T;

export type storeType<T> = {
  setState: (arg: setStateArg<T>) => void;
  getState: () => T;
  subscribe: (listener: stateListener) => () => void;
};

const createStore = <T>(initialState: T): storeType<T> => {
  let state: T = initialState;
  const listeners: Set<stateListener> = new Set();

  const subscribe = (listener: stateListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (arg: setStateArg<T>) => {
    state = { ...arg(state) };
    listeners.forEach((callback) => callback());
  };

  const getState = () => Object.freeze(state);

  return { setState, getState, subscribe };
};

export default createStore;

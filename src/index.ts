export type stateListener<T> = (state: T) => void;

export type setStateArg<T> = T | ((state: T) => T);

export class createStore<T> {
  state: T;
  listeners: stateListener<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  subscribe(subscriber: stateListener<T>) {
    this.listeners.push(subscriber);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== subscriber
      );
    };
  }

  notifySubscribers() {
    this.listeners.forEach((callback) => callback(this.state));
  }

  setState(argument: setStateArg<T>) {
    if (typeof argument === 'function' && argument.length === 1) {
      this.state = (argument as Function)(this.state);
    } else {
      this.state = argument as T;
    }
    this.notifySubscribers();
  }

  getState() {
    return this.state;
  }
}

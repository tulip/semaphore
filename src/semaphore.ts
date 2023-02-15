export enum State {
  PENDING = 'PENDING',
  READY = 'READY',
  FAILED = 'FAILED',
}

/**
 * A Semaphore is like a Promise, with a jet-pack. Use it to as a signal and to block asynchronous
 * operations.
 */
class Semaphore<T> implements PromiseLike<T> {
  private _promise: Promise<T>;
  private _resolver: (value: T) => void;
  private _rejecter: (reason?: unknown) => void;
  private _state: State = State.PENDING;

  /**
   * Wraps a promise as a semaphore. When the given promise resolves, so does the
   * returned semaphore.
   */
  static wrap<T>(promise: Promise<T>) {
    const wrapper = new Semaphore<T>();
    promise.then((result: T) => wrapper.resolve(result)).catch((reason?: unknown) => wrapper.reject(reason));
    return wrapper;
  }

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._resolver = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._rejecter = () => {};
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolver = resolve;
      this._rejecter = reject;
    });

    this.resolve.bind(this);
    this.reject.bind(this);
    this.isReady.bind(this);
  }

  resolve(value: T) {
    if (this._state === State.PENDING) {
      this._state = State.READY;
      this._resolver(value);
    }
  }

  reject(reason?: unknown) {
    if (this._state === State.PENDING) {
      this._state = State.FAILED;
      this._rejecter(reason);
    }
  }

  isReady() {
    return this.state === State.READY;
  }

  get then() {
    return this._promise.then.bind(this._promise);
  }

  get catch() {
    return this._promise.catch.bind(this._promise);
  }

  get finally() {
    return this._promise.finally.bind(this._promise);
  }

  get state() {
    return this._state;
  }
}

export default Semaphore;

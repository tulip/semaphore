import Semaphore, { State } from './semaphore';

describe('Semaphore', () => {
  let semVoid: Semaphore<void>;
  let semString: Semaphore<string>;

  beforeEach(() => {
    semVoid = new Semaphore<void>();
    semString = new Semaphore<string>();
  });

  it('Resolves', async () => {
    expect(semVoid.isReady()).toBe(false);
    semVoid.resolve();
    expect(semVoid.isReady()).toBe(true);
    await expect(semVoid).resolves.not.toThrow();

    expect(semString.isReady()).toBe(false);
    semString.resolve('test');
    expect(semString.isReady()).toBe(true);
    await expect(semString).resolves.toBe('test');
  });

  it('Resolves only once', async () => {
    expect(semString.isReady()).toBe(false);
    semString.resolve('test-1');
    expect(semString.isReady()).toBe(true);
    await expect(semString).resolves.toBe('test-1');
    semString.resolve('test-2');
    await expect(semString).resolves.toBe('test-1');
  });

  it('Rejects', async () => {
    expect(semVoid.isReady()).toBe(false);
    semVoid.reject('burp');
    expect(semVoid.isReady()).toBe(false);
    await expect(semVoid).rejects.toBe('burp');

    expect(semString.isReady()).toBe(false);
    semString.reject('burp');
    expect(semString.isReady()).toBe(false);
    await expect(semString).rejects.toBe('burp');
  });

  it('Rejects only once', async () => {
    expect(semVoid.isReady()).toBe(false);
    semVoid.reject('burp-1');
    expect(semVoid.isReady()).toBe(false);
    await expect(semVoid).rejects.toBe('burp-1');

    semVoid.reject('burp-2');
    expect(semVoid.isReady()).toBe(false);
    await expect(semVoid).rejects.toBe('burp-1');

    semVoid.resolve();
    expect(semVoid.isReady()).toBe(false);
    await expect(semVoid).rejects.toBe('burp-1');
  });

  it('Reports its state correctly', async () => {
    expect(semVoid.state).toBe(State.PENDING);
    semVoid.resolve();
    expect(semVoid.state).toBe(State.READY);

    expect(semString.state).toBe(State.PENDING);
    semString.reject('Barble');
    expect(semString.state).toBe(State.FAILED);
    await expect(semString).rejects.toBe('Barble');
  });
});

# Semaphore

A Semaphore is like a Promise, with a jet-pack. Use it as a signal and to block asynchronous
operations.

Semaphores are great when you need to know the state of a promise from synchronous code.

## API

- `Semaphore.wrap(p: Promise<T>): Semaphore<T>` - wraps a promise as a Semaphore.
- `.isReady(): boolean` - True if the semaphore was resolved.
- `.state: State` - One of 'PENDING' | 'READY' | 'FAILED'
- ... all the Promise methods `.then(...)`, `.catch(...)`, `.finally(...)`

## Example 1

```typescript
const data = new Semaphore<Data>();
fetchData().then(data.resolve, data.reject);

function renderData() {
  switch (data.state) {
    case State.PENDING:
      return "Loading...";
    case State.FAILED:
      return "Failed to fetch data";
    case State.READY:
      return `Data: ${JSON.stringify(data)}`;
  }
}
setInterval(renderData, 1000);
```

## Example 2

Say you have a class that needs to do some initialization with an asynchronous function.

```typescript
async doSomeAsyncSetup() { 
  // ....
}

class Foo {

  private ready: Semaphore<void>;

  constructor() {
    this.ready = Semaphore.wrap(doSomeAsyncSetup());
  }

  canFrobitz() {
    return ready.isReady();
  }

  async someMethod() {
    await this.ready;

    // Ready to go...
  }
}


// ... elsewhere ...

const foo = new Foo();

setTimeout(() => { 
  if (!foo.canFrobitz()) {
    console.error("Canna do it!");
  }
}, timeoutTime);
```

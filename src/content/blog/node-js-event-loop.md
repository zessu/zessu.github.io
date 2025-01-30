---
title: 'How the NodeJS event loop works'
description: 'How the NodeJS event loop works'
pubDate: 'Oct 4 2023'
---

The event loop is the mechanism by which **NodeJs** executes asynchronous tasks. By nature Javascript is single threaded, so any resource intensive tasks like doing math operations or reading from a file would block the main thread. NodeJS works with JS so to get around this limitation, it introduced the Event loop. This is how it works

NodeJS relies on a call stack and some callback queues. The call stack is a space in memory where execution steps in a program are stored and executed. If you had a synchronous program like so

```typescript
const x = 1;
const y = 3;
console.log(x+y)
```

The program will first load *x*,*y* into the callstack then perform the *console.log* and exit the program. If there was a command that does some heavy computation or take time to complete, e.g *fs.readFile()*, node prefers to handle these asynchronously by loading them in a queue and coming back to process them later.

There are different types of queues that take care of different tasks. Once nodejs pushes commands into queues it will continue processing other requests in the callstack until the callstack is empty, then it checks the queues to see if there is anything that's ready to be processed. The different types of queues are listed below in priority of how they are processed and what they typically handle

**Microtasks Queue** - process.nextTick, Mutation Observer, Promises

**Timer Queue** - setTimeout, setInterval

**I/O Queue** - file system, network events

**Check Queue** - setImmediate calls

**Close Queue** - Close handlers, file, network connection

The *IO* queue handles IO related things i.e reading files, database connections. These kind of operations are usually offloaded to [Libuv](https://github.com/libuv/libuv) a cross-platform library implemented in C++, that also handles child processes and signals. Libuv maintains about 4 threads that it uses to do IO in a non blocking manner.

Async workflow example

```typescript
import fs from 'fs'
const x = 1;
const y = 3;
const file = fs.readFile('myfile.txt', 'utf8', (err, data) => {
    // do something with this data
    // this will not block, it will be pushed to the io queue as another users requests is processed
});
```

NodeJS maintains context by wrapping the functions in a closure before sending them to a queue to be processed. That way, it can serve multiple users requests and still maintain this important context to differentiate one user from another.

---

#### References

https://www.geeksforgeeks.org/node-js-fs-readfile-method/
https://www.freecodecamp.org/news/nodejs-eventloop-tutorial/<br />
[diagram 1](https://viewer.diagrams.net/index.html?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Diagrams.drawio#R7VldU%2BM2FP01mdl9gInjfJBHEmhhCoVumGlfZVuONZElryTjZH9975Xkj8RhF6bQbtl9IChX8rV07tG5V8ogXObbXxUpsluZUD4YDZPtILwYjEZBOBzDP7TsnGU2mjnDWrHEmYatYcW%2BUP9kbS1ZQrW3OZORkhtW7BtjKQSNzZ6NKCWr%2FWGp5MmeoSBr2jOsYsL71j9ZYjJnPatXgfYrytZZ%2FeZgOnc9EYk3ayVL4d8npKCuJye1G79GnZFEVh1TeDkIl0pK41r5dkk5wrqP2C9P9DZTVlSY5zxAzHL21%2B9RJLLzYH5WVTP%2BGz%2FxXh4JLz0UD0RvwPJHScEymnLwvYgUtNbY%2BrAknOOi6yEf%2FeLMrsayypihq4LE%2BL0CvsBjmck5fAugSXThIpiyLYWpLfwMqDJ0%2B%2BTSggYw4CCVOTVqB0P8A%2BHEY%2BzpN6q%2FV51gelPWiWNtI54%2B68ZziyM0PJQvgHXUg%2FWWxUruY%2Fv94RZO%2F2Pcwh5uNQUlrylYWzirLVdEJBzkYzS8voMPWVBFDJMCLfR0DZ%2BKkoQJbKXMjnQuYI6tl6%2F5NSynChqwquHF3S36fQSM2xeQJLlEyw3ThgqqXvyGikbopmCNSwCVy9gu5MXecqo1Sh6SQWu3cucV3qNlvKE49ynJkWQi0kXH39GXgLEbgQPqAgPNAVs5Wwtoc5piD7KUgdyee3POkgQfXiiq2RcSWUdD%2BF5IhrCC18liMLlAT6WR2iUMdKyNkhu6BGgUWKzchgsIKj8wvcLuGAfhvqqM%2B7sjDI9sj2D4Vvtj%2FA%2F3R6FkzjTyAogVZ8jsjAobTGJo7ij9LK7dlsZTcygjTdUjcn54fn%2F98s0Fk4qBr6cCWPTA4s2Hjz%2BpeEjF0YFQH0lwo9m%2FqdSTfuGQ0VoX4T%2BXsmhj60TUDjiSCIcRTaWizZCvpsmnAxzDm4GF%2F9MQN0riQxzM%2ByEeD4%2BEOHyrEM96IcbiDywrYwvAw9rQZAzDrEqbePVOxJmSQpY29hBS3YulLZyxmLHR%2BEYBlDAFBRBKTnihZYmYvAbujVjXKj%2Fq4x4cU%2FkmHbw68EFf5i%2F9trqx2%2BpJGINvw%2FgKkDUr95BNgueVjZM3A6yvRvcd4WlqNSYajYkdlTVS%2BRQadyL2AmSFiNhPIbGWctJEkNAtk%2BF82sobujb9DVFbEva4F7Dp51LaDQNSduLV6xw102WodsChI10QcdRTeww9iZ0yndvlMsMIP%2Boyzmi8aVU5R1Wul%2FbZy%2FLBEgvFpGJm14KwbAuIrtAD%2F3L8n0K1Ub%2Bhyd1uDb2UbjH6%2FmEzLjVJ5Snkj8IWMaTRDYtKnDVroQVgtT4pODGQ5BAPziJF7H4yGcFNnbXnjIza6qx7hHknyEU7x5JH5k9iDLN1CjJlqWIR3Tu5EQscNBKWplQ5%2FfMjrAO9g7NW%2Fm4AAhLUxIE6pQAQGFYqNTY52XSXrT0BNbLuGqEp3ebrEA1vDFjK4vdJKHeepYW0Qm5PIpyJcutkaVOLmO3ISSwtpyzG13fL%2B7qnYiKRFaL4TmB5Og39XNoPepQYzyf9o8T82MXFm50lgv5hYgXlgrtASIghtfTlBHCEP5rYdCjLNd5SSKzLsJeSzq2edh6sFEq5YbQuSQBoP8ycxn3WPLi0WxHEjKVOO%2B31BeLBjFMKfH5bKFf7NDccTkESmkPD3ds1ep3UJRNMlqlB565t0Pxy4RZs61AsmsEvdCS6P8fKFamd0qqd5sJmTGaTA2KHKWDVar0fxQSmgeaSRtl5gipqXwp3e%2FvQl%2F7W8MoYPMd%2Fck9CaymF3Te9GTtkYi51aQvmtBSxzzg%2FxB3N5Gxv003DeW%2FTTY%2BdimYv33Pwtf3dyPZ1fpcLL%2F8G#%7B%22pageId%22%3A%22K0AqEqVVdicwrlIVKQc0%22%7D)<br />
[Visual Guide](https://www.builder.io/blog/visual-guide-to-nodejs-event-loop)

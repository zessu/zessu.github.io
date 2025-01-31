---
title: 'Tail Call Optimization Javascript'
description: 'Tail Call Optimization Javascript'
pubDate: 'Oct 24 2023'
---

In *JavaScript*, **Tail Call Optimization** is an optimization technique used by some JavaScript engines to make recursive function calls more memory-efficient. To understand *TCO*, you first need to be familiar with a few concepts:

**Recursion**: Recursion is a programming technique where a function calls itself to solve a problem. Recursive functions can be powerful but may lead to stack overflow errors if not optimized, especially for deep recursive calls.

**Call Stack**: JavaScript uses a call stack to keep track of function calls. Each time a function is called, a new frame is added to the stack, and when the function returns, the frame is removed. Deep recursive calls can fill up the call stack and lead to stack overflow errors.

**Tail Call**: A tail call occurs when a function’s last action is to call another function. In other words, it’s a function call that appears at the end of another function. Tail calls are significant in the context of TCO.

**Tail Call Optimization** (TCO) is an optimization technique that eliminates the need to create a new stack frame for a function call when the call is in a tail position. Instead of adding a new frame to the call stack, *TCO* reuses the current frame, making the process more memory-efficient and preventing stack overflow errors for deep recursion.

Here’s an example to illustrate TCO:

```javascript
function factorial(n, accumulator = 1) {
 if(n === 0 ) return accumulator;
  return factorial(n-1, accumulator * n);
} 
```

In this example, the factorial function calculates the factorial of a number using a *tail-recursive approach*. The recursive call occurs in the tail position, and modern JavaScript engines that support *TCO* will optimize it to prevent excessive stack usage.

This is how the data is passed as an example calculating 5!

```console.log(factorial(5))```

```javascript
5,1 => 4,5
4,5 => 3, 20
3,20 => 2, 60
2,60 => 1, 120
1,120 => 0, 120
```

As you can seem we accumulate the value of n*1 from n to 1 avoiding creation of new stack frames with each request. This uses less memory as each new call passes all required data and does not create a new call slack.

This feature is however not shipped in all browsers, only safari with Edge Chrome and Firefox not agreeing on a standard way to ship it.

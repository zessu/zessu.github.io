---
title: 'Floating point Arithmetic IEEE 754'
description: 'Why 0.1 + 0.2 = 0.30000000000000004'
pubDate: 'Jan 31 2025'
---

Why is the result of `0.1 + 0.2` `0.30000000000000004` instead of `0.3`?

To understand this we need to cover some preliminaries first. Human beings tend to think in decimal, and its' obvious to us that 0.1 + 0.2 = 0.3. However, computers represent numbers in binary.

In any number system e.g *base 10, base 2*, fractions are represented as sums of powers of the base.
In base 10, fractions are powers of 10 10 e.g 3/10 = 3*10^-1
In base 2, fractions are sums powers of 2. e.g 1/2 = 1*2^-1

Here's a general rule, **a fraction in any number system can be represented accurately if the denominator of the fraction has prime factors that are also [prime factors](https://byjus.com/maths/prime-factorization/) of the base.**

*1/2, 1/4, 1/5, 1/10* can be represented accurately in **base 10** because the denominators 2, 4, 5, 10 include prime factors of 10(2&5) while 1/3 or 1/7 or 1/6 cannot.

*1/2* can be represented perfectly in binary but *1/10* cannot. The denominator 10, has prime factors 2 and 5, 2 is present in the factors of 2 i.e only 2 but 5 is not. Because of this, there will be some recursion when trying to represent 1/10 in binary.

To convert `0.1` to binary, we repeatedly multiply the fractional part by `2` and take the integer part of the result as the next binary digit. [How to convert Decimal to Binary](https://www.youtube.com/shorts/RBt2vtcPsC8))
    1. `0.1 × 2 = 0.2` → integer part = `0`, fractional part = `0.2`
    2. `0.2 × 2 = 0.4` → integer part = `0`, fractional part = `0.4`
    3. `0.4 × 2 = 0.8` → integer part = `0`, fractional part = `0.8`
    4. `0.8 × 2 = 1.6` → integer part = `1`, fractional part = `0.6`
    5. `0.6 × 2 = 1.2` → integer part = `1`, fractional part = `0.2`
    6. `0.2 × 2 = 0.4` → integer part = `0`, fractional part = `0.4`
    7. `0.4 × 2 = 0.8` → integer part = `0`, fractional part = `0.8`
    8. `0.8 × 2 = 1.6` → integer part = `1`, fractional part = `0.6`
    9. And so on...

 This recursion has to be approximated because computers have limited memory and have to use a certain number of bits to represent integers or a floats e.g *64 bits*. Same way humans round 1/3(base 10) to something like 0.333.

0.1 in binary works out to about **00001100110011001100110011001100110011001100110011** but we know computers store numbers in memory as 0000 no decimal points, just a 0 or a 1 in the memory location. Assuming 8 bits, we would represent 1 & 2 as:

```typescipt
1 -> 0000 0001
2 -> 0000 0010
```

So how do we represent a number like 0.000001?

There's a standard for how computers represent floating point numbers [IEEE 754]([IEEE754.PDF](https://people.eecs.berkeley.edu/~wkahan/ieee754status/IEEE754.PDF)).  This standard works by dividing floating numbers into three parts: **A sign bit, 11 exponent bits and 52 mantissa bits.**

The sign bit represents whether the number is *+ve or -ve*, the exponent represents how many times we should move the decimal to the right side of the mantissa, the mantissa represents the floating point bit.

The binary representation of 0.1 `0.0001100110011001100110011001100110011001100110011`

Using IEEE754 standard we store this as:

```typescript
sign bit : 0
exponent: -4 + 1024 = 1019 = 01111111011 (in binary)
mantissa = 1001100110011001100110011001100110011001100110011010
```

The 1024 is added to the exponent. It's called a biased exponent and helps computers simplify calculations. For why they chose this over two's complement read [ieee 754 - Why do we bias the exponent of a floating-point number? - Stack Overflow](https://stackoverflow.com/questions/19864749/why-do-we-bias-the-exponent-of-a-floating-point-number)

So the *IEEE754* number interpreted gives
`1.1001100110011001100110011001100110011001100110011010 * 2^-4`
which is approximately
`0.1000000000000000055511151231257827021181583404541015625`

hence why **0.1+0.2=0.30000000000000004**

If you need to handle floating point arithmetic accurately use libraries like [Decimal.js: An arbitrary-precision Decimal type for JavaScript](https://github.com/MikeMcl/decimal.js/)

#### References

---
[Floating Point Numbers - Computerphile](https://www.youtube.com/watch?v=PZRI1IfStY0)
[IEEE-754 Floating Point Converter](https://www.h-schmidt.net/FloatConverter/IEEE754.html)
[Prime Factorization - Definition, Methods, Examples, Prime Factorize](https://byjus.com/maths/prime-factorization/)
[IEEE Standard 754 Floating Point Numbers - GeeksforGeeks](https://www.geeksforgeeks.org/ieee-standard-754-floating-point-numbers/)
[IEEE754.PDF](https://people.eecs.berkeley.edu/~wkahan/ieee754status/IEEE754.PDF)
[(3) Decimal Fraction to Binary Convert - YouTube](https://www.youtube.com/shorts/RBt2vtcPsC8)
[ieee 754 - Why do we bias the exponent of a floating-point number? - Stack Overflow](https://stackoverflow.com/questions/19864749/why-do-we-bias-the-exponent-of-a-floating-point-number)

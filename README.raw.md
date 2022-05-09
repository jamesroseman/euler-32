# How to Run

Install dependencies.

`npm install`

Run the solution test cases.

`npm test`

Run the code to see output for a 9-digit pandigital combination solution.

`npm start`

# Problem Statement

[Project Euler #32](https://projecteuler.net/problem=32)

```
We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once; for example, the 5-digit number, 15234, is 1 through 5 pandigital.

The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier, and product is 1 through 9 pandigital.

Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.

HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.
```

# Solution

```
4 * 1738 = 6952
4 * 1963 = 7852
12 * 483 = 5796
18 * 297 = 5346
28 * 157 = 4396
39 * 186 = 7254
48 * 159 = 7632

The total sum: 45228
```

# The Proof

## Assumptions

Consider constant-time function `getNumDigits(n)` that returns the amount of digits in natural number `x`. 

* e.g. `getNumDigits(10)` would be 2, as there are 2 digits in 10 (1 and 0).

Consider `a` and `b` such that `a * b === c`.

Consider`abDigits` such that `abDigits === getNumDigits(a) + getNumDigits(b)`.

Provided with the desired number of digits $X$ in a multiplier/multiplicand/product combination, the multiplier/multiplicand will always have a total of $\frac{X}{2}$ digits if $X$ is even, and $\frac{X+1}{2}$ digits if $X$ is odd. The work for this is at the bottom of this document, under the heading **Additional Work**. It's sufficient for this solution to know that this is always the case. 

## Solving the Problem

```
Suppose: X = 9

getNumDigits(a) + getNumDigits(b) = (9 + 1) / 2 = 5
```

There are two options for the distribution of digits between `a` and `b` such that they have 5 combined digits.

```
Either: getNumDigits(a) === 1 && getNumDigits(b) === 4
Or:     getNumDigits(a) === 2 && getNumDigits(b) === 3
```

*Note: If `a` has more digits than `b`, we just swap their names because it's equivalent. `a` should always be smaller than `b`.*

This is equivalent to:

```
Either: (1 ≤ a ≤ 9)   && (1000 ≤ b ≤ 9999)
Or:     (10 ≤ a ≤ 99) && (100 ≤ b ≤ 999)
```

#### Pseudocode

The most straightforward solution is the following generalized pseudocode:

```javascript
// Set the desired number of total digits
x = 9

// Get the list of digits in "a", either x/2 or (x+1)/2 
// e.g. [1, 2]
aDigitsArr = getADigitsArr(x);

// Get the list of digits in "b", (x - "a")
// e.g. [4, 3]
bDigitsArr = getBDigitsArr(x);

for (aDigits, bDigits):
  // Get the max and min values of "a" and "b"
  // e.g. 1, 9, 1000, 9999
  { minAValue, maxAValue, minBValue, maxBValue } = getValues({ aDigits, bDigits });
  // Iterate through the "a" range and "b" range
  for (a in range(minAValue, maxAValue)):
    for (b in range(minBValue, maxBValue)):
      c = a * b;
      if (isPandigital(a, b, c) and isUnseenProduct(c)):
        addProductToSum(c);
```

#### Final Code Solution

Here is the final working solution for this problem:

```javascript
function getPandigitalSums(x, verbose) {
  var abDigits = getNumABDigits(x);
  var aDigitsArr = [];
  var bDigitsArr = [];
  var sumOfProducts = 0;
  // Find every pairing on a-digits and b-digits.
  for (let i=1; i<=abDigits/2; i++) {
    aDigitsArr.push(i);
    bDigitsArr.push(abDigits - i);
  }
  // For every pairing, find all pandigital sums.
  for (let i=0; i<aDigitsArr.length; i++) {
    var aDigits = aDigitsArr[i];
    var bDigits = bDigitsArr[i];
    sumOfProducts += getPandigitalSumsFromABDigits(aDigits, bDigits, x, verbose);
  }
  return sumOfProducts;
}
```

The most important function for this solution is `getPandigitalSumsFromABDigits` which, provided the number of digits in `a`, the number of digits in `b`, and the desired number of digits in the multiplicand/multiplier/product combination `x`, returns the sum of unique x-digit pandigital products:

```javascript
function getPandigitalSumsFromABDigits(aDigits, bDigits, x, verbose) {
  var sumOfProducts = 0;
  var productsMap = {};
  
  // Calculate the min/max ranges of a and b.
  var minAValue = Math.pow(10, aDigits - 1);
  var maxAValue = Math.pow(10, aDigits) - 1;
  var minBValue = Math.pow(10, bDigits - 1);
  var maxBValue = Math.pow(10, bDigits) - 1;

  // Iterate through the nested ranges, finding new pandigital combos.
  for (let a=minAValue; a<=maxAValue; a++) {
    for (let b=minBValue; b<=maxBValue; b++) {
      var c = a * b;
      if (isPandigitalCombo(a, b, c, x) && !productsMap.hasOwnProperty(c)) {
        if (verbose) {
          console.log(`${a} * ${b} = ${c}   (${x} total digits)`);
        }
        sumOfProducts += c;
        productsMap[c] = true;
      }
    }
  }
  return sumOfProducts;
}
```

Calling `getPandigitalSums(9, true)` returns the following:

```
4 * 1738 = 6952   (9 total digits)
4 * 1963 = 7852   (9 total digits)
12 * 483 = 5796   (9 total digits)
18 * 297 = 5346   (9 total digits)
28 * 157 = 4396   (9 total digits)
39 * 186 = 7254   (9 total digits)
48 * 159 = 7632   (9 total digits)

The total sum: 45228
```

The full code can be found in `solution.js`.

#### Performance

A very simplistic brute force attempt to find a solution to this problem might look like:

```
for (a in range(1, 999999999)):
  for (b in range(1, 999999999)):
    c = a * b;
    if (isPandigital(a, b, c, 9)): 
      addToSum(c);
```

The amount of pandigital comparisons for this solution is:
* $999999999 * 999999999$
* $\approx 10^{18}$

By leveraging the proof below and bounding `a` to be less than `b`, we can settle on the correct amount of digits for `a` and `b` upfront, and therefore reduce the necessary amount of comparisons.

```
for (a in ranges([1, 9], [10, 99])):
  for (b in ranges([1000, 9999], [100, 999])):
    c = a * b;
    if (isPandigital(a, b, c, 9)): 
      addToSum(c);
```

The amount of pandigital comparisons reduces to:
* $((9 - 1 + 1) * (9999 - 1000 + 1)) + ((99 - 10 + 1) * (999 - 100 + 1))$
* $= 162,000$

##### Excepting `a` and `b` values which contain repeating digits

We can check if any number has repeated digits in the following way:

```
digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (digit in n):
  if (digits[digit] > 0): return true;
  digits[digit] += 1;
```

This takes at most 10 comparisons to check if a number has repeating digits. If `a` contains any repeated digits, or `b` contains any repeated digits (or digits found in `a`), we can skip the pandigital comparison. We can leverage this constant-time repeated digit function:

```
for (a in ranges([1, 9], [10, 99])):
  if (!hasRepeatedDigits(a)):
    for (b in ranges([1000, 9999], [100, 999])):
      if (!hasRepeatedDigits(b)):
        c = a * b;
        if (isPandigital(a, b, c, 9)): 
          addToSum(c);
```

It's worth noting that by checking the repeated digits, we have to do $\approx 150,000$ constant-time number comparisons. If we run the new code and track iterations, calls to our repeated digit function, and calls to the pandigital comparator:
* $153,900 \text{ iterations}$
* $153,999 \text{ repeated digit function calls}$
* $48,384 \text{ pandigital comparisons}$
* $202,382 \text{ function calls}$

Now, removing our calls to the repeated digit function:
* $162,000 \text{ iterations}$
* $0 \text{ repeated digit function calls}$
* $162,000 \text{ pandigital comparisons}$
* $162,000 \text{ function calls}$

Our `isPandigital` function leverages a `isPandigitalNumber` function, which performs the following logic:

```
numDigits = Math.floor(Math.log10(n)) + 1;
if (numDigits > 9): return false;
digits = Array(numDigits + 1).fill(0);
for (digit in n):
  if (digit === 0 || digit >= digits.length || digits[digit] > 0): return false;
  digits[digit] += 1;
return true;
```

This logic is incredibly similar to `hasRepeatedDigit` with one exception: in this function we create our digits existence map from the number of digits in the number we're checking. An existence map for 111 would be `[0, 0, 0]`. Any digit found in 111 that was $\geq$ 2 would result in a false result. Similarly, any repeating digit would also result in a false result. Because there can only be up to a 9-digit pandigital (because in base 10 there are only 9 valid digits, as the definition in the problem statement excludes 0), we can exit early on any number which is greater than 9 digits. Therefore, this function will loop a maximum of 9 times. We can think of it as a constant function, much like `hasRepeatedDigit`.

So, though common logic might dictate that an optimized approach is to only loop through `b` values if there are no repeated digits in `a`, and to only make pandigital comparisons on `a` and `b` if there are no repeated digits in `b`, it is actually marginally more efficient to check them all to avoid repeating work.

# Additional Work

## Number of Digits in a Multiplicand/Multiplier Given X

*Note: Consider $\lfloor x \rfloor$ as notation for "floor of $x$". e.g. $\lfloor 4.83 \rfloor = 4$*

The number of digits $D$ in a natural number $c$ can always be expressed as: 

$$D(c) = \lfloor log_{10}c \rfloor + 1$$

For simplicity, we can remove the "floor" by introducing a bounded variable $\theta_c \in [0,1)$, which represents the subtrahend required to "floor" the number:

$$D(c) = log_{10}c - \theta_c + 1$$

Suppose $a * b = c$ such that $a \leq b$. The number of digits $D$ in $c$ can then be expressed:

$$D(c) = \lfloor log_{10}ab \rfloor + 1$$

Which reduces to:

$$D(c) = \lfloor log_{10}a + log_{10}b \rfloor + 1$$

Or, for simplicity, where $\theta_{ab} \in [0, 1)$:

$$D(c) = log_{10}a + log_{10}b - \theta_{ab} + 1$$

$\theta_{ab}$ represents the subtrahend required to "floor" $log_{10}a + log_{10}b$. It will be equivalent to $\theta_a + \theta_b$ for all cases except when $\theta_a + \theta_b \geq 1$, when the original "floor" would have removed the 1. 

$$ D(c) =  \left\{
\begin{array}{ll}
      log_{10}a + log_{10}b - (\theta_a + \theta_b) + 1, & \theta_a + \theta_b < 1 \\
      log_{10}a + log_{10}b - (\theta_a + \theta_b - 1) + 1, & \theta_a + \theta_b \geq 1 \\
\end{array}
\right. $$

Suppose $X$, which is the number of desired digits in $a$, $b$, and $c$ combined.

$$X = D(a) + D(b) + D(c)$$

Using the above substitutions, where $\theta_a \in [0, 1)$, $\theta_b \in [0, 1)$, and  $\theta_{ab} \in [0, 1)$:

$$X = (log_{10}a - \theta_a + 1) + (log_{10}b - \theta_b + 1) + (log_{10}a + log_{10}b - \theta_{ab} + 1)$$

Assuming $\theta_a + \theta_b < 1$, this reduces to:

* $X = (log_{10}a - \theta_a + 1) + (log_{10}b - \theta_b + 1) + (log_{10}a + log_{10}b - \theta_a - \theta_b + 1)$
* $X = 2log_{10}a - 2\theta_a + 2 + 2log_{10}b - 2\theta_b + 1$
* $X + 1 = 2log_{10}a - 2\theta_a + 2 + 2log_{10}b - 2\theta_b + 2$
* $X + 1 = 2(log_{10}a - \theta_a + 1) + 2(log_{10}b - \theta_b + 1)$
* $\frac{X + 1}{2} = (log_{10}a - \theta_a + 1) + (log_{10}b - \theta_b + 1)$
* $\frac{X + 1}{2} = D(a) + D(b)$

Assuming $\theta_a + \theta_b \geq 1$, this reduces to:
* $X = (log_{10}a - \theta_a + 1) + (log_{10}b - \theta_b + 1) + (log_{10}a + log_{10}b - \theta_a - \theta_b + 2)$
* $X = 2log_{10}a - 2\theta_a + 2 + 2log_{10}b - 2\theta_b + 2$
* $X = 2(log_{10}a - \theta_a + 1) + 2(log_{10}b - \theta_b + 1)$
* $\frac{X}{2} = (log_{10}a - \theta_a + 1) + (log_{10}b - \theta_b + 1)$
* $\frac{X}{2} = D(a) + D(b)$

Because a number of digits must be a whole number, and because $\frac{X}{2}$ is only a whole number when $X$ is even, and $\frac{X+1}{2}$ is only a whole number when $X$ is odd, we can conclude that:

$$ D(a) + D(b) =  \left\{
\begin{array}{ll}
      \frac{X}{2}, & X \text{ is even} \\ \\
      \frac{X+1}{2}, & X \text{ is odd} \\
\end{array}
\right. $$

## Number of Digit Possibilities in Multiplicand/Multiplier

The amount of ways $k$ numbers can sum to $n$ is represented:

$$n + k - 1 \choose k - 1$$

This can be rewritten as a factorial:

$$\frac{(n+k-1)!}{n!(k-1)!}$$

The amount of ways $2$ numbers can sum to $x$ is represented:

$$\frac{(n+2-1)!}{n!(2-1)!}$$

Which simplifies to: 

$$\frac{(n+1)!}{n!}$$

The amount of ways $2$ non-zero numbers can sum to $x$ is represented:

$$\frac{(n+1)!}{n!} - 2$$

The amount of ways $2$ non-zero numbers $y$, $z$ can sum to $x$ such that $y \leq z$ is exactly half of the total, or:

$$\frac{\frac{(n+1)!}{n!} - 2}{2}$$

This reduces to:

$$\frac{(n+1)!}{2*n!}-1$$

Suppose the amount of digits in $a$ and $b$ combined are $5$, the total digit possibilities for $a$ and $b$ are:

* $\frac{(5+1)!}{2*5!}-1$
* $\frac{6!}{2*5!}-1$
* $\frac{6!}{2*5!}-1$
* $3 - 1$
* $= 2$
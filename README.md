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

Consider function `isPandigitalCombo(a, b, c)` that returns true if a combination of `a`, `b`, and `c` create a pandigital.

Consider function `getNumDigits(n)` that returns the amount of digits in natural number `x`. 

* e.g. `getNumDigits(10)` would be 2, as there are 2 digits in 10 (1 and 0).

Consider `a` and `b` such that `a * b === c`.

Consider`abDigits` such that `abDigits === getNumDigits(a) + getNumDigits(b)`.

Provided with the desired number of digits X in a multiplier/multiplicand/product combination, the multiplier/multiplicand will always have a total of X/2 digits if X is even, and (X + 1)/2 digits if X is odd. The work for this is at the bottom of this document, under the heading **Additional Work**. It's sufficient for this solution to know that this is always the case. 

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
    if (isPandigital(c, 9)): 
      addToSum(c);
```

The amount of iterations for this solution is:
* 999999999 * 999999999
* ≈ 10^18

By leveraging the proof below and bounding `a` to be less than `b`, we can settle on the correct amount of digits for `a` and `b` upfront, and therefore reduce the necessary amount of iterations.

```
for (a in ranges([1, 9], [10, 99])):
  for (b in ranges([1000, 9999], [100, 999])):
    c = a * b;
    if (isPandigital(c, 9)): 
      addToSum(c);
```

The amount of iterations for this solution is:
* (9 * 9999) + (99 * 999)
* 89,991 + 98,901
* = 188,892
* ≈ 10^5.3


# Additional Work

## Number of Digits in a Multiplicand/Multiplier Given X

*Note: Consider <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Clfloor%20x%20%5Crfloor}}" /> as notation for "floor of <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{x}}" />". e.g. <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Clfloor%204.83%20%5Crfloor%20%3D%204}}" />*

The number of digits <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{D}}" /> in a natural number <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{c}}" /> can always be expressed as: 

<h3 align="center"><img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{D%28c%29%20%3D%20%5Clfloor%20log_%7B10%7Dc%20%5Crfloor%20%2B%201%24%24For%20simplicity%2C%20we%20can%20remove%20the%20%22floor%22%20by%20introducing%20a%20bounded%20variable%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_c%2520%255Cin%2520%255B0%252C1%2529%7D%7D%22%20%2F%3E%2C%20which%20represents%20the%20subtrahend%20required%20to%20%22floor%22%20the%20number%3AD%28c%29%20%3D%20log_%7B10%7Dc%20-%20%5Ctheta_c%20%2B%201%24%24}}" /></h3>



D(c) = log_{10}c - \theta_c + 1$$

Suppose <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{a%20%2a%20b%20%3D%20c}}" /> such that <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{a%20%5Cleq%20b}}" />. The number of digits <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{D}}" /> in <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{c}}" /> can then be expressed:

<h3 align="center"><img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{D%28c%29%20%3D%20%5Clfloor%20log_%7B10%7Dab%20%5Crfloor%20%2B%201%24%24Which%20reduces%20to%3AD%28c%29%20%3D%20%5Clfloor%20log_%7B10%7Da%20%2B%20log_%7B10%7Db%20%5Crfloor%20%2B%201%24%24}}" /></h3>



D(c) = \lfloor log_{10}a + log_{10}b \rfloor + 1$$

Or, for simplicity, where <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Ctheta_%7Bab%7D%20%5Cin%20%5B0%2C%201%29}}" />:

<h3 align="center"><img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{D%28c%29%20%3D%20log_%7B10%7Da%20%2B%20log_%7B10%7Db%20-%20%5Ctheta_%7Bab%7D%20%2B%201%24%24%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_%257Bab%257D%7D%7D%22%20%2F%3E%20represents%20the%20subtrahend%20required%20to%20%22floor%22%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7Blog_%257B10%257Da%2520%252B%2520log_%257B10%257Db%7D%7D%22%20%2F%3E.%20It%20will%20be%20equivalent%20to%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_a%2520%252B%2520%255Ctheta_b%7D%7D%22%20%2F%3E%20for%20all%20cases%20except%20when%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_a%2520%252B%2520%255Ctheta_b%2520%255Cgeq%25201%7D%7D%22%20%2F%3E%2C%20when%20the%20original%20%22floor%22%20would%20have%20removed%20the%201.%20%20D%28c%29%20%3D%20%20%5Cleft%5C%7B}}" /></h3>



 D(c) =  \left\{
\begin{array}{ll}
      log_{10}a + log_{10}b - (\theta_a + \theta_b) + 1, & \theta_a + \theta_b < 1 \\
      log_{10}a + log_{10}b - (\theta_a + \theta_b - 1) + 1, & \theta_a + \theta_b \geq 1 \\
\end{array}
<h3 align="center"><img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Cright.%20Suppose%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%7D%7D%22%20%2F%3E%2C%20which%20is%20the%20number%20of%20desired%20digits%20in%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7Ba%7D%7D%22%20%2F%3E%2C%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7Bb%7D%7D%22%20%2F%3E%2C%20and%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7Bc%7D%7D%22%20%2F%3E%20combined.X%20%3D%20D%28a%29%20%2B%20D%28b%29%20%2B%20D%28c%29%24%24}}" /></h3>



X = D(a) + D(b) + D(c)$$

Using the above substitutions, where <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Ctheta_a%20%5Cin%20%5B0%2C%201%29}}" />, <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Ctheta_b%20%5Cin%20%5B0%2C%201%29}}" />, and  <img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{%5Ctheta_%7Bab%7D%20%5Cin%20%5B0%2C%201%29}}" />:

<h3 align="center"><img src="https://render.githubusercontent.com/render/math?math=\bbox[%230d1117]{\color{white}{X%20%3D%20%28log_%7B10%7Da%20-%20%5Ctheta_a%20%2B%201%29%20%2B%20%28log_%7B10%7Db%20-%20%5Ctheta_b%20%2B%201%29%20%2B%20%28log_%7B10%7Da%20%2B%20log_%7B10%7Db%20-%20%5Ctheta_%7Bab%7D%20%2B%201%29%24%24Assuming%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_a%2520%252B%2520%255Ctheta_b%2520%253C%25201%7D%7D%22%20%2F%3E%2C%20this%20reduces%20to%3A%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%253D%2520%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Da%2520%252B%2520log_%257B10%257Db%2520-%2520%255Ctheta_a%2520-%2520%255Ctheta_b%2520%252B%25201%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%253D%25202log_%257B10%257Da%2520-%25202%255Ctheta_a%2520%252B%25202%2520%252B%25202log_%257B10%257Db%2520-%25202%255Ctheta_b%2520%252B%25201%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%252B%25201%2520%253D%25202log_%257B10%257Da%2520-%25202%255Ctheta_a%2520%252B%25202%2520%252B%25202log_%257B10%257Db%2520-%25202%255Ctheta_b%2520%252B%25202%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%252B%25201%2520%253D%25202%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%25202%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%2520%252B%25201%257D%257B2%257D%2520%253D%2520%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%2520%252B%25201%257D%257B2%257D%2520%253D%2520D%2528a%2529%2520%252B%2520D%2528b%2529%7D%7D%22%20%2F%3EAssuming%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Ctheta_a%2520%252B%2520%255Ctheta_b%2520%255Cgeq%25201%7D%7D%22%20%2F%3E%2C%20this%20reduces%20to%3A%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%253D%2520%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Da%2520%252B%2520log_%257B10%257Db%2520-%2520%255Ctheta_a%2520-%2520%255Ctheta_b%2520%252B%25202%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%253D%25202log_%257B10%257Da%2520-%25202%255Ctheta_a%2520%252B%25202%2520%252B%25202log_%257B10%257Db%2520-%25202%255Ctheta_b%2520%252B%25202%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%2520%253D%25202%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%25202%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%257D%257B2%257D%2520%253D%2520%2528log_%257B10%257Da%2520-%2520%255Ctheta_a%2520%252B%25201%2529%2520%252B%2520%2528log_%257B10%257Db%2520-%2520%255Ctheta_b%2520%252B%25201%2529%7D%7D%22%20%2F%3E%2a%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%257D%257B2%257D%2520%253D%2520D%2528a%2529%2520%252B%2520D%2528b%2529%7D%7D%22%20%2F%3EBecause%20a%20number%20of%20digits%20must%20be%20a%20whole%20number%2C%20and%20because%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%257D%257B2%257D%7D%7D%22%20%2F%3E%20is%20only%20a%20whole%20number%20when%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%7D%7D%22%20%2F%3E%20is%20even%2C%20and%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7B%255Cfrac%257BX%252B1%257D%257B2%257D%7D%7D%22%20%2F%3E%20is%20only%20a%20whole%20number%20when%20%3Cimg%20src%3D%22https%3A%2F%2Frender.githubusercontent.com%2Frender%2Fmath%3Fmath%3D%5Cbbox%5B%25230d1117%5D%7B%5Ccolor%7Bwhite%7D%7BX%7D%7D%22%20%2F%3E%20is%20odd%2C%20we%20can%20conclude%20that%3A%20D%28a%29%20%2B%20D%28b%29%20%3D%20%20%5Cleft%5C%7B}}" /></h3>



















 D(a) + D(b) =  \left\{
\begin{array}{ll}
      \frac{X}{2}, & X \text{ is even} \\ \\
      \frac{X+1}{2}, & X \text{ is odd} \\
\end{array}
\right. 

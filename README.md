#  How to Run
  
  
Install dependencies.
  
`npm install`
  
Run the solution test cases.
  
`npm test`
  
Run the code to see output for a 9-digit pandigital combination solution.
  
`npm start`
  
#  Problem Statement
  
  
[Project Euler #32](https://projecteuler.net/problem=32 )
  
```
We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once; for example, the 5-digit number, 15234, is 1 through 5 pandigital.
  
The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier, and product is 1 through 9 pandigital.
  
Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.
  
HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.
```
  
#  Solution
  
  
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
  
#  The Proof
  
  
##  Assumptions
  
  
Consider constant-time function `getNumDigits(n)` that returns the amount of digits in natural number `x`. 
  
* e.g. `getNumDigits(10)` would be 2, as there are 2 digits in 10 (1 and 0).
  
Consider `a` and `b` such that `a * b === c`.
  
Consider`abDigits` such that `abDigits === getNumDigits(a) + getNumDigits(b)`.
  
Provided with the desired number of digits <img src="https://latex.codecogs.com/gif.latex?X"/> in a multiplier/multiplicand/product combination, the multiplier/multiplicand will always have a total of <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X}{2}"/> digits if <img src="https://latex.codecogs.com/gif.latex?X"/> is even, and <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X+1}{2}"/> digits if <img src="https://latex.codecogs.com/gif.latex?X"/> is odd. The work for this is at the bottom of this document, under the heading **Additional Work**. It's sufficient for this solution to know that this is always the case. 
  
##  Solving the Problem
  
  
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
  
####  Pseudocode
  
  
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
  
####  Final Code Solution
  
  
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
  
####  Performance
  
  
A very simplistic brute force attempt to find a solution to this problem might look like:
  
```
for (a in range(1, 999999999)):
  for (b in range(1, 999999999)):
    c = a * b;
    if (isPandigital(a, b, c, 9)): 
      addToSum(c);
```
  
The amount of pandigital comparisons for this solution is:
* <img src="https://latex.codecogs.com/gif.latex?999999999%20*%20999999999"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;approx%2010^{18}"/>
  
By leveraging the proof below and bounding `a` to be less than `b`, we can settle on the correct amount of digits for `a` and `b` upfront, and therefore reduce the necessary amount of comparisons.
  
```
for (a in ranges([1, 9], [10, 99])):
  for (b in ranges([1000, 9999], [100, 999])):
    c = a * b;
    if (isPandigital(a, b, c, 9)): 
      addToSum(c);
```
  
The amount of pandigital comparisons reduces to:
* <img src="https://latex.codecogs.com/gif.latex?((9%20-%201%20+%201)%20*%20(9999%20-%201000%20+%201))%20+%20((99%20-%2010%20+%201)%20*%20(999%20-%20100%20+%201))"/>
* <img src="https://latex.codecogs.com/gif.latex?=%20162,000"/>
  
#####  Excepting `a` and `b` values which contain repeating digits
  
  
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
  
It's worth noting that by checking the repeated digits, we have to do <img src="https://latex.codecogs.com/gif.latex?&#x5C;approx%20150,000"/> constant-time number comparisons. If we run the new code and track iterations, calls to our repeated digit function, and calls to the pandigital comparator:
* <img src="https://latex.codecogs.com/gif.latex?153,900%20&#x5C;text{%20iterations}"/>
* <img src="https://latex.codecogs.com/gif.latex?153,999%20&#x5C;text{%20repeated%20digit%20function%20calls}"/>
* <img src="https://latex.codecogs.com/gif.latex?48,384%20&#x5C;text{%20pandigital%20comparisons}"/>
* <img src="https://latex.codecogs.com/gif.latex?202,382%20&#x5C;text{%20function%20calls}"/>
  
Now, removing our calls to the repeated digit function:
* <img src="https://latex.codecogs.com/gif.latex?162,000%20&#x5C;text{%20iterations}"/>
* <img src="https://latex.codecogs.com/gif.latex?0%20&#x5C;text{%20repeated%20digit%20function%20calls}"/>
* <img src="https://latex.codecogs.com/gif.latex?162,000%20&#x5C;text{%20pandigital%20comparisons}"/>
* <img src="https://latex.codecogs.com/gif.latex?162,000%20&#x5C;text{%20function%20calls}"/>
  
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
  
This logic is incredibly similar to `hasRepeatedDigit` with one exception: in this function we create our digits existence map from the number of digits in the number we're checking. An existence map for 111 would be `[0, 0, 0]`. Any digit found in 111 that was <img src="https://latex.codecogs.com/gif.latex?&#x5C;geq"/> 2 would result in a false result. Similarly, any repeating digit would also result in a false result. Because there can only be up to a 9-digit pandigital (because in base 10 there are only 9 valid digits, as the definition in the problem statement excludes 0), we can exit early on any number which is greater than 9 digits. Therefore, this function will loop a maximum of 9 times. We can think of it as a constant function, much like `hasRepeatedDigit`.
  
So, though common logic might dictate that an optimized approach is to only loop through `b` values if there are no repeated digits in `a`, and to only make pandigital comparisons on `a` and `b` if there are no repeated digits in `b`, it is actually marginally more efficient to check them all to avoid repeating work.
  
#  Additional Work
  
  
##  Number of Digits in a Multiplicand/Multiplier Given X
  
  
*Note: Consider <img src="https://latex.codecogs.com/gif.latex?&#x5C;lfloor%20x%20&#x5C;rfloor"/> as notation for "floor of <img src="https://latex.codecogs.com/gif.latex?x"/>". e.g. <img src="https://latex.codecogs.com/gif.latex?&#x5C;lfloor%204.83%20&#x5C;rfloor%20=%204"/>*
  
The number of digits <img src="https://latex.codecogs.com/gif.latex?D"/> in a natural number <img src="https://latex.codecogs.com/gif.latex?c"/> can always be expressed as: 
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20&#x5C;lfloor%20log_{10}c%20&#x5C;rfloor%20+%201"/></p>  
  
  
For simplicity, we can remove the "floor" by introducing a bounded variable <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_c%20&#x5C;in%20[0,1)"/>, which represents the subtrahend required to "floor" the number:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20log_{10}c%20-%20&#x5C;theta_c%20+%201"/></p>  
  
  
Suppose <img src="https://latex.codecogs.com/gif.latex?a%20*%20b%20=%20c"/> such that <img src="https://latex.codecogs.com/gif.latex?a%20&#x5C;leq%20b"/>. The number of digits <img src="https://latex.codecogs.com/gif.latex?D"/> in <img src="https://latex.codecogs.com/gif.latex?c"/> can then be expressed:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20&#x5C;lfloor%20log_{10}ab%20&#x5C;rfloor%20+%201"/></p>  
  
  
Which reduces to:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20&#x5C;lfloor%20log_{10}a%20+%20log_{10}b%20&#x5C;rfloor%20+%201"/></p>  
  
  
Or, for simplicity, where <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_{ab}%20&#x5C;in%20[0,%201)"/>:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20log_{10}a%20+%20log_{10}b%20-%20&#x5C;theta_{ab}%20+%201"/></p>  
  
  
<img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_{ab}"/> represents the subtrahend required to "floor" <img src="https://latex.codecogs.com/gif.latex?log_{10}a%20+%20log_{10}b"/>. It will be equivalent to <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_a%20+%20&#x5C;theta_b"/> for all cases except when <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_a%20+%20&#x5C;theta_b%20&#x5C;geq%201"/>, when the original "floor" would have removed the 1. 
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(c)%20=%20%20&#x5C;left&#x5C;{&#x5C;begin{array}{ll}%20%20%20%20%20%20log_{10}a%20+%20log_{10}b%20-%20(&#x5C;theta_a%20+%20&#x5C;theta_b)%20+%201,%20&amp;%20&#x5C;theta_a%20+%20&#x5C;theta_b%20&lt;%201%20&#x5C;&#x5C;%20%20%20%20%20%20log_{10}a%20+%20log_{10}b%20-%20(&#x5C;theta_a%20+%20&#x5C;theta_b%20-%201)%20+%201,%20&amp;%20&#x5C;theta_a%20+%20&#x5C;theta_b%20&#x5C;geq%201%20&#x5C;&#x5C;&#x5C;end{array}&#x5C;right."/></p>  
  
  
Suppose <img src="https://latex.codecogs.com/gif.latex?X"/>, which is the number of desired digits in <img src="https://latex.codecogs.com/gif.latex?a"/>, <img src="https://latex.codecogs.com/gif.latex?b"/>, and <img src="https://latex.codecogs.com/gif.latex?c"/> combined.
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?X%20=%20D(a)%20+%20D(b)%20+%20D(c)"/></p>  
  
  
Using the above substitutions, where <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_a%20&#x5C;in%20[0,%201)"/>, <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_b%20&#x5C;in%20[0,%201)"/>, and  <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_{ab}%20&#x5C;in%20[0,%201)"/>:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?X%20=%20(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%20(log_{10}b%20-%20&#x5C;theta_b%20+%201)%20+%20(log_{10}a%20+%20log_{10}b%20-%20&#x5C;theta_{ab}%20+%201)"/></p>  
  
  
Assuming <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_a%20+%20&#x5C;theta_b%20&lt;%201"/>, this reduces to:
  
* <img src="https://latex.codecogs.com/gif.latex?X%20=%20(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%20(log_{10}b%20-%20&#x5C;theta_b%20+%201)%20+%20(log_{10}a%20+%20log_{10}b%20-%20&#x5C;theta_a%20-%20&#x5C;theta_b%20+%201)"/>
* <img src="https://latex.codecogs.com/gif.latex?X%20=%202log_{10}a%20-%202&#x5C;theta_a%20+%202%20+%202log_{10}b%20-%202&#x5C;theta_b%20+%201"/>
* <img src="https://latex.codecogs.com/gif.latex?X%20+%201%20=%202log_{10}a%20-%202&#x5C;theta_a%20+%202%20+%202log_{10}b%20-%202&#x5C;theta_b%20+%202"/>
* <img src="https://latex.codecogs.com/gif.latex?X%20+%201%20=%202(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%202(log_{10}b%20-%20&#x5C;theta_b%20+%201)"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X%20+%201}{2}%20=%20(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%20(log_{10}b%20-%20&#x5C;theta_b%20+%201)"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X%20+%201}{2}%20=%20D(a)%20+%20D(b)"/>
  
Assuming <img src="https://latex.codecogs.com/gif.latex?&#x5C;theta_a%20+%20&#x5C;theta_b%20&#x5C;geq%201"/>, this reduces to:
* <img src="https://latex.codecogs.com/gif.latex?X%20=%20(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%20(log_{10}b%20-%20&#x5C;theta_b%20+%201)%20+%20(log_{10}a%20+%20log_{10}b%20-%20&#x5C;theta_a%20-%20&#x5C;theta_b%20+%202)"/>
* <img src="https://latex.codecogs.com/gif.latex?X%20=%202log_{10}a%20-%202&#x5C;theta_a%20+%202%20+%202log_{10}b%20-%202&#x5C;theta_b%20+%202"/>
* <img src="https://latex.codecogs.com/gif.latex?X%20=%202(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%202(log_{10}b%20-%20&#x5C;theta_b%20+%201)"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X}{2}%20=%20(log_{10}a%20-%20&#x5C;theta_a%20+%201)%20+%20(log_{10}b%20-%20&#x5C;theta_b%20+%201)"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X}{2}%20=%20D(a)%20+%20D(b)"/>
  
Because a number of digits must be a whole number, and because <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X}{2}"/> is only a whole number when <img src="https://latex.codecogs.com/gif.latex?X"/> is even, and <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{X+1}{2}"/> is only a whole number when <img src="https://latex.codecogs.com/gif.latex?X"/> is odd, we can conclude that:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?D(a)%20+%20D(b)%20=%20%20&#x5C;left&#x5C;{&#x5C;begin{array}{ll}%20%20%20%20%20%20&#x5C;frac{X}{2},%20&amp;%20X%20&#x5C;text{%20is%20even}%20&#x5C;&#x5C;%20&#x5C;&#x5C;%20%20%20%20%20%20&#x5C;frac{X+1}{2},%20&amp;%20X%20&#x5C;text{%20is%20odd}%20&#x5C;&#x5C;&#x5C;end{array}&#x5C;right."/></p>  
  
  
##  Number of Digit Possibilities in Multiplicand/Multiplier
  
  
The amount of ways <img src="https://latex.codecogs.com/gif.latex?k"/> numbers can sum to <img src="https://latex.codecogs.com/gif.latex?n"/> is represented:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?n%20+%20k%20-%201%20&#x5C;choose%20k%20-%201"/></p>  
  
  
This can be rewritten as a factorial:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(n+k-1)!}{n!(k-1)!}"/></p>  
  
  
The amount of ways <img src="https://latex.codecogs.com/gif.latex?2"/> numbers can sum to <img src="https://latex.codecogs.com/gif.latex?n"/> is represented:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(n+2-1)!}{n!(2-1)!}"/></p>  
  
  
Which simplifies to: 
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(n+1)!}{n!}"/></p>  
  
  
The amount of ways <img src="https://latex.codecogs.com/gif.latex?2"/> non-zero numbers can sum to <img src="https://latex.codecogs.com/gif.latex?n"/> is <img src="https://latex.codecogs.com/gif.latex?2"/> less than this (removing the possibility that either number is zero). This is represented:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(n+1)!}{n!}%20-%202"/></p>  
  
  
The amount of ways <img src="https://latex.codecogs.com/gif.latex?2"/> non-zero numbers <img src="https://latex.codecogs.com/gif.latex?y"/>, <img src="https://latex.codecogs.com/gif.latex?z"/> can sum to <img src="https://latex.codecogs.com/gif.latex?n"/> such that <img src="https://latex.codecogs.com/gif.latex?y%20&#x5C;leq%20z"/> is exactly half of the total, or:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{&#x5C;frac{(n+1)!}{n!}%20-%202}{2}"/></p>  
  
  
This reduces to:
  
<p align="center"><img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(n+1)!}{2*n!}-1"/></p>  
  
  
Suppose the amount of digits in <img src="https://latex.codecogs.com/gif.latex?a"/> and <img src="https://latex.codecogs.com/gif.latex?b"/> combined are <img src="https://latex.codecogs.com/gif.latex?5"/>, then the total digit possibilities for <img src="https://latex.codecogs.com/gif.latex?a"/> and <img src="https://latex.codecogs.com/gif.latex?b"/> are:
  
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{(5+1)!}{2*5!}-1"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{6!}{2*5!}-1"/>
* <img src="https://latex.codecogs.com/gif.latex?&#x5C;frac{6!}{2*5!}-1"/>
* <img src="https://latex.codecogs.com/gif.latex?3%20-%201"/>
* <img src="https://latex.codecogs.com/gif.latex?=%202"/>
  
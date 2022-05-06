/**
 * Dereferences a number into a set of its digits. The length of this set is not
 * necessarily the number of digits in a number. (222222 => { 2 })
 * 
 * @param {*} n The number being dereferenced.
 * @returns A set of all digits in the number.
 */
function getDigits(n) {
  const digits = [];
  while (n > 0) {
    digits.unshift(n % 10);
    n = Math.trunc(n / 10);
  }
  return new Set(digits);
}

/**
 * Gets the number of digits from a number. (222222 => 6)
 * 
 * @param {*} n The number whose number of digits are being returned.
 * @returns The number of digits in n.
 */
 function getNumDigits(n) {
  return `${n}`.length;
}

/**
 * Tests whether or not a number is pandigital.
 * 
 * @param {*} n The natural number being tested.
 * @returns True if n is pandigital, false otherwise.
 */
function isPandigital(n) {
  var digits = getDigits(n);
  var numDigits = getNumDigits(n);
  // Iterate through the digits and create an existence map.
  var digitsMap = Array.from(digits).reduce(
    (map, digit) => ({
      ...map,
      [digit]: true,
    }),
    {}
  );
  // Iterate through the range from 1-numDigits and check
  // for existence.
  for (let i=1; i<=numDigits; i++) {
    if (!digitsMap.hasOwnProperty(i)) {
      return false;
    } else {
      delete digitsMap[i];
    }
  }
  return true;
}

/**
 * Tests whether or not a combination of multiplicand, multiplier, and product 
 * is pandigital.
 * 
 * @param {*} a The multiplicand being tested
 * @param {*} b The multiplier being tested
 * @param {*} c The product being tested
 * @param {*} x The desired total number of digits
 * @returns True if the combination is pandigital, false otherwise.
 */
function isPandigitalCombo(a, b, c, x) {
  var combinationStr = `${a}${b}${c}`;
  var combination = parseInt(combinationStr, 10);
  return combinationStr.length === x && isPandigital(combination);
}

/**
 * Returns the number of digits that should be shared between
 * a and b, given the total number of digits expected among 
 * a, b, and c.
 * 
 * @param {*} x The total number of expected digits.
 * @returns The number of digits that should be shared between a and b. 
 */
function getNumABDigits(x) {
  return x % 2 === 0
  ? x / 2
  : (x + 1) / 2;
} 

/**
 * Returns the sum of all x-digit pandigital products, provided the 
 * desired amount of digits in a and b.
 * 
 * @param {*} aDigits The number of desired digits in a.
 * @param {*} bDigits The number of desired digits in b.
 * @param {*} x The number of desired digits in a, b, and c combined.
 * @returns The sum of unique x-digit pandigital products for a aDigits-digit a 
 * and bDigits-digit b.
 */
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

/**
 * Returns the sum of all x-digit pandigital products, provided x.
 * 
 * @param {*} x The desired total number of digits in a, b, and c combined.
 * @param {*} verbose Verbose flag for printing every pandigital combination.
 * @returns The sum of unique x-digit pandigital products.
 */
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

module.exports = {
  getDigits,
  getNumDigits,
  isPandigital,
  isPandigitalCombo,
  getNumABDigits,
  getPandigitalSumsFromABDigits,
  getPandigitalSums,
}
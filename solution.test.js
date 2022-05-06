const {
  getDigits,
  getNumDigits,
  isPandigital,
  isPandigitalCombo,
  getNumABDigits,
  getPandigitalSumsFromABDigits,
  getPandigitalSums,
} = require('./solution');

describe('solution', () => {
  describe('getDigits', () => {
    test('should get correct digits', () => {
      const testNumber = 934643245765;
      const expectedDigits = new Set([9, 3, 4, 6, 2, 5, 7]);
      expect(getDigits(testNumber)).toEqual(expectedDigits);
    });
    test('should get correct digits for 1-digit number', () => {
      const testNumber = 1;
      const expectedDigits = new Set([1]);
      expect(getDigits(testNumber)).toEqual(expectedDigits);
    });
  });

  describe('getNumDigits', () => {
    test('should get correct number of digits', () => {
      expect(getNumDigits(1)).toBe(1);
      expect(getNumDigits(48923048023)).toBe(11);
    });
  });

  describe('isPandigital', () => {
    test('should return true for small pandigital number', () => {
      expect(isPandigital(1)).toBe(true);
    });
    test('should return true for big pandigital number', () => {
      expect(isPandigital(918273645)).toBe(true);
    });
    test('should return false for non-pandigital number', () => {
      expect(isPandigital(121)).toBe(false);
      expect(isPandigital(29384756)).toBe(false);
    });
  });

  describe('isPandigitalCombo', () => {
    test('should return true for pandigital combo', () => {
      expect(isPandigitalCombo(39, 186, 7254, 9)).toBe(true);
    });
    test('should return false for non-pandigital combo', () => {
      expect(isPandigitalCombo(38, 186, 7254, 9)).toBe(false);
    });
  });

  describe('getNumABDigits', () => {
    test('should return number of digits in a and b combined', () => {
      expect(getNumABDigits(9)).toBe(5);
      expect(getNumABDigits(8)).toBe(4);
      expect(getNumABDigits(7)).toBe(4);
      expect(getNumABDigits(6)).toBe(3);
      expect(getNumABDigits(5)).toBe(3);
      expect(getNumABDigits(4)).toBe(2);
      expect(getNumABDigits(3)).toBe(2);
    });
  });

  describe('getPandigitalSumsFromABDigits', () => {
    test('should return correct pandigital sums for 1 digit a and b', () => {
      // There is only 1 solution for a 4-digit pandgital product, 4 * 3 = 12
      const expectedSum = 12;
      expect(getPandigitalSumsFromABDigits(1, 1, 4)).toBe(expectedSum);
    });
  });

  describe('getPandigitalSums', () => {
    test('should return correct 4-digit pandigital sums', () => {
      // There is only 1 solution for a 4-digit pandgital product, 4 * 3 = 12
      const expectedSum = 12;
      expect(getPandigitalSums(4)).toBe(expectedSum);
    });
    test('should return correct 9-digit pandigital sums', () => {
      // There are 7 unique solutions for 9-digit pandigital products
      const expectedSum = 45228;
      expect(getPandigitalSums(9)).toBe(expectedSum);
    });
  });
});
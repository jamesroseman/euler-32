const {
  getPandigitalSums,
} = require('./solution');

// Find all unique 9-digit pandigital products.
function main() {
  var sumOfProducts = getPandigitalSums(9, true);
  console.log(`\nThe total sum: ${sumOfProducts}\n`);
}

main();
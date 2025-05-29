const moment = require('moment');

/**
 * Generates a unique loan number in the format: LN-YYYYMMDD-XXXXX
 * where XXXXX is a random 5-digit number
 * 
 * @returns {string} Generated loan number
 */
const generateLoanNumber = () => {
  const datePart = moment().format('YYYYMMDD');
  const randomPart = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  return `LN-${datePart}-${randomPart}`;
};

module.exports = generateLoanNumber;
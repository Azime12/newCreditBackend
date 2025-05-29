
const otpGenerator = require("otp-generator");
const generateNumericOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

module.exports={
    generateNumericOTP,

}
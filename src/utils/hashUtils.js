const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// const hash = async () => {
//   const hashedPassword = await hashPassword("Password@123");
//   console.log("hash", hashedPassword);  // Log the hashed password here
// };

// hash(); 

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };

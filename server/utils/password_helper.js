const bcrypt = require("bcryptjs");

const hash_password = (password) => {
  const salt = bcrypt.genSaltSync();
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

const compare_password = (password, hashed_password) => {
  return bcrypt.compareSync(password, hashed_password);
};

module.exports = {
  hash_password,
  compare_password,
};

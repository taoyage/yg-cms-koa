const jwt = require('jsonwebtoken');
const { security } = require('@config/security');

const generateToken = (uid, scope) => {
  const { secretKey, expiresIn } = security;
  const token = jwt.sign({ uid }, secretKey, { expiresIn });
  return token;
};

module.exports = { generateToken };

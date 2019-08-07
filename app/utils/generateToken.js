const jwt = require('jsonwebtoken');

class Token {
  constructor(secretKey, expiresIn) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  createToke = uid => {
    if (!this.secretKey) {
      throw new Error('密匙不能为空');
    }
    return jwt.sign({ uid }, this.secretKey, { expiresIn: this.expiresIn });
  };

  verifyToken = token => {
    if (!this.secretKey) {
      throw new Error('密匙不能为空');
    }
    let decode;
    try {
      decode = jwt.verify(token, this.secretKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // token已过期 Forbidden
      } else {
        // token不合法
      }
    }
    return decode;
  };
}

module.exports = Token;

// const generateToken = (uid, scope) => {
//   const { secretKey, expiresIn } = security;
//   const token = jwt.sign({ uid }, secretKey, { expiresIn });
//   return token;
// };

// module.exports = { generateToken };

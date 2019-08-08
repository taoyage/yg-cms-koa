const jwt = require('jsonwebtoken');
const { Forbidden, AuthFailed } = require('@core/http-exception');

class Token {
  constructor(secretKey, expiresIn) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  createToken(uid) {
    if (!this.secretKey) {
      throw new Error('密匙不能为空');
    }
    return jwt.sign({ uid }, this.secretKey, { expiresIn: this.expiresIn });
  }

  verifyToken(token) {
    if (!this.secretKey) {
      throw new Error('密匙不能为空');
    }
    let decode;
    try {
      decode = jwt.verify(token, this.secretKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Forbidden('令牌已过期');
      } else {
        throw new AuthFailed('令牌失效');
      }
    }
    return decode;
  }
}

module.exports = Token;

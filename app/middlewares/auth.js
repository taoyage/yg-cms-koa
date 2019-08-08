const jwt = require('jsonwebtoken');
const { security } = require('@config/security');
const { AuthFailed } = require('@core/http-exception');

const parseHeader = ctx => {
  if (!ctx.header || !ctx.header.authorization) {
    throw new AuthFailed('认证失败，请检查请求令牌是否正确');
  }
  const token = ctx.header.authorization;
  const obj = ctx.token.verifyToken(token);
  console.log(obj);
};

const groupRequire = async (ctx, next) => {};

/**
 * 检查用户是否已登录，并验证token
 * @param {*} ctx 
 * @param {*} next 
 */
const loginRequire = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    await parseHeader(ctx);
    await next();
  } else {
    await next();
  }
};

module.exports = {
  groupRequire,
  loginRequire
};

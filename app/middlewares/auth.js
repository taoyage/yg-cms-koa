const jwt = require('jsonwebtoken');
const { security } = require('@config/security');
const { AuthFailed } = require('@core/http-exception');

const verifyToken = () => {};

const parseHeader = ctx => {
  if (!ctx.header || !ctx.header.authorization) {
    throw new AuthFailed('认证失败，请检查请求令牌是否正确');
  }
  const parts = ctx.header.authorization.split(' ');
  if (parts.length === 2) {
    const bearer = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      
    }
  } else {
    throw new AuthFailed('认证失败，请检查请求令牌是否正确');
  }
};

export const groupRequire = async (ctx, next) => {};

export const loginRequire = async (ctx, next) => {};

const { AuthFailed, NotFound } = require('@core/http-exception');
const userModal = require('@models/user');

const parseHeader = async ctx => {
  if (!ctx.header || !ctx.header.authorization) {
    throw new AuthFailed('认证失败，请检查请求令牌是否正确');
  }
  const token = ctx.header.authorization;
  const obj = ctx.token.verifyToken(token);
  const user = await userModal.findOne({ where: { id: obj.uid } });
  if (!user) {
    throw new NotFound('用户不存在，请重新登录');
  }
  ctx.currentUser = user;
};

/**
 * 检查当前用户权限
 * @param {*} ctx
 * @param {*} next
 */
const groupRequired = async (ctx, next) => {
  const { method } = ctx.request;
  const { group_id } = ctx.ctx.currentUser;
  if (method !== 'OPTIONS') {
    await parseHeader(ctx);
    if (!group_id) {
      throw new AuthFailed('您还没有任何权限组，请联系管理员');
    }

  }
};

/**
 * 检查用户是否已登录，并验证token
 * @param {*} ctx
 * @param {*} next
 */
const loginRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    await parseHeader(ctx);
    await next();
  } else {
    await next();
  }
};

module.exports = {
  groupRequired,
  loginRequired
};

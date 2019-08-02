const success = async (ctx, next) => {
  ctx.body = {
    msg: 'ok',
    code: 0,
    request: `${ctx.method} ${ctx.path}`
  };

  ctx.status = 201;
};

module.exports = success;

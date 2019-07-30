const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = {
      msg: '服务器异常',
      code: 999,
      request: `${ctx.method} ${ctx.path}`
    };
    ctx.status = 500;
  }
};

module.exports = catchError;

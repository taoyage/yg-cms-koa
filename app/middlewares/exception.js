const { HttpException } = require('@lib/validator');
const { env } = require('@config/security');

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const isDev = env === 'dev';
    const isHttpException = error instanceof HttpException;

    if (isDev && !isHttpException) {
      throw error;
    }

    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        code: error.code,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.status = error.status;
    } else {
      ctx.body = {
        msg: '服务器异常',
        code: 999,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;

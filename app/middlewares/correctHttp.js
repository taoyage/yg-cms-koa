const correctHttp = async (ctx, next) => {
  ctx.success = function({ msg }) {
    ctx.body = {
      msg: msg || 'ok',
      code: 0
    };
    ctx.status = 201;
  };

  ctx.json = function({ msg, data }) {
    ctx.body = {
      msg: msg || 'ok',
      code: 0,
      data
    };
    ctx.status = 200;
  };

  await next();
};

module.exports = correctHttp;

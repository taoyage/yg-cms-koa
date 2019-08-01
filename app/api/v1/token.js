const Router = require('koa-router');
const User = require('../../models/user');
const { loginType } = require('../../utils/enum');
const generateToken = require('../../utils/generateToken');

const router = new Router({
  prefix: '/api/v1/token'
});

router.post('/', async ctx => {
  const { type } = ctx.request.body;
  let token;
  switch (type) {
    case loginType.MOBILE:
      token = await mobileLogin(ctx.request.body);
      break;
    case loginType.MINI_PROGRAM:
      break;
    default:
      break;
  }
  ctx.body = { token };
});

const mobileLogin = async ({ contact, password }) => {
  const user = await User.verifyUser(contact, password);
  const token = generateToken(user.id);
  return token;
};

module.exports = router;

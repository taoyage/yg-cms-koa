const Router = require('koa-router');
const UserModel = require('@models/user');
const { RegisterValidator, UpdateUserinfoValidator, LoginValidator } = require('@validators/user');
const UserDao = require('@dao/user');
const { loginRequire } = require('@middlewares/auth');

const router = new Router({
  prefix: '/api/v1/user'
});

const userDao = new UserDao();

/**
 * 获取所有用户
 */
router.get('/', async ctx => {
  const user = await User.findAndCountAll();
  ctx.body = user;
});

/**
 * 创建用户
 */
router.post('/', async ctx => {
  const v = await new RegisterValidator().validate(ctx);
  await userDao.createUser(ctx, v);
  ctx.success({
    msg: '用户创建成功'
  });
});

/**
 * 修改用户
 */
router.put('/:id', loginRequire, async ctx => {
  const v = await new UpdateUserinfoValidator().validate(ctx);
  await userDao.updateUser(ctx, v);
  ctx.success({
    msg: '更新用户成功'
  });
});

/**
 * 删除某个用户
 */
router.delete('/', async ctx => {
  ctx.body = 'delete';
});

/**
 * 登录
 */
router.post('/login', async ctx => {
  const v = await new LoginValidator().validate(ctx);
  const user = await UserModel.verify(v.get('body.username'), v.get('body.password'));
  const token = ctx.token.createToken(user.id);
  ctx.json({
    token
  });
});

module.exports = router;

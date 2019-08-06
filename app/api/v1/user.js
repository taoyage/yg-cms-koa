const Router = require('koa-router');
// const User = require('@models/user');
const { RegisterValidator } = require('@validators/user');
const UserDao = require('@dao/user');

const router = new Router({
  prefix: '/api/v1/user'
});

const userDao = new UserDao();

router.get('/', async ctx => {
  const user = await User.findAndCountAll();
  ctx.body = user;
});

/**
 * 创建用户
 */
router.post('/user', async ctx => {
  const v = await new RegisterValidator().validate(ctx);
  await userDao.createUser(ctx, v);
  ctx.success({
    msg: '用户创建成功'
  });
});

/**
 * 修改用户
 */
router.put('/:id', async ctx => {
  ctx.body = 'put';
});

router.delete('/', async ctx => {
  ctx.body = 'delete';
});

router.post('/user/login', async ctx => {});

module.exports = router;

const Router = require('koa-router');
const User = require('@models/user');

const router = new Router({
  prefix: '/api/v1/user'
});

router.get('/', async ctx => {
  const user = await User.findAndCountAll();
  ctx.body = user;
});

router.post('/', async ctx => {
  await User.create(ctx.request.body);
  ctx.body = 'success';
});

router.put('/', async ctx => {
  ctx.body = 'put';
});

router.delete('/', async ctx => {
  ctx.body = 'delete';
});

module.exports = router;

const Router = require('koa-router');
const User = require('../../models/user');

const router = new Router({
  prefix: '/v1/user'
});

router.get('/', async ctx => {
  ctx.body = 'get';
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

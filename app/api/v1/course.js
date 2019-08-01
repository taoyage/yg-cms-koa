const Router = require('koa-router');
const Course = require('../../models/Course');

const router = new Router({
  prefix: '/api/v1/course'
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

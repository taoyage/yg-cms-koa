const Router = require('koa-router');

const router = new Router({
  prefix: '/v1/course'
});

router.get('/', async ctx => {
  ctx.body = 'get';
});

router.post('/', async ctx => {
  ctx.body = 'post';
});

router.put('/', async ctx => {
  ctx.body = 'put';
});

router.delete('/', async ctx => {
  ctx.body = 'delete';
});

module.exports = router;

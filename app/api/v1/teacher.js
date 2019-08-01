const Router = require('koa-router');
const Teacher = require('@models/teacher');

const router = new Router({
  prefix: '/api/v1/teacher'
});

router.get('/', async (ctx, next) => {
  const q = ctx.request.query;
  const teacher = await Teacher.findAndCountAll({ where: q });
  ctx.body = teacher;
});

router.post('/', async (ctx, next) => {
  const { contact } = ctx.request.body;
  await Teacher.verifyContact(contact);
  await Teacher.create(ctx.request.body);
  next();
});

router.put('/', async ctx => {
  ctx.body = 'put';
});

router.delete('/:id', async ctx => {
  ctx.body = 'delete';
});

module.exports = router;

const Router = require('koa-router');

const { CreateGroupValidator } = require('@validators/group');
const GroupDao = require('@dao/group');

const router = new Router({
  prefix: '/api/v1/group'
});

const groupDao = new GroupDao();

router.get('/', async ctx => {});

/**
 * 创建分组
 */
router.post('/', async ctx => {
  const v = await new CreateGroupValidator().validate(ctx);
  await groupDao.createGroup(ctx, v);
  ctx.success({
    msg: '新建分组成功'
  });
});

router.put('/', async ctx => {});

router.delete('/', async ctx => {});

module.exports = router;

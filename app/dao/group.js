const GroupModel = require('@models/group');
const AuthModel = require('@models/auth');
const { ParameterException } = require('@core/http-exception');
const db = require('@core/db');
const auths = require('@config/auths');

class GroupDao {
  async createGroup(ctx, v) {
    const group = await GroupModel.findOne({
      where: {
        name: v.get('body.name')
      }
    });

    if (group) {
      throw new ParameterException('分组已存在，不能创建同名分组');
    }

    let transaction;
    try {
      transaction = await db.transaction();
      const gp = await GroupModel.create(
        {
          name: v.get('body.name'),
          description: v.get('body.description')
        },
        { transaction }
      );

      for (const item of v.get('body.auths')) {
        if (auths.includes(item)) {
          await AuthModel.create(
            { auth: item, group_id: gp.id },
            {
              transaction
            }
          );
        }
      }
      await transaction.commit();
    } catch (err) {
      if (transaction) await transaction.rollback();
    }
    return true;
  }
}

module.exports = GroupDao;

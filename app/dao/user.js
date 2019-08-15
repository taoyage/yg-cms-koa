const UserModel = require('@models/user');
const { ParameterException } = require('@core/http-exception');

class UserDao {
  /**
   * 创建用户
   * @param {*} ctx
   * @param {*} v
   */
  async createUser(ctx, v) {
    let user = await UserModel.findOne({
      where: {
        username: v.get('body.username'),
        deleted_at: null
      }
    });
    if (user) {
      throw new ParameterException('用户名已存在');
    }

    const us = new UserModel();

    us.username = v.get('body.username');
    us.nickname = v.get('body.nickname');
    us.password = v.get('body.password');
    us.group_id = v.get('body.group_id');

    us.save();
  }

  /**
   * 更新用户
   */
  async updateUser(ctx, v) {
    let user = await UserModel.findOne({
      where: {
        id: v.get('path.id')
      }
    });

    user.nickname = v.get('body.nickname');
    user.save();
  }
}

module.exports = UserDao;

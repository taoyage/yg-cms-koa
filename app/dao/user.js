const UserModel = require('@models/user');
const { ParameterException } = require('@validators/user');
const bcrypt = require('bcryptjs');

class UserDao {
  async createUser(ctx, v) {
    let user = await UserModel.findOne({
      where: {
        username: v.get('body.username')
      }
    });
    if (user) {
      throw new ParameterException('用户名已存在');
    }

    UserModel.create({
      username: v.get('body.username'),
      nickname: v.get('body.nickname'),
      password: bcrypt.genSaltSync(10, v.get('body.password'))
    });
  }
}

module.exports = UserDao;

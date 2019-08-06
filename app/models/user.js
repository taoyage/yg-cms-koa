const bcrypt = require('bcrypt');
const { Sequelize, Model } = require('sequelize');
const db = require('@core/db');
const { AuthFailed } = require('@core/http-exception');

class User extends Model {
  /**
   * 验证用户登录账号密码
   * @param {*} username
   * @param {*} password
   */
  static async verify(username, password) {
    const user = await User.findOne({
      where: {
        username
      }
    });
    if (!user) {
      throw new AuthFailed('账号不存在');
    }

    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
      throw new AuthFailed('密码不正确');
    }

    return user;
  }
}

User.init(
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: Sequelize.STRING,
    username: {
      type: Sequelize.STRING(11),
      unique: true,
      allowNull: false,
      validate: { notNull: true }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notNull: true },
      set(val) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('password', psw);
      }
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true
    }
  },
  { sequelize: db, tableName: 'user' }
);

module.exports = User;

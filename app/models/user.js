const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');
const db = require('@core/db');
const { AuthFailed } = require('@core/http-exception');

class User extends Model {
  /**
   * 验证用户登录账号密码
   * @param {*} contact
   * @param {*} password
   */
  static async verifyUser(contact, password) {
    const user = await User.findOne({
      where: {
        contact
      }
    });
    if (!user) {
      throw new AuthFailed('账号不存在');
    }

    const correct = bcrypt.compareSync(password, user.password);
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
    contact: {
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
      unique: true,
      allowNull: false,
      validate: { notNull: true }
    }
  },
  { sequelize: db, tableName: 'user' }
);

module.exports = User;

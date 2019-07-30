const bcrypt = require('bcryptjs');
const db = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

class User extends Model {}

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
  { sequelize: db }
);

module.exports = User;

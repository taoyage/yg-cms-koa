const { Sequelize, Model } = require('sequelize');
const db = require('@core/db');

class Auth extends Model {}

Auth.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    auth: {
      type: Sequelize.STRING,
      allowNull: false
    },
    module: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'yg_auth',
    timestamps: false,
    paranoid: false
  }
);

module.exports = Auth;

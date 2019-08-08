const { Sequelize, Model } = require('sequelize');
const group = require('./group');
const db = require('@core/db');

class Auth extends Model {}

Auth.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    auth: {
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

Auth.belongsTo(group);

module.exports = Auth;

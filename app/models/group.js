const { Sequelize, Model } = require('sequelize');
const db = require('@core/db');

class Group extends Model {}

Group.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
      validate: { notNull: true }
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    timestamps: false,
    paranoid: false,
    sequelize: db,
    tableName: 'yg_group'
  }
);

module.exports = Group;

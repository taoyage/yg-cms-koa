const { Sequelize } = require('sequelize');

const { dbName, host, port, user, password } = require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true
  }
});

sequelize.sync({
  force: false
});

module.exports = sequelize;

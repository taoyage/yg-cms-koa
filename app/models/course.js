const db = require('@core/db');
const { Sequelize, Model } = require('sequelize');

class Course extends Model {}

Course.init(
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    course_name: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    teacher_name: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    course_week: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    number_limit: { type: Sequelize.INTEGER, allowNull: false, validate: { notNull: true } }
  },
  { sequelize: db, tableName: 'course' }
);

module.exports = Course;

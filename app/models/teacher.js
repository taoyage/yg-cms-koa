const { Sequelize, Model } = require('sequelize');
const db = require('@core/db');
const { ParameterException } = require('@core/http-exception');

class Teacher extends Model {
  static async verifyContact(contact) {
    const teacher = await Teacher.findOne({ where: { contact } });
    if (teacher) {
      throw new ParameterException('该手机号码已存在');
    }
    return teacher;
  }
}

Teacher.init(
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    teacher_name: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    contact: {
      type: Sequelize.STRING(11),
      unique: true,
      allowNull: false,
      validate: { notNull: true }
    }
  },
  { sequelize: db, tableName: 'teacher' }
);

module.exports = Teacher;

const { Rule, LinValidator } = require('@core/validator');

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.nickname = [
      // new Rule('isNotEmpty', '昵称不可为空'),
      new Rule('isLength', '昵称长度必须在2～10之间', 2, 10)
    ];

    this.password = [
      new Rule(
        'matches',
        '密码长度必须在6~22位之间，包含字符、数字和 _ ',
        /^[A-Za-z0-9_*&$#@]{6,22}$/
      )
    ];

    // this.confirm_password = new Rule('isNotEmpty', '确认密码不可为空');
  }
}

module.exports = {
  RegisterValidator
};

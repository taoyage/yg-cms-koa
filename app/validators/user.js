const { Rule, AccordValidator } = require('@lib/validator');

class RegisterValidator extends AccordValidator {
  constructor() {
    super();
    this.username = [new Rule('matches', '用户名应该为11位数手机号码', /^1(3|4|5|6|7|8|9)\d{9}$/)];

    this.nickname = [
      new Rule('isOptional', '', 'test111'),
      new Rule('isLength', '昵称长度必须在2～10之间', 2, 10)
    ];

    this.group_id = [
      new Rule('isInt', '分组id必须是整数，且大于0', {
        min: 1
      })
    ];

    this.password = [
      new Rule(
        'matches',
        '密码长度必须在6~22位之间，包含字符、数字和 _ ',
        /^[A-Za-z0-9_*&$#@]{6,22}$/
      )
    ];
  }

  validateConfirmPassword(data) {
    if (data.body.password !== data.body.password_confirm) {
      throw new Error('两次输入的密码不一致，请重新输入');
    }
  }
}

class UpdateUserinfoValidator extends AccordValidator {
  constructor() {
    super();
    this.nickname = [new Rule('isLength', '昵称长度必须在2～10之间', 2, 10)];
  }
}

class LoginValidator extends AccordValidator {
  constructor() {
    super();
    this.username = [new Rule('matches', '用户名应该为11位数手机号码', /^1(3|4|5|6|7|8|9)\d{9}$/)];
    this.password = [
      new Rule(
        'matches',
        '密码长度必须在6~22位之间，包含字符、数字和 _ ',
        /^[A-Za-z0-9_*&$#@]{6,22}$/
      )
    ];
  }
}

module.exports = {
  RegisterValidator,
  UpdateUserinfoValidator,
  LoginValidator
};

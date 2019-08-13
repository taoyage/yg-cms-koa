const { Rule, BearValidator } = require('@core/validator2');

class CreateGroupValidator extends BearValidator {
  constructor() {
    super();
    this.name = [new Rule('isLength', '组名长度必须在1～64之间', 1, 64)];
    this.description = [
      new Rule('isOptional'),
      new Rule('isLength', '描述长度不能超过100个字符', { max: 100 })
    ];
  }
  validateAuths(data) {
    const auths = data.body.auths;

    if (!auths) {
      throw new Error('auths必须是非空数组');
    }

    if (!Array.isArray(auths)) {
      throw new Error('auths必须是非空数组');
    }

    for (let item of auths) {
      if (!item) {
        throw new Error('auths数组中的每一项都不允许为空');
      }
    }
  }
}

module.exports = { CreateGroupValidator };

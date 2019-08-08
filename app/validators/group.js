const { Rule, LinValidator } = require('@core/validator');

class CreateGroupValidator extends LinValidator {
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

    if (!auths || !Object.keys(auths)) {
      throw new Error('auths必须为非空对象');
    }
    for (let key in auths) {
      if (!Array.isArray(auths[key])) {
        throw new Error('auths对象key中的value必须是非空数组');
      }
    }
  }
}

module.exports = { CreateGroupValidator };

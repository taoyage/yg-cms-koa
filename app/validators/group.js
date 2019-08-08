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
    
    if (!auths || !Array.isArray(auths)) {
      throw new Error('auths必须为非空数组');
    }
    for (const auth of auths) {
      if (typeof auth !== 'string' || !auth.length) {
        throw new Error('auths必须为非空数组');
      }
    }
  }
}

module.exports = { CreateGroupValidator };

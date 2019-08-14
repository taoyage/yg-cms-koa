const validator = require('validator');
const _ = require('lodash');
const { HttpException, ParameterException } = require('./httpException');

/**
 * 递归查找圆形链上所有的name，直到原型链为null为止
 * @param {*} instance
 * @param {*} param1
 */
const findMembers = function(instance, { filter }) {
  // 递归函数
  function _find(instance) {
    if (instance.__proto__ === null) {
      return [];
    }
    const keys = Reflect.ownKeys(instance).filter(key => {
      return _shouldKeep(key);
    });

    return [...keys, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value) {
    if (filter && filter(value)) {
      return true;
    }
  }

  return _find(instance);
};

class BearValidator {
  constructor() {
    this.data = {};
    this.parsed = {};
    this.errors = [];
  }

  /**
   * 拿到所有ctx中的数据
   * @param {*} ctx
   */
  _getParams(ctx) {
    return {
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx.params,
      header: ctx.request.header
    };
  }

  /**
   * 获取所有对象上的key值，并过滤掉不符合规则的
   * @param {*} key
   */
  _findMembersFilter(key) {
    const value = this[key];
    // 自定义的验证函数，必须以validate开头
    if (/validate([A-Z])\w+/g.test(key)) {
      return true;
    }

    if (Array.isArray(value)) {
      if (!value.length) {
        return false;
      } else {
        value.forEach(value => {
          if (!(value instanceof Rule)) {
            throw new Error('验证数组必须全部为Rule类型');
          }
        });
        return true;
      }
    }
    return false;
  }

  async _check(key) {
    const isCustomFunc = typeof this[key] === 'function' ? true : false;
    let result;
    if (isCustomFunc) {
      try {
        await this[key](this.data);
        result = new RuleResult(true);
      } catch (error) {
        result = new RuleResult(false, error.msg || error.message || '参数错误');
      }
    } else {
      const rules = this[key];
      const ruleField = new RuleField(rules);
      const param = this._findParam(key);

      result = ruleField.validate(param.value);

      if (result.pass) {
        if (param.path.length === 0) {
          _.set(this.parsed, ['default', key], result.legalValue);
        } else {
          _.set(this.parsed, param.path, result.legalValue);
        }
      }
      console.log(this.parsed);
      if (!result.pass) {
        const msg = `${isCustomFunc ? '' : key}${result.msg}`;
        return {
          msg,
          success: false
        };
      }
    }
    return {
      msg: 'ok',
      success: true
    };
  }

  _findParam(key) {
    let value;
    value = _.get(this.data, ['query', key]);
    if (value) {
      return {
        value,
        path: ['query', key]
      };
    }
    value = _.get(this.data, ['body', key]);
    if (value) {
      return {
        value,
        path: ['body', key]
      };
    }
    value = _.get(this.data, ['path', key]);
    if (value) {
      return {
        value,
        path: ['path', key]
      };
    }
    value = _.get(this.data, ['header', key]);
    if (value) {
      return {
        value,
        path: ['header', key]
      };
    }
    return {
      value: null,
      path: []
    };
  }

  get(path, parsed = true) {
    if (parsed) {
      const value = _.get(this.parsed, path, null);
      if (!value) {
        const keys = path.split('.');
        const key = _.last(keys);
        return _.get(this.parsed.default, key);
      }
      return value;
    } else {
      return _.get(this.data, path, null);
    }
  }

  async validate(ctx, alias) {
    const params = this._getParams(ctx);
    this.data = _.cloneDeep(params);
    this.parsed = _.cloneDeep(params);

    // 拿到所有验证规则及验证函数
    const memberKeys = findMembers(this, {
      filter: this._findMembersFilter.bind(this)
    });

    for (let key of memberKeys) {
      let result = await this._check(key);
      if (!result.success) {
        this.errors.push(result.msg);
      }
    }

    if (this.errors.length) {
      throw new ParameterException(this.errors);
    }

    ctx.v = this;
    return this;
  }
}

class Rule {
  constructor(name, msg, ...params) {
    this.name = name;
    this.msg = msg;
    this.params = params;
  }

  validate(field) {
    if (this.name === 'isOptional') return new RuleResult(true);
    if (!validator[this.name](field, ...this.params)) {
      return new RuleResult(false, this.msg || this.message || '参数错误');
    }
    return new RuleResult(true, '');
  }
}

class RuleResult {
  constructor(pass, msg = '') {
    this.pass = pass;
    this.msg = msg;
  }
}

class RuleFieldResult extends RuleResult {
  constructor(pass, msg = '', legalValue = null) {
    super(pass, msg);
    this.legalValue = legalValue;
  }
}

class RuleField {
  constructor(rules) {
    this.rules = rules;
  }

  validate(value) {
    if (value === null) {
      const allowEmpty = this._allowEmpty();
      const defaultValue = this._hasDefault();
      if (allowEmpty) {
        return new RuleFieldResult(true, '', defaultValue);
      } else {
        return new RuleFieldResult(false, '字段是必填参数');
      }
    }

    const fieldResult = new RuleFieldResult(false);
    for (let rule of this.rules) {
      let result = rule.validate(value);
      if (!result.pass) {
        fieldResult.msg = result.msg;
        return fieldResult;
      }
    }

    return new RuleFieldResult(true, '', this._convert(value));
  }

  _convert(value) {
    for (let rule of this.rules) {
      if (rule.name == 'isInt') {
        return parseInt(value);
      }
      if (rule.name == 'isFloat') {
        return parseFloat(value);
      }
      if (rule.name == 'isBoolean') {
        return value ? true : false;
      }
    }
    return value;
  }

  _allowEmpty() {
    for (let rule of this.rules) {
      if (rule.name == 'isOptional') {
        return true;
      }
    }
    return false;
  }

  _hasDefault() {
    for (let rule of this.rules) {
      const defaultValue = rule.params[0];
      if (rule.name == 'isOptional') {
        return defaultValue;
      }
    }
  }
}

module.exports = {
  BearValidator,
  Rule,
  HttpException
};

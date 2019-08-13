const validator = require('validator');
const _ = require('lodash');

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

  validate(ctx, alias) {
    const params = this._getParams(ctx);
    this.data = _.cloneDeep(params);
    this.parsed = _.cloneDeep(params);

    const memberKeys = findMembers(this, {
      filter: this._findMembersFilter.bind(this)
    });

    console.log(123, memberKeys);

    ctx.v = this;
    return this;
  }
}

class Rule {
  constructor() {}
}

module.exports = {
  BearValidator,
  Rule
};

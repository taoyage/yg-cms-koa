const validator = require('validator');
const _ = require('lodash');
const { HttpException, ParameterException } = require('./httpException');

class AccordValidator {
  constructor() {
    this.data = {};
    this.parsed = {};
    this.errors = [];
  }

  /**
   * 根据path获取解析后的值
   * @param {*} path
   * @param {*} parsed
   */
  get(path, parsed = true) {
    let defaultVal = null;
    if (arguments.length >= 3) {
      defaultVal = arguments[2];
    }
    if (parsed) {
      const value = _.get(this.parsed, path, defaultVal);
      if (!value) {
        const keys = path.split('.');
        const key = _.last(keys);
        return _.get(this.parsed.default, key, defaultVal);
      }
      return value;
    }
    return _.get(this.data, path, defaultVal);
  }

  /**
   * 校验器
   * 验证所有继承自于AccordValidator类的构造函数中定义的rule
   * 以及类中以validate开头命名的自定义函数
   * @param {*} ctx koa context
   */
  async validate(ctx) {
    const data = this._getDatas(ctx);
    this.data = _.cloneDeep(data);
    this.parsed = _.cloneDeep({ ...data, default: {} });


    const propertyNames = this._getInstanceProperty(this);
    for (let key of propertyNames) {
      let result = await this._checkRule(key);
      if (!result.success) {
        throw new ParameterException(result.msg);
      }
    }

    ctx.v = this;
    return this;
  }

  /**
   * 获取context中数据
   * @param {*} ctx
   */
  _getDatas(ctx) {
    return {
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx.params,
      header: ctx.request.header
    };
  }

  /**
   * 验证rule
   * @param {*} key
   */
  async _checkRule(key) {
    const isCustomFunc = typeof this[key] === 'function' ? true : false;
    // 自定义的校验函数
    if (isCustomFunc) {
      try {
        await this[key](this.data);
      } catch (err) {
        return { msg: err.message || '参数错误', success: false };
      }
    } else {
      const [dataKey, dataVal] = this._findDataValAndKey(key);

      // 当数据为空，则检查是否为isOptional,如果有则返回默认值，如果没有则报错

      if (!dataVal) {
        for (let ruleInstance of this[key]) {
          if (!ruleInstance.optional) {
            return { msg: `${key}为必填参数`, success: false };
          } else {
            this.parsed['default'][key] = ruleInstance.defaultVal;
            return {
              success: true
            };
          }
        }
      } else {
        // 验证每个rule实例
        for (let ruleInstance of this[key]) {
          // rule实例中没有optional才进行校验
          if (!ruleInstance.optional) {
            let result = ruleInstance.validate(this.data[dataKey][key]);

            // 验证不通过处理
            if (!result) {
              return { msg: ruleInstance.message, success: false };
            }

            _.set(this.parsed, [dataKey, key], ruleInstance.parsedValue);
          }
        }
      }
    }

    return {
      msg: 'ok',
      success: true
    };
  }

  /**
   * 查找data对应的key和value
   * @param {*} key
   */
  _findDataValAndKey(key) {
    const keys = Reflect.ownKeys(this.data);
    for (const k of keys) {
      const val = _.get(this.data[k], key);
      if (val !== void 0) {
        return [k, val];
      }
    }
    return [];
  }

  /**
   * 递归查找到对象实例上定义的所有属性
   * 直到实例__proto__属性指向null
   * 同时过滤掉不是以validate开头命名的函数
   * @param {*} instance 对象实例
   */
  _getInstanceProperty(instance) {
    function _find(_instance) {
      if (_instance.__proto__ === null) {
        return [];
      }

      const propertyNames = Reflect.ownKeys(_instance).filter(key => {
        // 获取属性的值
        const rules = instance[key];
        // 校验是否为validate开头
        if (/validate([A-Z])\w+/g.test(key)) {
          return true;
        }

        // 校验是否为数组
        if (Array.isArray(rules)) {
          if (!rules.length) {
            return false;
          }
          // 校验数组中的每一项是否为Rule类型
          else {
            for (const rule of rules) {
              if (!(rule instanceof Rule)) {
                throw new Error('验证数组必须为Rule类型');
              }
            }
            return true;
          }
        }

        return false;
      }, instance);

      return [...propertyNames, ..._find(_instance.__proto__)];
    }
    return _find(instance);
  }
}

/**
 * 规则校验，基于validator库进行验证
 */
class Rule {
  constructor(validatorFuc, message, ...options) {
    this.validatorFunc = validatorFuc;
    this.message = message;
    this.options = options;
    this.optional = false;
    if (this.validatorFunc === 'isOptional') {
      this.optional = true;
      this.defaultVal = options && options[0];
    }
  }
  validate(value) {
    // 数据转换，验证
    value = typeof value === 'string' ? value : String(value);
    switch (this.validatorFunc) {
      case 'isInt':
        this.parsedValue = validator.toInt(value);
        return validator.isInt(value, ...this.options);
      case 'isFloat':
        this.parsedValue = validator.toFloat(value);
        return validator.isFloat(value, ...this.options);
      case 'isBoolean':
        this.parsedValue = validator.toBoolean(value);
        return validator.isBoolean(value);
      case 'isNotEmpty':
        return value !== '' && value !== null && value !== undefined;
      default:
        this.parsedValue = value;
        return validator[this.validatorFunc](value, ...this.options);
    }
  }
}

module.exports = {
  AccordValidator,
  Rule,
  HttpException,
  ParameterException
};

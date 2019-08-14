const validator = require('validator');
const _ = require('lodash');
const { HttpException, ParameterException } = require('./httpException');

class AccordValidator {
  constructor() {
    this.data = {};
    this.errors = [];
  }

  /**
   * 校验器
   * 验证所有继承自于AccordValidator类的构造函数中定义的rule
   * 以及类中以validate开头命名的自定义函数
   * @param {*} ctx koa context
   */
  async validate(ctx) {
    this.data = _.cloneDeep({
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx.params,
      header: ctx.request.header
    });

    const propertyNames = this._getInstanceProperty(this);
    for (let key of propertyNames) {
      let result = await this._checkRule(key);
    }
  }

  _checkRule(key) {
    
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

class Rule {}

module.exports = {
  AccordValidator,
  Rule,
  HttpException,
  ParameterException
};

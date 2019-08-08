const requireDirectory = require('require-directory');
const Router = require('koa-router');
const Token = require('@utils/token');
const { security } = require('@config/security');

class InitManager {
  static initCore(app) {
    this.app = app;
    this.initLoadRouters();
    this.initToken();
  }

  /**
   * 加载路由
   */
  static initLoadRouters() {
    const apiDirectory = process.cwd() + '/app/api';
    requireDirectory(module, apiDirectory, {
      visit: whenloadModule
    });

    function whenloadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  /**
   * 挂载token到ctx
   */
  static initToken() {
    const { secretKey, expiresIn } = security;
    const token = new Token(secretKey, expiresIn);
    this.app.context.token = token;
  }
}

module.exports = InitManager;

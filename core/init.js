const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
  static initCore(app) {
    this.app = app;
    this.initLoadRouters();
    this.loadHttpException();
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

  static loadHttpException() {
    console.log(2);
  }
}

module.exports = InitManager;

const validator = require('validator');

class BearValidator {
  constructor() {
    this.data = {};
  }

  getParams(ctx) {
    return {
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx.params,
      header: ctx.request.header
    };
  }

  validator(ctx) {
    const params = getParams(ctx);
    this.data = { ...params };
  }
}

class testValidator extends BearValidator {
  constructor() {
    super();
  }
}

new testValidator().validator();

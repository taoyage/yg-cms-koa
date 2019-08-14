const { HttpException, ParameterException } = require('@lib/validator');

class NotFound extends HttpException {
  constructor(msg, code) {
    super();
    this.status = 404;
    this.msg = msg || '资源未找到';
    this.code = code || 10000;
  }
}

class AuthFailed extends HttpException {
  constructor(msg, code) {
    super();

    this.status = 401;
    this.msg = msg || '授权失败';
    this.code = code || 10004;
  }
}

class Forbidden extends HttpException {
  constructor(msg, code) {
    super();
    this.status = 403;
    this.msg = msg || '无权限访问';
    this.code = code || '10006';
  }
}

module.exports = {
  HttpException,
  ParameterException,
  AuthFailed,
  Forbidden,
  NotFound
};

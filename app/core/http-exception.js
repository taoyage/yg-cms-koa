class HttpException extends Error {
  constructor(msg = '服务器异常', code = 10000, status = 400) {
    super();
    this.code = code;
    this.status = status;
    this.msg = msg;
  }
}

class ParameterException extends HttpException {
  constructor(msg, code) {
    super();
    this.status = 400;
    this.msg = msg || '参数错误';
    this.code = code || 10000;
  }
}

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

module.exports = {
  HttpException,
  ParameterException,
  AuthFailed,
  NotFound
};

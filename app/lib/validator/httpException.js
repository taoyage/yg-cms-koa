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

module.exports = { HttpException, ParameterException };

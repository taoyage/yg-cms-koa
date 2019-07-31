function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true;
    }
  }
  return false;
}

const loginType = {
  MINI_PROGRAM: 100,
  MOBILE: 101,
  isThisType
};

module.exports = {
  loginType
};

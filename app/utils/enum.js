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

const auths = {
  user: ['创建用户', '更新用户', '查看用户', '删除用户'],
  group: ['创建分组', '更新分组', '查看分组', '删除分组']
};

const authMap = generateAuthMap();

function generateAuthMap() {
  let authTree = {};
  for (let key in auths) {
    for (let val of auths[key]) {
      authTree[val] = key;
    }
  }
  return authTree;
}

module.exports = {
  loginType,
  auths,
  authMap
};

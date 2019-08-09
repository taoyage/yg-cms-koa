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
  user: ['getUser', 'createUser', 'updateUser', 'deleteUser'],
  group: ['getGroup', 'createGroup', 'updateGroup', 'deleteGroup']
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

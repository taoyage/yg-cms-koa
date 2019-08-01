/**
 * 将obj转换成驼峰命名
 * @param {*} obj
 */
const transformToCamelCase = obj => {
  return Object.keys(obj).reduce((map, key) => {
    const newKey = key.replace(/\_(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
    map[newKey] = obj[key];
    return map;
  }, {});
};

/**
 * 将obj转换成下划线命名
 * @param {*} obj
 */
const transformToUnderlineCase = obj => {
  return Object.keys(obj).reduce((map, key) => {
    const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    map[newKey] = obj[key];
    return map;
  });
};

module.exports = { transformToCamelCase, transformToUnderlineCase };

// 用户信息
const user = {
  name: { type: String, default: new Date().getTime() },
  account: String,
  password: String
};

module.exports = { user };

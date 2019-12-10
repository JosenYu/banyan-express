class Message {
  constructor() {}
  // 成功返回类型
  success(list) {
    return {
      state: 200,
      msg: "no",
      list: list
    };
  }
  // 失败返回类型
  fail(msg) {
    return {
      state: 500,
      msg: msg,
      list: []
    };
  }
}
var msg = new Message();
module.exports = msg;

class Message {
  constructor() {}
  // 成功返回类型
  success(list) {
    return {
      success: true,
      msg: "no",
      list: list
    };
  }
  // 失败返回类型
  fail(msg) {
    return {
      success: false,
      msg: msg,
      list: []
    };
  }
}
var msg = new Message();
module.exports = msg;

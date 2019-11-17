module.exports = { msg };
/**
 * 返回数据标准格式
 * @param {Number} status 状态 200/500  成功/不存在/重复请求不修改
 * @param {String} msg 提示信息 success/fail
 * @param {Array} list 数据，无的话一般[]
 */
function msg(status = 200, msg = "success", list = []) {
  return {
    status: status,
    msg: msg,
    list: list
  };
}

var express = require("express");
var router = express.Router();
var msg = require("../utils/message");
var formidable = require("formidable");
var fs = require("fs");
var arr = [];

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("upload", { title: "commodity" });
});

router.post("/aaa", (req, res) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../videos/";
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if (err) return;
    // console.log("fields", fields);
    // console.log("files", files);

    arr.push({
      name: fields.name,
      cur: fields.cur,
      total: fields.total,
      path: files.files.path
    });

    /**
     * 排序根据 cur判断M
     * @param 0 开始
     */
    arr.sort((a, b) => a.cur - b.cur);
    // console.log(arr);
    res.send(msg.success("ok"));
  });
});

router.post("/aaa2", (req, res) => {
  // 需要合并的数组
  const checkList = arr.filter(v => v.name === req.body.name);
  arr = arr.filter(v => v.name !== req.body.name);
  const [item] = checkList;
  // 文件名称
  const NAME = item.name;
  // 写入流
  const writeStream = fs.createWriteStream(__dirname + "/../videos/" + NAME);
  merage(checkList, writeStream);
  res.json(msg.success());
});

// *合并文件
async function merage(checkList, writeStream) {
  // *一定要同步合并 不能异步
  for (const iterator of checkList) {
    // 写入
    await pipeStream(iterator, writeStream);
  }
}
// 写入流
const pipeStream = (iterator, writeStream) =>
  new Promise(resolve => {
    const readStream = fs.createReadStream(iterator.path);
    readStream.pipe(writeStream, { end: false });
    // 读取结束 删除文件
    readStream.on("end", () => {
      // 删除文件
      fs.unlinkSync(iterator.path);
      console.log("文件已删除", iterator.path);
      resolve();
    });
  });
module.exports = router;

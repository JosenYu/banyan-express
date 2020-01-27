var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");
var msg = require("../utils/message");
var formidable = require("formidable");
var fs = require("fs");
var arr = [];
router.get("/b", (req, res) => {
  const read = fs.createReadStream(__dirname + "/../videos/123.mp4");
  read.pipe(res);
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "commodity" });
});
router.post("/aaa", (req, res) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../videos/";
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    // console.log("files", files);
    arr.push({
      files,
      fields
    });
    /**
     * 排序根据 cur判断
     * @param 0 开始
     */
    arr.sort((a, b) => a.fields.cur - b.fields.cur);
    console.log(arr);

    res.send(msg.success("ok"));
  });
});
router.put("/aaa2", (req, res) => {
  // 需要合并的数组
  const checkList = arr.filter(v => v.fields.name === req.body.name);
  arr = arr.filter(v => v.fields.name !== req.body.name);
  const [item] = checkList;
  // 文件名称
  const NAME = item.fields.name;
  // 切片数量
  const SLICE_NUM = item.fields.total;
  // 写入流
  let targetStream = fs.createWriteStream(__dirname + "/../videos/" + NAME);
  /**
   * 循环追加写入
   */
  checkList.forEach(value => {
    // 当前操作 文件路径
    const CUR_PATH = value.files.files.path;
    // 来源流
    let originStream = fs.createReadStream(CUR_PATH);
    // *pipe流
    originStream.pipe(targetStream, { end: false });
    // 写入结束 删除文件
    originStream.on("end", function() {
      // 删除文件
      fs.unlinkSync(CUR_PATH);
      console.log("文件已删除", CUR_PATH);
    });
  });
  res.json(msg.success());
});
// 创建商品存储入库流程
router.post("/createCommodity", (req, res, next) => {
  console.info("商品入库info", req.body);
  // 采购入库
  const purchase = body =>
    new Promise(resolve => {
      db.purchase.create(body, (err, doc) => {
        if (err) {
          res.send(msg.fail(err));
          throw err;
        } else {
          console.log("采购完成", doc);
          resolve(doc._id);
        }
      });
    });
  // 商品入库
  const commodity = (body, P_ID) =>
    new Promise(resolve => {
      body.p_id = P_ID;
      db.commodity.create(body, (err, doc) => {
        if (err) {
          res.send(msg.fail(err));
          throw err;
        } else {
          console.log("商品入库信息", doc);
          resolve(doc);
        }
      });
    });
  (async () => {
    const P_ID = await purchase(req.body);
    const commodityDoc = await commodity(req.body, P_ID);
    return { P_ID, commodityDoc };
  })().then(v => {
    res.send(msg.success(v));
    console.log(v);
  });
});

// 获取商品列表
router.get("/getCommodity", (req, res, next) => {
  const name = req.query.name || "";
  const model = req.query.model || "";
  const brand = req.query.brand || "";
  const pageSize = Number(req.query.pageSize || 10);
  const pageCurrent = Number(req.query.pageCurrent - 1 || 0);
  console.info("find.query", req.query);
  // 模糊查询商品
  const doc = (name, brand, model, pageSize, pageCurrent) =>
    new Promise(resolve => {
      db.commodity.find(
        {
          // 模糊查询
          name: { $regex: name },
          model: { $regex: model },
          brand: { $regex: brand }
        },
        null,
        { limit: pageSize, skip: pageCurrent * pageSize },
        (err, doc) => {
          if (err) {
            res.send(msg.fail(err));
            throw err;
          } else {
            console.log("商品查询完成", doc);
            resolve(doc);
          }
        }
      );
    });
  // 查询总条数
  const count = (name, brand, model) =>
    new Promise(resolve => {
      db.commodity.countDocuments(
        {
          // 模糊查询
          name: { $regex: name },
          model: { $regex: model },
          brand: { $regex: brand }
        },
        (err, count) => {
          if (err) {
            res.send(msg.fail(err));
            throw err;
          } else {
            console.log("商品总数", count);
            resolve(count);
          }
        }
      );
    });
  (async () => {
    let documents, totalCounts;
    documents = await doc(name, brand, model, pageSize, pageCurrent);
    totalCounts = await count(name, brand, model);
    return { documents, totalCounts };
  })().then(result => {
    console.log("find.content：", result);
    res.send(msg.success(result));
  });
});

// 商品出库
router.post("/updateCommodity", (req, res) => {
  const sell = body =>
    new Promise(resolve => {
      db.sell.create(body, (err, doc) => {
        if (err) {
          res.send(msg.fail(err));
          throw err;
        } else {
          console.log("采购完成", doc);
          resolve(doc._id);
        }
      });
    });

  const commodity = (body, S_ID) =>
    new Promise(resolve => {
      db.commodity.updateOne(
        { _id: body.ID },
        {
          number: body.number,
          $push: { s_id: S_ID }
        },
        (err, doc) => {
          if (err) {
            res.send(msg.fail(err));
          } else {
            console.log("commodity update finish", doc);
            resolve(doc);
          }
        }
      );
    });

  (async () => {
    const S_ID = await sell(req.body);
    const commodityDoc = await commodity(req.body, S_ID);
    return { S_ID, commodityDoc };
  })().then(v => {
    console.log(v);
    res.send(v);
  });
});

module.exports = router;

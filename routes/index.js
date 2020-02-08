var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");
var msg = require("../utils/message");
var formidable = require("formidable");
var fs = require("fs");
var arr = [];

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "commodity" });
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
  // 合并文件
  mergeFileChunk(writeStream, checkList);
  res.json(msg.success());
});

const mergeFileChunk = async (writeStream, checkList) => {
  await Promise.all(
    checkList.map((v, index) => {
      pipeStream(writeStream, v.path);
    })
  );
};

const pipeStream = (writeStream, CUR_PATH) =>
  new Promise(resolve => {
    const readStream = fs.createReadStream(CUR_PATH);
    // 写入
    readStream.pipe(writeStream, { end: false });
    // 读取结束 删除文件
    readStream.on("end", () => {
      // 删除文件
      fs.unlinkSync(CUR_PATH);
      console.log("文件已删除", CUR_PATH);
      resolve();
    });
  });

// 创建商品存储入库流程
router.post("/createCommodity", (req, res, next) => {
  console.info("商品入库info", req.body);
  // 采购入库
  const purchase = body =>
    new Promise(resolve => {
      db.purchase.create(body, (err, doc) => {
        if (err) {
          res.status(500);
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
          res.status(500);
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
    res.json(v);
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
          // 模糊查询，数量大于0
          name: { $regex: name },
          model: { $regex: model },
          brand: { $regex: brand },
          number: { $gt: 0 }
        },
        null,
        { limit: pageSize, skip: pageCurrent * pageSize },
        (err, doc) => {
          if (err) {
            res.status(500);
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
          brand: { $regex: brand },
          number: { $gt: 0 }
        },
        (err, count) => {
          if (err) {
            res.status(500);
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
    res.status(200).json(result);
  });
});

// 商品出库
router.post("/updateCommodity", (req, res) => {
  const sell = body =>
    new Promise(resolve => {
      db.sell.create(body, (err, doc) => {
        if (err) {
          res.sendStatus(500);
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
            res.stateus(500);
            throw err;
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
    res.status(200).json(v);
  });
});

module.exports = router;

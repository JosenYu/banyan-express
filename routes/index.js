var express = require("express");
var router = express.Router();
var db = require("../utils/mongodb/mongodb");
var respond = require("../utils/respond");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "commodity" });
});
// 创建商品存储入库
router.post("/createCommodity", (req, res, next) => {
  // res.send(req.body);
  db.commodity.create(req.body, (err, doc) => {
    if (err) {
      res.send(respond.msg(500, err));
      throw err;
    } else {
      console.log("create：", doc);
      res.send(respond.msg(200, "success", doc));
    }
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
  // async 函数
  async function getCommodity(name, brand, model, pageSize, pageCurrent) {
    let documents, totalCounts;
    documents = await db.commodity.find(
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
          res.send(respond.msg(500, err));
          throw err;
        } else {
          return doc;
        }
      }
    );
    totalCounts = await db.commodity.countDocuments(
      {
        // 模糊查询
        name: { $regex: name },
        model: { $regex: model },
        brand: { $regex: brand }
      },
      (err, count) => {
        if (err) {
          res.send(respond.msg(500, err));
          throw err;
        } else {
          return count;
        }
      }
    );
    return { documents, totalCounts };
  }
  // 回调函数返回数据
  getCommodity(name, model, brand, pageSize, pageCurrent).then(v => {
    console.log("find.content：", v);
    res.send(respond.msg(200, "success", v));
  });
});
// 更新商品信息
router.post("/updateCommodity", (req, res) => {
  db.commodity.updateOne(
    { _id: req.body._id },
    req.body,
    // { new: true },
    (err, doc) => {
      if (err) {
        res.send(respond.msg(500, err));
      } else {
        console.log("update：", doc);
        res.send(respond.msg(200, "success", doc));
      }
    }
  );
});

module.exports = router;

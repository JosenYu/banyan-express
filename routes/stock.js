/**
 * 商品入库出库信息
 * 1.录入模型，以后创建商品根据模型创建
 * 2.采购商品，根据商品模型入库
 * 3.出售商品
 */
var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

/* GET stock page. */
router.get("/", function(req, res, next) {
  res.render("stock", { title: "stock" });
});
// 根据条件查询
router.get("/queryCondition", (req, res) => {
  queryCondition(req.query).then(v => {
    res.json(v);
  });
});
async function queryCondition(query) {
  const doc = await getStockData(query);
  const count = await getStockCount(query);
  return { doc, count };
}
// 获取 stock 查询数据
const getStockData = query =>
  new Promise(resolve => {
    db.stock.find(
      {
        name: { $regex: query.name },
        model: { $regex: query.model },
        brand: { $regex: query.brand }
      },
      null,
      {
        limit: 10,
        skip: (query.pageCurrent - 1) * 10
      },
      (err, doc) => {
        if (err) throw err;
        resolve(doc);
      }
    );
  });

// 获取 stock 查询后的总数
const getStockCount = query =>
  new Promise(resolve => {
    db.stock.countDocuments(
      {
        name: { $regex: query.name },
        model: { $regex: query.model },
        brand: { $regex: query.brand }
      },
      (err, count) => {
        if (err) throw err;
        resolve(count);
      }
    );
  });

// 创建商品型号规格
router.post("/createModel", (req, res) => {
  // console.log("创建model", req.body);
  db.stock_model.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});

// 修改商品模型
router.post("/updateModel", (req, res) => {
  db.stock_model.updateOne({ _id: req.body.id }, req.body, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});

// 查询模型是否已经存在
router.get("/getModel", (req, res) => {
  (async function() {
    const doc = await findModel(req.query);
    const count = await modelCount(req.query);
    return { doc, count };
  })().then(result => {
    res.json(result);
  });
});
const findModel = query =>
  new Promise(resolve => {
    db.stock_model.find(
      {
        name: { $regex: query.name },
        model: { $regex: query.model },
        brand: { $regex: query.brand }
      },
      null,
      {
        limit: 10,
        skip: (query.pageCurrent - 1) * 10
      },
      (err, doc) => {
        if (err) throw err;
        resolve(doc);
      }
    );
  });
const modelCount = query =>
  new Promise(resolve => {
    db.stock_model.countDocuments(
      {
        name: { $regex: query.name },
        model: { $regex: query.model },
        brand: { $regex: query.brand }
      },
      (err, count) => {
        if (err) throw err;
        resolve(count);
      }
    );
  });

// 查询某一个货物
router.get("/searchStock", (req, res) => {
  db.stock.findById(req.query.id, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});

// 采购商品
router.post("/purchase", (req, res) => {
  db.stock.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});

// 出售
router.post("/sell", (req, res) => {
  createSell(req.body).then(result => {
    res.json(result);
  });
});
async function createSell(body) {
  const createSellData = await createSellDB(body);
  const updateStockData = await updateStockDB(body);
  return { createSellData, updateStockData };
}
let createSellDB = body =>
  new Promise(resolve => {
    db.stock_sell.create(body, (err, doc) => {
      if (err) throw err;
      resolve(doc);
    });
  });

let updateStockDB = body =>
  new Promise(resolve => {
    db.stock.updateOne(
      { _id: body.stock_id },
      { surplusNumber: body.surplusNumber },
      (err, doc) => {
        if (err) throw err;
        resolve(doc);
      }
    );
  });
router.get("/getSell", (req, res) => {
  db.stock_sell.find({ stock_id: req.query.stock_id }, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});
module.exports = router;

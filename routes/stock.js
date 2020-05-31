/**
 * 商品入库出库信息
 * 1.录入模型
 * 2.采购商品
 * 3.出售商品
 */
var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

/* GET stock page. */
router.get("/", function (req, res, next) {
  res.render("stock", { title: "stock" });
});
// 根据条件查询
router.get("/queryCondition", (req, res) => {
  // 获取 stock 查询数据
  const getStockData = (query) =>
    new Promise((resolve) => {
      db.stock.find(
        {
          name: { $regex: query.name },
          model: { $regex: query.model },
          brand: { $regex: query.brand },
        },
        ["name", "model", "brand", "surplusNumber", "unit"],
        {
          limit: 10,
          skip: (query.currentPage - 1) * 10,
        },
        (err, doc) => {
          if (err) throw err;
          resolve(doc);
        }
      );
    });
  // 获取 stock 查询后的总数
  const getStockCount = (query) =>
    new Promise((resolve) => {
      db.stock.countDocuments(
        {
          name: { $regex: query.name },
          model: { $regex: query.model },
          brand: { $regex: query.brand },
        },
        (err, count) => {
          if (err) throw err;
          resolve(count);
        }
      );
    });
  // 结合查询商品，和总数量 doc count
  async function queryCondition(query) {
    const doc = await getStockData(query);
    const count = await getStockCount(query);
    return { doc, count };
  }
  queryCondition(req.query).then((v) => {
    res.json(v);
  });
});

/**
 * 查询某一个商品详细信息
 * 获取商品信息 idb
 * 获取商品进口信息 importer_id
 * 获取出售信息 stock_id
 * 获取出口商信息 exporter_id
 */
router.get("/searchOne", (req, res) => {
  const getOneStock = (_id) =>
    new Promise((resolve) => {
      db.stock.findById(_id, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  const getImporterInfo = (importer_id) =>
    new Promise((resolve) => {
      db.custom_importer.findById(importer_id, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  const getExporter = (exporter_id) =>
    new Promise((resolve) => {
      db.custom_exporter.findById(exporter_id, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  const getSell = (_id) =>
    new Promise((resolve) => {
      db.stock_sell.find({ stock_id: _id }, async (err, doc) => {
        if (err) throw err;
        let data = [];
        for (const iterator of doc) {
          const exporter = await getExporter(iterator.exporter_id);
          data.push({ sell: iterator, exporter: exporter });
        }
        resolve(data);
      });
    });
  (async function () {
    const oneStock = await getOneStock(req.query._id);
    const importer = await getImporterInfo(oneStock.importer_id);
    const sell = await getSell(req.query._id);
    return { oneStock, importer, sell };
  })().then((result) => {
    res.json(result);
  });
});

/**
 * 创建商品型号规格
 * 先判断商品是否是否已经存在 精准查询
 */
router.post("/createModel", (req, res) => {
  db.stock_model.countDocuments(
    {
      name: req.body.name,
      model: req.body.model,
      brand: req.body.brand,
    },
    (err, count) => {
      if (err) throw err;
      if (count >= 1) {
        res.json({
          doc: count
        })
      } else {
        db.stock_model.create(req.body, (err, doc) => {
          if (err) throw err;
          res.json(doc);
        });
      }
    }
  );



});

// 修改商品模型
router.post("/updateModel", (req, res) => {
  db.stock_model.updateOne(
    { _id: req.body._id },
    {
      name: req.body.name,
      model: req.body.model,
      brand: req.body.brand,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

// 查询模型
router.get("/getModel", (req, res) => {
  const findModel = (query) =>
    new Promise((resolve) => {
      db.stock_model.find(
        {
          name: { $regex: query.name },
          model: { $regex: query.model },
          brand: { $regex: query.brand },
        },
        null,
        {
          limit: 10,
          skip: (query.currentPage - 1) * 10,
        },
        (err, doc) => {
          if (err) throw err;
          resolve(doc);
        }
      );
    });
  const modelCount = (query) =>
    new Promise((resolve) => {
      db.stock_model.countDocuments(
        {
          name: { $regex: query.name },
          model: { $regex: query.model },
          brand: { $regex: query.brand },
        },
        (err, count) => {
          if (err) throw err;
          resolve(count);
        }
      );
    });
  if (JSON.parse(req.query.getAll)) {
    db.stock_model.find(
      {
        name: { $regex: req.query.name },
        model: { $regex: req.query.model },
        brand: { $regex: req.query.brand },
      },
      (err, doc) => {
        if (err) throw err;
        res.json(doc);
      }
    );
  } else {
    (async function () {
      const doc = await findModel(req.query);
      const count = await modelCount(req.query);
      return { doc, count };
    })().then((result) => {
      res.json(result);
    });
  }


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
  let createSellDB = (body) =>
    new Promise((resolve) => {
      db.stock_sell.create(body, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  let updateStock = (body) =>
    new Promise((resolve) => {
      db.stock.updateOne(
        { _id: body.stock_id },
        { surplusNumber: body.surplusNumber },
        (err, doc) => {
          if (err) throw err;
          resolve(doc);
        }
      );
    });
  async function createSell(body) {
    const createSellData = await createSellDB(body);
    const stock = await updateStock(body);
    return { createSellData, stock };
  }
  createSell(req.body).then((result) => {
    res.json(result);
  });
});

// 获取出售信息
router.get("/getSell", (req, res) => {
  db.stock_sell.find({ stock_id: req.query.stock_id }, (err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});
/**
 * 更新出库信息
 * 1. 更新 stock 的剩余数量
 * 2. 更新 sell 的数量和价格
 */
router.post("/updateSell", (req, res) => {
  db.stock_sell.updateOne(
    { _id: req.body._id },
    {
      sellNumber: req.body.sellNumber,
      retail: req.body.retail,
      totalRetail: req.body.totalRetail,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc)
    }
  );
});
/**
 * 更新入库信息
 * *只能跟新商品模型和入库金额(不得修改入库数量)
 */
router.post("/updateStock", (req, res) => {
  db.stock.updateOne(
    { _id: req.body._id },
    {
      totalNumber: req.body.totalNumber,
      surplusNumber: req.body.surplusNumber,
      price: req.body.price,
      totalPrice: req.body.totalPrice,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

module.exports = router;

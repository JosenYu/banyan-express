var mongoose = require("mongoose");
const STOCK = require("./stock");
const CUSTOM = require("./custom");
// 数据库 链接
mongoose.connect(
  "mongodb://localhost:27017/banyan",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("mongodb success");
  }
);

// 商品
const stock_model = mongoose.model(
  "stock_model",
  mongoose.Schema(STOCK.model, {
    timestamps: true
  })
);

// 库存表
const stock = mongoose.model(
  "stock",
  mongoose.Schema(STOCK.stock, {
    timestamps: true
  })
);

// 出货
const stock_sell = mongoose.model(
  "stock_sell",
  mongoose.Schema(STOCK.sell, {
    timestamps: true
  })
);

// 进口
const custom_importer = mongoose.model(
  "customer_importer",
  mongoose.Schema(CUSTOM.importer, {
    timestamps: true
  })
);
// 出口
const custom_exporter = mongoose.model(
  "customer_exporter",
  mongoose.Schema(CUSTOM.exporter, {
    timestamps: true
  })
);
module.exports = {
  stock,
  stock_sell,
  stock_model,
  custom_importer,
  custom_exporter
};

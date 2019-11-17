var mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/banyan",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("mongodb success");
  }
);

// 创建商品字段属性
var commoditySchema = mongoose.Schema(
  {
    name: String,
    model: String,
    brand: String,
    unit: String,
    number: Number,
    price: Number,
    totalPrice: Number,
    retail: Number,
    source: String,
    remarks: String
  },
  {
    timestamps: true
  }
);
var commodity = mongoose.model("commodity", commoditySchema);
// 出售商品
const sellSchema = mongoose.Schema(
  {
    name: String,
    model: String,
    brand: String,
    unit: String,
    number: Number,
    price: Number,
    totalPrice: Number,
    retail: Number,
    source: String,
    remarks: String
  },
  {
    timestamps: true
  }
);
const sell = mongoose.model("sell", sellSchema);
module.exports = {
  commodity,
  sell
};

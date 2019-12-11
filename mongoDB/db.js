var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/banyan",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("mongodb success");
  }
);
// 商品信息
const commoditySchema = mongoose.Schema(
  {
    name: String,
    model: String,
    brand: String,
    unit: { type: String, default: "只" },
    number: { type: Number, default: 1 },
    price: { type: Number, default: 1 },
    totalPrice: { type: Number, default: 1 },
    MSRP: { type: Number, default: 1 },
    TMSRP: { type: Number, default: 1 },
    remarks: String,
    p_id: String,
    s_id: Array
  },
  {
    timestamps: true
  }
);
const commodity = mongoose.model("commodity", commoditySchema);

// 采购商品
const purchaseSchema = mongoose.Schema(
  {
    name: String,
    model: String,
    brand: String,
    unit: { type: String, default: "只" },
    number: { type: Number, default: 1 },
    price: { type: Number, default: 1 },
    totalPrice: { type: Number, default: 1 },
    MSRP: { type: Number, default: 1 },
    TMSRP: { type: Number, default: 1 },
    from: String
  },
  {
    timestamps: true
  }
);
const purchase = mongoose.model("purchase", purchaseSchema);

// 出售商品
const sellSchema = mongoose.Schema(
  {
    name: String,
    model: String,
    brand: String,
    unit: { type: String, default: "只" },
    number: { type: Number, default: 1 },
    MSRP: { type: Number, default: 1 },
    TMSRP: { type: Number, default: 1 },
    retail: { type: Number, default: 1 },
    totalRetail: { type: Number, default: 1 },
    remarks: String,
    to: String
  },
  {
    timestamps: true
  }
);
const sell = mongoose.model("sell", sellSchema);

module.exports = { purchase, commodity, sell };

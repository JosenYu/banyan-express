// *存储信息
// 商品信息
const commodity = {
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
  s_id: Array,
  user_id: String
};

// 采购商品
const purchase = {
  name: String,
  model: String,
  brand: String,
  unit: { type: String, default: "只" },
  number: { type: Number, default: 1 },
  price: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 1 },
  MSRP: { type: Number, default: 1 },
  TMSRP: { type: Number, default: 1 },
  from: String,
  user_id: String
};

// 出售商品
const sell = {
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
  to: String,
  user_id: String
};

module.exports = { purchase, commodity, sell };

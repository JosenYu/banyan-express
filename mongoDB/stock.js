// *进出口货物以及物品信息
// 商品模型
const model = {
  name: String,
  model: String,
  brand: String,
  unit: { type: String, default: "只" }
};

// 库存表
const stock = {
  name: String,
  model: String,
  brand: String,
  unit: { type: String, default: "只" },
  surplusNumber: { type: Number, default: 1 },
  totalNumber: { type: Number, default: 1 },
  price: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 1 }
};

// 出售商品
const sell = {
  stock_id: String,
  sellNumber: { type: Number, default: 1 },
  retail: { type: Number, default: 1 },
  totalRetail: { type: Number, default: 1 }
};

module.exports = { stock, sell, model };

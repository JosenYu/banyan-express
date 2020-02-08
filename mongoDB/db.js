// var mongoose = require("mongoose");
// var storage = require("./storage");
// var users = require("./users");
// // 数据库 链接
// mongoose.connect(
//   "mongodb://localhost:27017/banyan",
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   err => {
//     if (err) throw err;
//     console.log("mongodb success");
//   }
// );
// // 商品信息
// const commodity = mongoose.model(
//   "commodity",
//   mongoose.Schema(storage.commodity, {
//     timestamps: true
//   })
// );

// // 采购商品
// const purchase = mongoose.model(
//   "purchase",
//   mongoose.Schema(storage.purchase, {
//     timestamps: true
//   })
// );

// // 出售商品
// const sell = mongoose.model(
//   "sell",
//   mongoose.Schema(storage.sell, {
//     timestamps: true
//   })
// );
// // 用户信息
// const user = mongoose.model(
//   "user",
//   mongoose.Schema(users.user, {
//     timestamps: true
//   })
// );

// module.exports = { purchase, commodity, sell, user };

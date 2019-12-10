// 售卖
var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");
var msg = require("../utils/message");
router.get("/", function(req, res, next) {
  res.render("sell");
});
// 出售商品
router.post("/sellCommodity", (req, res) => {
  db.sell.create(req.body, (err, doc) => {
    if (err) {
      res.send(msg.fail([], err));
    } else {
      res.send(msg.success(doc));
    }
  });
});
module.exports = router;

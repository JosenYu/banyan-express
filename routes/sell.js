// 售卖
var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");
router.get("/", function(req, res, next) {
  res.render("sell");
});
// 出售商品
router.post("/sellCommodity", (req, res) => {
  db.sell.create(req.body, (err, doc) => {
    if (err) {
      res.status(500).json(err);
      throw err;
    } else {
      res.status(200).json(doc);
    }
  });
});
module.exports = router;

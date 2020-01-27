// 采购
var express = require("express");
var router = express.Router();
const db = require("../mongoDB/db");
var msg = require("../utils/message");

router.get("/", function(req, res, next) {
  res.render("purchase");
  debugger;
});

// 采购商品
router.post("/purchaseCommodity", (req, res) => {
  db.purchase.create(req.body, (err, doc) => {
    if (err) {
      console.error(err);
      res.send(msg.fail([], err));
      throw err;
    } else {
      res.send(msg.success(doc));
    }
  });
});

module.exports = router;

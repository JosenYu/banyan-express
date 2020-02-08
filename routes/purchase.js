// 采购
var express = require("express");
var router = express.Router();
const db = require("../mongoDB/db");

router.get("/", function(req, res, next) {
  res.render("purchase");
});

// 采购商品
router.post("/purchaseCommodity", (req, res) => {
  db.purchase.create(req.body, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500);
      throw err;
    } else {
      res.status(200).json(doc);
    }
  });
});

module.exports = router;

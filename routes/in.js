// 出货
var express = require("express");
var router = express.Router();
module.exports = router;

router.get("/", function(req, res, next) {
  res.render("in", { title: "in" });
});

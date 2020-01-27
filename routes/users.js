var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

/* GET users listing. */
router.get("/", function(req, res) {
  res.render("users", { title: "users" });
});
// sign In
router.get("/signIn", (req, res) => {
  db.user.findOne(
    {
      account: req.query.account,
      password: req.query.password
    },
    (err, doc) => {
      if (err) {
        res.json({
          err,
          msg: "fail"
        });
        throw err;
      } else {
        res.json({
          doc,
          msg: "ok"
        });
      }
    }
  );
});
// sign UP
router.post("/signUp", (req, res) => {
  db.user.create(req.body, (err, doc) => {
    if (err) {
      console.error(err);
      res.json({
        err,
        msg: "fail"
      });
      throw err;
    } else {
      res.json({
        doc,
        msg: "ok"
      });
    }
  });
});
module.exports = router;

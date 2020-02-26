var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

/* GET info page. */
router.get("/", function(req, res, next) {
  res.render("customer", { title: "customer" });
});

// 创建进货源
router.post("/createImporter", (req, res) => {
  db.customer_importer.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json({ data: doc });
  });
});
// 查询进货联络人
router.get("/getImporter", (req, res) => {
  const name = req.query.linkMan;
  db.customer_importer.find(
    {
      linkMan: { $regex: name }
    },
    (err, doc) => {
      if (err) throw err;
      res.json({ data: doc });
    }
  );
});

// 创建出口人
router.post("/createExporter", (req, res) => {
  db.customer_exporter.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json({ data: doc });
  });
});

// 查询出货联络人
router.get("/getExporter", (req, res) => {
  const linkMan = req.query.linkMan;
  db.customer_exporter.find(
    {
      linkMan: { $regex: linkMan }
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

module.exports = router;

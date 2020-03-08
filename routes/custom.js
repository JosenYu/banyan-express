var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

/* GET info page. */
router.get("/", function(req, res, next) {
  res.render("custom", { title: "custom" });
});

// 创建进货源
router.post("/createImporter", (req, res) => {
  const importer = {
    company: req.body.company,
    linkman: req.body.linkman,
    tel: req.body.tel,
    address: req.body.address
  };
  db.custom_importer.create(importer, (err, doc) => {
    if (err) throw err;
    res.json({ doc });
  });
});
// 查询进货联络人
router.get("/getImporter", (req, res) => {
  db.custom_importer.find(
    {
      linkman: { $regex: req.query.linkman }
    },
    (err, doc) => {
      if (err) throw err;
      res.json({ doc });
    }
  );
});

// 创建出口人
router.post("/createExporter", (req, res) => {
  db.custom_exporter.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json({ doc });
  });
});

// 查询出货联络人
router.get("/getExporter", (req, res) => {
  db.custom_exporter.find(
    {
      linkman: { $regex: req.query.linkman }
    },
    (err, doc) => {
      if (err) throw err;
      res.json({ doc });
    }
  );
});

module.exports = router;

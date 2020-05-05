var express = require("express");
var router = express.Router();
var db = require("../mongoDB/db");

const convertPinyin = require("../utils/pinyin");
// console.log(linkman);

/* GET info page. */
router.get("/", function (req, res, next) {
  res.render("customer", { title: "customer" });
});

// 创建进货源
router.post("/createImporter", (req, res) => {
  const letter = convertPinyin(req.body.linkMan)
    .toLocaleUpperCase()
    .split("")[0];
  Object.assign(req.body, { letter: letter });
  db.custom_importer.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json({ doc });
  });
});
// 查询进货联络人
router.get("/getImporter", (req, res) => {
  db.custom_importer.find(
    {
      linkman: { $regex: req.query.linkman },
    },
    (err, doc) => {
      if (err) throw err;
      res.json({ doc });
    }
  );
});
// 创建出口人
router.post("/createExporter", (req, res) => {
  const letter = convertPinyin(req.body.linkMan)
    .toLocaleUpperCase()
    .split("")[0];
  Object.assign(req.body, { letter: letter });
  db.custom_exporter.create(req.body, (err, doc) => {
    if (err) throw err;
    res.json({ doc });
  });
});

// 查询出货联络人
router.get("/getExporter", (req, res) => {
  db.custom_exporter.find(
    {
      linkman: { $regex: req.query.linkman },
    },
    (err, doc) => {
      if (err) throw err;
      res.json({ doc });
    }
  );
});
// 查询所有 进/出口联系人
router.get("/getAll", (req, res) => {
  const getImporter = () =>
    new Promise((resolve) => {
      db.custom_exporter.find({}, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  const getExporter = () =>
    new Promise((resolve) => {
      db.custom_exporter.find({}, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });

  (async function () {
    const importer = await getImporter();
    const exporter = await getExporter();
    return { importer, exporter };
  })().then((result) => {
    res.json(result);
  });
});
module.exports = router;

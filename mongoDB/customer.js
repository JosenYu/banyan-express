// *用户 信息
// 进口商
const importer = {
  initials: String,
  company: String,
  linkman: String,
  tel: Number,
  address: String,
  letter: {
    type: String,
    default: "#",
  },
};
// 出口商
const exporter = {
  initials: String,
  company: String,
  linkman: String,
  tel: Number,
  address: String,
  letter: {
    type: String,
    default: "#",
  },
};

module.exports = { importer, exporter };
// 改变 input file
function change() {
  const [file] = document.getElementById("file2").files;
  console.log(file);
  let cur = 0;
  const SIZE = 1 * 1024 * 1024;
  var fileChunkList = [];
  const TOTAL = Math.ceil(file.size / SIZE);
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + SIZE) });
    cur += SIZE;
  }
  console.log(fileChunkList);
  fileChunkList.forEach((value, index) => {
    let fd = new FormData();
    fd.append("files", value.file);
    fd.append("cur", index);
    fd.append("name", file.name);
    fd.append("total", TOTAL);
    fetch("/aaa", {
      method: "post",
      body: fd
    })
      .then(response => console.log(response))
      .catch(error => console.error("Error:", error));
  });
}
// 提交按钮
function up() {
  var data = { name: "123.mp4" };
  fetch("/aaa2", {
    method: "put",
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => console.log(response))
    .catch(error => console.error("Error:", error));
}

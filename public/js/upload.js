// 改变 input file
async function change() {
  const [file] = document.getElementById("file2").files;
  if (!file) return;
  // console.log(file);
  let cur = 0;
  const SIZE = 1 * 1024 * 1024;
  let fileChunkList = [];
  const TOTAL = Math.ceil(file.size / SIZE);
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + SIZE) });
    cur += SIZE;
  }
  // console.log(fileChunkList);
  fileChunkList.forEach((value, index) => {
    let fd = new FormData();
    fd.append("files", value.file);
    fd.append("cur", index);
    fd.append("name", file.name);
    fd.append("total", TOTAL);
    fetch("upload/aaa", {
      method: "post",
      body: fd
    })
      .then(response => console.log(response))
      .catch(error => console.error("Error:", error));
  });
  alert("切片完成，并提交后台。。");
}
// 提交按钮
function upload() {
  var data = { name: "123.mp4" };
  fetch("upload/aaa2", {
    method: "post",
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => console.log(response))
    .catch(error => console.error("Error:", error));
}

# Banyan-express

## 理解 async/await

[原文](https://juejin.im/post/596e142d5188254b532ce2da)

async 函数内部 return 返回的值。会成为 then 方法回调函数的参数。

```js
async function f() {
  return "hello world";
}
f().then(v => console.log(v)); // hello world
```

如果 async 函数内部抛出异常，则会导致返回的 Promise 对象状态变为 reject 状态。抛出的错误而会被 catch 方法回调函数接收到。

```js
async function e() {
  throw new Error("error");
}
e()
  .then(v => console.log(v))
  .catch(e => console.log(e));
```

正常情况下，await 命令后面跟着的是 Promise ，如果不是的话，也会被转换成一个 立即 resolve 的 Promise

```js
async function f() {
  return await 1;
}
f().then(v => console.log(v)); // 1
```

async 函数返回的 Promise 对象，必须等到内部所有的 await 命令的 Promise 对象执行完，才会发生状态改变

```js
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
async function f() {
  await delay(1000);
  await delay(2000);
  await delay(3000);
  return "done";
}

f().then(v => console.log(v)); // 等待6s后才输出 'done'
```

---

## mongoose

判断大小

- \$gt:大于
- \$lt:小于
- \$gte:大于或等于
- \$lte:小于或等于

模糊查询 `{ $regex: NAME }`

---

## linux 解压

- tar -xvf file.tar //解压 tar 包
- tar -xzvf file.tar.gz //解压 tar.gz
- tar -xjvf file.tar.bz2 //解压 tar.bz2
- tar -xZvf file.tar.Z //解压 tar.Z
- unrar e file.rar //解压 rar
- unzip file.zip //解压 zip

---

## 本地文件上传服务器

1. 从服务器上下载文件

   scp username@servername:/path/filename /var/www/local_dir（本地目录）

   例如 scp root@192.168.0.101:/var/www/test.txt  把 192.168.0.101 上的/var/www/test.txt  的文件下载到/var/www/local_dir（本地目录）

2. 上传本地文件到服务器

   scp /path/filename username@servername:/path

   例如 scp /var/www/test.php  root@192.168.0.101:/var/www/  把本机/var/www/目录下的 test.php 文件上传到 192.168.0.101 这台服务器上的/var/www/目录中（之后会提醒输入登陆服务器的密码）

3. 从服务器下载整个目录

   scp -r username@servername:/var/www/remote_dir/（远程目录） /var/www/local_dir（本地目录）

   例如:scp -r root@192.168.0.101:/var/www/test  /var/www/

4. 上传目录到服务器

   scp  -r local_dir username@servername:remote_dir

   例如：scp -r test  root@192.168.0.101:/var/www/   把当前目录下的 test 目录上传到服务器的/var/www/ 目录

---

## Nginx 停止服务和各种命令

1. 从容停止: kill -QUIT 主进程号

2. 快速停止: kill -TERM 主进程号   或   kill -INT 主进程号

3. 强制停止: kill -9 主进程号

4. 重启：

   - 方法一：进入 nginx 可执行目录 sbin 下，输入命令./nginx -s reload  即可
   - 方法二：查找当前 nginx 进程号，然后输入命令：kill -HUP 进程号 实现重启 nginx 服务

---

## 大文件上传

### web

由于自己测试用不考虑美观问题直接用 html 元素，**没有在乎样式问题进度条，以及切片完成后的提示，可以提交切片，等等样式页面问题都没有去做完善：）**

```html
<div>
  <input id="file2" type="file" , name="file2" onchange="change()" />
  <button id="upLoad" type="submit" onclick="upload()">upload</button>
</div>
```

js 部分 我用提交数据使用 `fetch` 方法具体使用 请移步 [mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)，

具体思路如下

1. 获取文件将其切片
2. 将切片文件上传之后台
3. 告知文件上传完成

```js
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
// 切片完成，提交按钮
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
```

### nodeJS（Express）

具体思路如下

1. 接收 web 传来等切片文件 ,使用 [formidable](https://www.jianshu.com/p/fa358da69c18) 插件接收 formdata 数据
2. 将获取的 formdata 放入 arr 对象，根据 cur 进行排序，避免合并的时候合并顺序混乱
3. 将文件合并用 [pipe](http://nodejs.cn/api/stream.html#stream_event_pipe)

```js
// 获取提交文件
router.post("/aaa", (req, res) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../videos/";
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if (err) return;
    // console.log("fields", fields);
    // console.log("files", files);

    arr.push({
      name: fields.name,
      cur: fields.cur,
      total: fields.total,
      path: files.files.path
    });

    /**
     * 排序根据 cur判断M
     * @param 0 开始
     */
    arr.sort((a, b) => a.cur - b.cur);
    // console.log(arr);
    res.send(msg.success("ok"));
  });
});
// 获取合并信息
router.post("/aaa2", (req, res) => {
  // 需要合并的数组
  const checkList = arr.filter(v => v.name === req.body.name);
  arr = arr.filter(v => v.name !== req.body.name);
  const [item] = checkList;
  // 文件名称
  const NAME = item.name;
  // 写入流
  const writeStream = fs.createWriteStream(__dirname + "/../videos/" + NAME);
  merage(checkList, writeStream);
  res.json(msg.success());
});

// *合并文件
async function merage(checkList, writeStream) {
  // *一定要同步合并 不能异步
  for (const iterator of checkList) {
    // 写入
    await pipeStream(iterator, writeStream);
  }
}
// 写入流
const pipeStream = (iterator, writeStream) =>
  new Promise(resolve => {
    const readStream = fs.createReadStream(iterator.path);
    readStream.pipe(writeStream, { end: false });
    // 读取结束 删除文件
    readStream.on("end", () => {
      // 删除文件
      fs.unlinkSync(iterator.path);
      console.log("文件已删除", iterator.path);
      resolve();
    });
  });
```

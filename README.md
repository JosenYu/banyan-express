# Banyan-express

## 理解 async/await

[原文](https://juejin.im/post/596e142d5188254b532ce2da)

async 函数内部 return 返回的值。会成为 then 方法回调函数的参数。

```js
async function f() {
  return "hello world";
}
f().then((v) => console.log(v)); // hello world
```

如果 async 函数内部抛出异常，则会导致返回的 Promise 对象状态变为 reject 状态。抛出的错误而会被 catch 方法回调函数接收到。

```js
async function e() {
  throw new Error("error");
}
e()
  .then((v) => console.log(v))
  .catch((e) => console.log(e));
```

正常情况下，await 命令后面跟着的是 Promise ，如果不是的话，也会被转换成一个 立即 resolve 的 Promise

```js
async function f() {
  return await 1;
}
f().then((v) => console.log(v)); // 1
```

async 函数返回的 Promise 对象，必须等到内部所有的 await 命令的 Promise 对象执行完，才会发生状态改变

```js
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
async function f() {
  await delay(1000);
  await delay(2000);
  await delay(3000);
  return "done";
}

f().then((v) => console.log(v)); // 等待6s后才输出 'done'
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
      body: fd,
    })
      .then((response) => console.log(response))
      .catch((error) => console.error("Error:", error));
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
      "Content-Type": "application/json",
    },
  })
    .then((response) => console.log(response))
    .catch((error) => console.error("Error:", error));
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
  form.parse(req, function (err, fields, files) {
    if (err) return;
    // console.log("fields", fields);
    // console.log("files", files);

    arr.push({
      name: fields.name,
      cur: fields.cur,
      total: fields.total,
      path: files.files.path,
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
  const checkList = arr.filter((v) => v.name === req.body.name);
  arr = arr.filter((v) => v.name !== req.body.name);
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
  new Promise((resolve) => {
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

## 启动并支持 http/https 方法

简述：开启 3001-http，3002-https，2 个端口的服务，创建 3000-net 服务将传过来的 tcp/ip ，服务分发给 http/https，分发判断逻辑是传过来的是什么协议就分发给那个协议的服务上

1. 获取.key.pem nginx 证书（略阿里云上申请/下载）

2. 将证书放在项目中并引入

   ```js
   var https = require("https");
   var fs = require("fs");
   // *同步读取密钥和签名证书
   var options = {
     key: fs.readFileSync(__dirname + "/key.key"),
     cert: fs.readFileSync(__dirname + "/pem.pem"),
   };
   ```

3. 创建 https 服务

   ```js
   var httpsServer = https.createServer(options, app);
   httpsServer.listen(3002);
   ```

4. 开启 net 服务

   [net 服务介绍](http://nodejs.cn/api/net.html#net_net_createserver_options_connectionlistener)

   ```js
   // 2、创建服务器进行代理
   net
     .createServer(function (socket) {
       socket.once("data", function (buf) {
         // console.log(buf[0]);
         // https 数据流的第一位是十六进制“16”，转换成十进制就是 22
         var address = buf[0] === 22 ? httpsPort : httpPort;
         //创建一个指向 https 或 http 服务器的链接
         var proxy = net.createConnection(address, function () {
           proxy.write(buf);
           //反向代理的过程，tcp 接受的数据交给代理链接，代理链接服务器端返回数据交由 socket 返回给客户端
           socket.pipe(proxy).pipe(socket);
         });
         proxy.on("error", function (err) {
           console.log(err);
         });
       });
       socket.on("error", function (err) {
         console.log(err);
       });
     }, app)
     .listen(3003); // 执行函数 此处是真正能够访问的端口，网站默认是 80 端口。
   ```

## ES6 数组对象的基本操作

### 1.去重

这也是一道常见的面试题，怎么对 JS 的数组去重。在 ES6 的时代，有个非常快速且简单的方法，使用 new Set()以及 Array.from()或者展开运算符(...)

```js
var fruits = [“banana”, “apple”, “orange”, “watermelon”, “apple”, “orange”, “grape”, “apple”];
// 方法一
var uniqueFruits = Array.from(new Set(fruits));
console.log(uniqueFruits); // returns [“banana”, “apple”, “orange”, “watermelon”, “grape”]
// 方法二
var uniqueFruits2 = […new Set(fruits)];
console.log(uniqueFruits2); // returns [“banana”, “apple”, “orange”, “watermelon”, “grape”]

```

### 2.替换

日常开发中经常需要替换或者删除一些指定的数据，遇到这种场景时一定要联想到 Array.protoType.splice 这个方法。传参时稍微复杂点:

- 第一个参数是开始的索引
- 第二个参数是需要删除的数量
- 剩下的就是需要添加的值**可以是一个或者多个**。

```js
var fruits = [“banana”, “apple”, “orange”, “watermelon”, “apple”, “orange”, “grape”, “apple”];
fruits.splice(0, 2, “potato”, “tomato”);
console.log(fruits); // returns [“potato”, “tomato”, “orange”, “watermelon”, “apple”, “orange”, “grape”, “apple”]
```

### 3.遍历数组

平时我们使用最多的就是数组的.map 方法，其实还有一个方法也能达到一样的目的，用法比较冷门，所以我们总是忽视，那就是 Array.from

```js
var friends = [
    { name: ‘John’, age: 22 },
    { name: ‘Peter’, age: 23 },
    { name: ‘Mark’, age: 24 },
    { name: ‘Maria’, age: 22 },
    { name: ‘Monica’, age: 21 },
    { name: ‘Martha’, age: 19 },
]

var friendsNames = Array.from(friends, ({name}) => name);
console.log(friendsNames); // returns [“John”, “Peter”, “Mark”, “Maria”, “Monica”, “Martha”]

```

### 4.清空数组

有时我们需要清空一个数组，比如用户点击了清空购物车。可以一条一条地删除，但是很少有这么可爱的程序员，哈哈。其实一行代码就能搞定，那就是直接将之 length 设置成 0

```js
var fruits = [“banana”, “apple”, “orange”, “watermelon”, “apple”, “orange”, “grape”, “apple”];
fruits.length = 0;
console.log(fruits); // returns []

```

### 5.数组转换成对象

有时候需要将数组转换成对象的形式，使用.map()一类的迭代方法能达到目的，这里还有个更快的方法，前提是你正好希望对象的 key 就是数组的索引

```js
var fruits = [“banana”, “apple”, “orange”, “watermelon”];
var fruitsObj = { …fruits };
console.log(fruitsObj); // returns {0: “banana”, 1: “apple”, 2: “orange”, 3: “watermelon”, 4: “apple”, 5: “orange”, 6: “grape”, 7: “apple”}

```

### 6.填充数组

创建数组的时候，你有没有遇到过需要填充上默认值的场景，你肯定首先想到的就是循环这个数组。ES6 提供了更便捷的.fill 方法

```js
var newArray = new Array(10).fill(“1”);
console.log(newArray); // returns [“1”, “1”, “1”, “1”, “1”, “1”, “1”, “1”, “1”, “1”, “1”]

```

### 7.合并数组

你知道如何合并数组吗，答案就是.concat()。哈哈，但是今天的主角是 ES6 的展开运算符(...)

```js
var fruits = [“apple”, “banana”, “orange”];
var meat = [“poultry”, “beef”, “fish”];
var vegetables = [“potato”, “tomato”, “cucumber”];
var food = […fruits, …meat, …vegetables];
console.log(food); // [“apple”, “banana”, “orange”, “poultry”, “beef”, “fish”, “potato”, “tomato”, “cucumber”]
```

### 8.两个数组的交集

找出两个数组的交集算是一道经典的 JS 面试题了，这题能很好地考察候选人的逻辑是否清晰，对数组的掌握是否熟练。这题的答案有很多，下面展示的是 ES6 的简洁写法

```js
var numOne = [0, 2, 4, 6, 8, 8];
var numTwo = [1, 2, 3, 4, 5, 6];
var duplicatedValues = […new Set(numOne)].filter(item => numTwo.includes(item));
console.log(duplicatedValues); // returns [2, 4, 6]

```

### 9.去除假值

首先，我们熟悉下假值(falsy values)是什么？在 JS 中，假值有：false、0、''、null、NaN、undefined。现在我们找到这些假值并将它们移除，这里使用的是.filter 方法

```js
var mixedArr = [0, “blue”, “”, NaN, 9, true, undefined, “white”, false];
var trueArr = mixedArr.filter(Boolean);
console.log(trueArr); // returns [“blue”, 9, true, “white”]

```

### 10.随机值

从数组中获取随机的一个值，也是一道经典的面试题哦。其实考察的核心知识是随机生成一个值 x：x >= 0 并且 x < 数组的 length

```js
var colors = [“blue”, “white”, “green”, “navy”, “pink”, “purple”, “orange”, “yellow”, “black”, “brown”];
var randomColor = colors[(Math.floor(Math.random() * (colors.length)))]
```

### 11.倒序

怎么对数组进行倒序？只需要一行代码

```js
var colors = [“blue”, “white”, “green”, “navy”, “pink”, “purple”, “orange”, “yellow”, “black”, “brown”];
var reversedColors = colors.reverse();
// 或者 colors.slice().reverse();
// 两者有啥区别？
console.log(reversedColors); // returns [“brown”, “black”, “yellow”, “orange”, “purple”, “pink”, “navy”, “green”, “white”, “blue”]

```

### 12.lastIndexOf()

很多时候我们查找元素是否存在于某个数组中，经常使用 indexOf 方法，常常忽略 lastIndexOf 方法，后者会被使用的一个场景就是，某个数组中有重复的数据。

```js
var nums = [1, 5, 2, 6, 3, 5, 2, 3, 6, 5, 2, 7];
var lastIndex = nums.lastIndexOf(5);
console.log(lastIndex); // returns 9
```

### 13.求和

对数组中的所有元素进行求和，哈哈，又是一道如数家珍的面试题。答案也是很多，条条大道通罗马，这里使用的是 reduce，reduce 方法是很值得学习的知识点，用处很多。

```js
var nums = [1, 5, 2, 6];
var sum = nums.reduce((x, y) => x + y);
console.log(sum); // returns 14
```

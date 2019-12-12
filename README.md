# Banyan-express

## 接口文档

### 创建商品库存（create）

1. 接口地址: `/createCommodity`
2. 请求方式: post
3. 参数
   |NAME|NEED|DEFAULT|INTRODUCE|
   |---|---|---|---|
   |name|yes|null|名称|
   |model|yes|null|模型|
   |brand|yes|null|品牌|
   |number|yes|1|数量|
   |unit|yes|只|单位|
   |price|yes|1|进价|
   |totalPrice|yes|1|总进价|
   |MSRP|yes|1|建议售价|
   |TMSRP|yes|1|建议总售价|
   |remarks|yes|1|备注信息|
   |from|yes|1|来源|

### 获取商品列表（find）

1. 接口地址: `/getCommodity`
2. 请求方式: get
3. 参数
   |NAME|NEED|DEFAULT|INTRODUCE|
   |---|---|---|---|
   |name|no|''|名称|
   |model|no|''|模型|
   |brand|no|''|品牌|
   |pageSize|no|10|展示多少条|
   |pageCurrent|no|1|当前页|

### 商品出库（update）

1. 接口地址: `/updateCommodity`
2. 请求方式: post
3. 参数
   |NAME|NEED|DEFAULT|INTRODUCE|
   |---|---|---|---|
   |ID|yes|null|Commodity.\_id |
   |name|yes|null|名称|
   |model|yes|null|模型|
   |brand|yes|null|品牌|
   |number|yes|null|数量|
   |unit|yes|只|单位|
   |MSRP|yes|1|建议售价|
   |TMSRP|yes|1|建议总售价|
   |retail|yes|1|售价|
   |totalRetail|yes|1|总售价|
   |remarks|yes|1|备注信息|
   |to|yes|1|出处|

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

## mongoose

判断大小

- \$gt:大于
- \$lt:小于
- \$gte:大于或等于
- \$lte:小于或等于

## linux 解压

- tar -xvf file.tar //解压 tar 包
- tar -xzvf file.tar.gz //解压 tar.gz
- tar -xjvf file.tar.bz2 //解压 tar.bz2
- tar -xZvf file.tar.Z //解压 tar.Z
- unrar e file.rar //解压 rar
- unzip file.zip //解压 zip

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

## Nginx 停止服务和各种命令

1. 从容停止: kill -QUIT 主进程号

2. 快速停止: kill -TERM 主进程号   或   kill -INT 主进程号

3. 强制停止: kill -9 主进程号

4. 重启：

   - 方法一：进入 nginx 可执行目录 sbin 下，输入命令./nginx -s reload  即可
   - 方法二：查找当前 nginx 进程号，然后输入命令：kill -HUP 进程号 实现重启 nginx 服务

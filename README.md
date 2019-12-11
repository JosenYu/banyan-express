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


# Hash
****

## 介绍

Hash 是一个键值对（key - value）集合，其中 value 的形式如： `value=[{field1，value1}，...{fieldN，valueN}]`。Hash 特别适合用于存储对象。

Hash 与 String 对象的区别如下图所示:

![image.png](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/20261124174140797.png)
****
## 应用场景


### 缓存对象

Hash 类型的 （key，field， value） 的结构与对象的（对象id， 属性， 值）的结构相似，也可以用来存储对象。

我们以用户信息为例，它在关系型数据库中的结构是这样的：

![image.png](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/20261124174300750.png)

我们可以使用如下命令，将用户对象的信息存储到 Hash 类型：
![image.png](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/20261124174313892.png)

Redis Hash 存储其结构如下图：
![image.png](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/20261124174327912.png)

在介绍 String 类型的应用场景时有所介绍，String + Json也是存储对象的一种方式，那么存储对象时，到底用 String + json 还是用 Hash 呢？

一般对象用 String + Json 存储，对象中某些频繁变化的属性可以考虑抽出来用 Hash 类型存储。
****
### 购物车

以用户 id 为 key，商品 id 为 field，商品数量为 value，恰好构成了购物车的3个要素，如下图所示。
![image.png](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/20261124174531953.png)

涉及的命令如下：

- 添加商品：HSET cart:{用户id} {商品id} 1
- 添加数量：HINCRBY cart:{用户id} {商品id} 1
- 商品总数：HLEN cart:{用户id}
- 删除商品：HDEL cart:{用户id} {商品id}
- 获取购物车所有商品：HGETALL cart:{用户id}

当前仅仅是将商品ID存储到了Redis 中，在回显商品具体信息的时候，还需要拿着商品 id 查询一次数据库，获取完整的商品的信息。
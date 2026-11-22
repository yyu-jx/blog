
![COUNT 查询示例](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261117211956-06ddba5a560c.png)





# count(主键字段) 执行过程是怎样的？
在通过 count 函数统计有多少个记录时，MySQL 的 server 层会维护一个名叫 count 的变量。

server 层会循环向 InnoDB 读取一条记录，如果 count 函数指定的参数不为 NULL，那么就会将变量 count 加 1，直到符合查询的全部记录被读完，就退出循环。最后将 count 变量的值发送给客户端。

用下面这条语句作为例子：

```sql
//id 为主键值
select count(id) from t_order;
```

如果表里只有主键索引，没有二级索引时，那么，InnoDB 循环遍历聚簇索引，将读取到的记录返回给 server 层，然后读取记录中的 id 值，就会用 id 值判断是否为 NULL，如果不为 NULL，就将 count 变量加 1。

这是因为相同数量的二级索引记录可以比聚簇索引记录占用更少的存储空间，所以二级索引树比聚簇索引树小，这样遍历二级索引的 I/O 成本比遍历聚簇索引的 I/O 成本小，因此「优化器」优先选择的是二级索引。

# count(1) 执行过程是怎样的？

用下面这条语句作为例子：
```sql
select count(1) from t_order;
```

如果表里只有主键索引，没有二级索引时。

那么，InnoDB 循环遍历聚簇索引（主键索引），将读取到的记录返回给 server 层，但是不会读取记录中的任何字段的值，因为 count 函数的参数是 1，不是字段，所以不需要读取记录中的字段值。参数 1 很明显并不是 NULL，因此 server 层每从 InnoDB 读取到一条记录，就将 count 变量加 1。

可以看到，count(1) 相比 count(主键字段) 少一个步骤，就是不需要读取记录中的字段值，所以通常会说 count(1) 执行效率会比 count(主键字段) 高一点。
不过需要注意，上面这个结论只适用于「表里没有任何二级索引、只能扫聚簇索引」这种场景。如果表上存在二级索引，优化器会把 count(主键字段) 也改写成扫描 key_len 最小的二级索引（参见后文），此时 count(1) 和 count(主键字段) 的执行过程完全一致，性能上没有差异。


# count（\*) 执行过程是怎样的？


看到 * 这个字符的时候，是不是大家觉得是读取记录中的所有字段值？

对于 select * 这条语句来说是这个意思，但是在 count(*) 中并不是这个意思。

count(\*) 其实等于 count(0)，也就是说，当你使用 count(*) 时，MySQL 会将 * 参数转化为参数 0 来处理。

所以，count(*) 执行过程跟 count(1) 执行过程基本一样的，性能没有什么差异。
在 MySQL 5.7 的官方手册中有这么一句话：

==🟠InnoDB handles SELECT COUNT(\*) and SELECT COUNT(1) operations in the same way. There is no performance difference.==
==🟠翻译：InnoDB以相同的方式处理SELECT COUNT（\*）和SELECT COUNT（1）操作，没有性能差异。==

而且 MySQL 会对 count(*) 和 count(1) 有个优化，如果有多个二级索引的时候，优化器会使用key_len 最小的二级索引进行扫描。
只有当没有二级索引的时候，才会采用主键索引来进行统计。

# count(字段) 执行过程是怎样的？

count(字段) 的执行效率相比前面的 count(1)、 count(*)、 count(主键字段) 执行效率是最差的。
用下面这条语句作为例子：

```sql
// name不是索引，普通字段
select count(name) from t_order;
```

对于这个查询来说，会采用全表扫描的方式来计数，所以它的执行效率是比较差的。


# 如何优化 count(*)？
### 第一种，近似值
如果你的业务对于统计个数不需要很精确，比如搜索引擎在搜索关键词的时候，给出的搜索结果条数是一个大概值。

![COUNT 近似统计示例](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261117215523-6c93907b84a8.png)

![COUNT 近似统计补充图](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261117215638-fdcf1bdbc923.png)

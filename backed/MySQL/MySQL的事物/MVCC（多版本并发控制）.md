# MVCC（多版本并发控制）


- 针对快照读（普通 select 语句），是通过 MVCC 方式解决了幻读，因为可重复读隔离级别下，事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的，即使中途有其他事务插入了一条数据，是查询不出来这条数据的，所以就很好地避免了幻读问题。
-  针对当前读（select ... for update 等语句），是通过 next-key lock（记录锁+间隙锁）方式解决了幻读，因为当执行 select ... for update 语句的时候，会加上 next-key lock，如果有其他事务在 next-key lock 锁范围内插入了一条记录，那么这个插入语句就会被阻塞，无法成功插入，所以就很好地避免了幻读问题。

- 可重复读隔离级是由 MVCC（多版本并发控制）实现的，实现的方式是开始事务后（执行 begin 语句后），在执行第一个查询语句后，会创建一个 Read View，后续的查询语句利用这个 Read View，通过这个 Read View 就可以在 undo log 版本链找到事务开始时的数据，所以事务过程中每次查询的数据都是一样的，即使中途有其他事务插入了新纪录，是查询不出来这条数据的，所以就很好地避免了幻读问题。

### Undo Log + Read View + 版本链，就是 InnoDB 实现 MVCC 的核心方式。

你可以把它们的分工记成：

1. Undo Log：保存历史数据，解决旧版本数据从哪里来。
    
2. 版本链：把新旧数据版本串联起来，方便查找。
    
3. Read View：判断当前事务应该读取哪个版本，解决应该读取哪个数据的问题。
    

最终实现的效果就是：

多个事务可以同时读取同一条数据的不同版本，减少读写之间的锁竞争，提高并发性能。

再记住一个面试知识点：

- READ COMMITTED 和 REPEATABLE READ 都使用 MVCC。
    
- 它们的主要区别是 Read View 的创建时机不同。
    

这就是 InnoDB 中 MVCC 的核心原理。


|名词|作用|
|---|---|
|Undo Log|保存旧版本数据，支持回滚和 MVCC|
|版本链|将一条记录的多个历史版本关联起来|
|MVCC|通过多版本机制实现并发读写|
|Read View|判断当前事务可以看到哪个版本|
|Purge|清理不再需要的历史版本|
|长事务|可能导致旧版本长期无法清理|

## 一、先理解：为什么需要回滚日志？

假设你的数据库有一条用户数据：

|id|name|money|
|---|---|---|
|1|张三|1|

现在有一个事务 A 开始查询这条数据。

```
BEGIN;
SELECT money FROM user WHERE id = 1;
```

事务 A 查询到：

```
money = 1
```

此时，另外一个事务 B 修改了这条数据：

```
BEGIN;
UPDATE user SET money = 2 WHERE id = 1;
COMMIT;
```

现在数据库最新的数据已经变成了：

```
money = 2
```

问题来了：

事务 A 再次查询时，应该看到 1 还是 2？

在 MySQL 默认的 RR（可重复读）隔离级别下，事务 A 应该继续看到 1。

但是数据库最新的数据明明已经是 2 了，MySQL 怎么让 A 看到旧数据？

答案就是：Undo Log（回滚日志）+ MVCC。
****
## 二、Undo Log 是什么？怎么实现多版本？

你可以把 Undo Log 理解为：数据库修改数据之前，先把旧版本的信息保存起来，以便后续回滚或者读取旧版本。

![记录的版本链](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261118203459-b3fc1cb306d6.png)

注意：

- 当前数据页中保存的是最新版本。
    
- Undo Log 保存旧版本所需的信息。
    
- 通过 Undo Log，可以从最新版本一步步找到之前的版本。
    

这就叫做版本链。

所以，一条数据并不只有一个版本，而是可以存在多个历史版本。

这就是 MVCC（Multi-Version Concurrency Control，多版本并发控制）的核心思想。
****
## 三、Read View 是什么？

**read view是当前事务创建的一个「数据可见性快照」**

**read view 在事物开启时被创建**

**在 MySQL InnoDB 的默认 RR（可重复读）隔离级别下，同一个事务通常第一次执行一致性读时创建 Read View，后续一致性读复用它；而 RC（读已提交）通常每次一致性读都会创建新的 Read View。**
****
### Read View 的四个重要的字段

![Read View 的组成](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261118201556-008d3a48f48c.png)

 - m_ids ：指的是在创建 Read View 时，当前数据库中「活跃事务」的事务 id 列表，注意是一个列表，“活跃事务”指的就是，启动了但还没提交的事务，并且不包括创建该 Read View 的事务自身。
 - min_trx_id ：指的是在创建 Read View 时，当前数据库中「活跃事务」中事务 id 最小的事务，也就是 m_ids 的最小值。
 - max_trx_id ：这个并不是 m_ids 的最大值，而是创建 Read View 时，下一个将要分配给新事务的事务 id 值（即全局事务 id 计数器的当前值）。
 -  creator_trx_id ：指的是创建该 Read View 的事务的事务 id。

### 聚簇索引记录中两个跟事务有关的隐藏列
对于使用 InnoDB 存储引擎的数据库表，它的聚簇索引记录中都包含下面两个隐藏列：
![记录的隐藏列与 undo 日志](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261118201842-462e8a895f29.png)
-  trx_id，当一个事务对某条聚簇索引记录进行改动时，就会把该事务的事务 id 记录在 trx_id 隐藏列里；
-  roll_pointer，每次对某条聚簇索引记录进行改动时，都会把旧版本的记录写入到 undo 日志中，然后这个隐藏列是个指针，指向每一个旧版本记录，于是就可以通过它找到修改前的记录。

****

#### 在创建 Read View 后，我们可以将记录中的 trx_id 划分这三种情况：
![Read View 的事务可见性规则](https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/obsidian-20261118201947-9c1961c575fe.png)


一个事务去访问记录的时候，除了「自己的更新记录总是可见(即 trx_id == creator_trx_id 时可见)」之外，还有以下几种情况: 

-  如果记录的 trx_id 值**小于** Read View 中的 min_trx_id 值，表示这个版本的记录是由"创建 Read View 之前就已经提交的事务"生成的，所以该版本对当前事务**可见**。

-  如果记录的 trx_id 值**大于等于** Read View 中的 max_trx_id 值，表示这个版本的记录是由"创建 Read View 之后才启动的事务"生成的，所以该版本对当前事务**不可见**。

-  如果记录的 trx_id 值**介于** min_trx_id 和 max_trx_id 之间(即 min_trx_id <= trx_id < max_trx_id)，说明该事务的 id 在 Read View 创建之前就已经分配出去了，此时需要进一步判断 trx_id 是否在 m_ids 列表中:

	  如果 trx_id **在** m_ids 列表中，表示生成该版本记录的事务在创建 Read View 的那一刻仍然活跃(尚未提交)，所以该版本对当前事务**不可见**。
	  
     如果 trx_id **不在** m_ids 列表中，表示该事务虽然 id 已分配，但在创建 Read View 时已经提交，所以该版本对当前事务**可见**。


****
## 四、Undo Log 不能一直保存吧？什么时候删除？

你可能会想到：

假设 money 从 1 一直修改到 1000。

那么就可能存在大量历史版本。

如果这些历史版本一直不删除，数据库的存储空间不就越来越大了吗？

所以 MySQL 有一个机制叫：

Purge（清理机制）

它负责清理已经不再需要的 Undo Log 历史版本。

举个例子：

现在有两个事务：

- 事务 A：很早就开始了，一直没有结束。
    
- 事务 B：后来开始，修改了 money。
    

假设版本链是：

```
money = 3（最新版本）
    ↓
money = 2
    ↓
money = 1（旧版本）
```

事务 A 的 Read View 还需要读取 money = 1。

即使事务 B 已经提交，MySQL 也不能把 money = 1 对应的历史版本删除。

为什么？

因为 A 随时可能再次查询这条数据，它还需要这个旧版本。

如果 MySQL 把它删除了，A 就无法保证可重复读了。

因此：

只要还有活跃事务需要某个历史版本，MySQL 就不能清理这个版本。

当所有需要它的旧 Read View 都结束之后，这些不再需要的历史版本才有机会被 Purge 清理。
****
## 五、为什么不建议使用长事务？

现在终于到文章最后想表达的重点了。

假设你开启了一个事务 A：

```
BEGIN;

SELECT * FROM user WHERE id = 1;
```

然后你一直不提交事务 A。

例如，事务 A 持续运行了 10 个小时。

这 10 个小时里，其他事务一直在修改数据库：

```
money = 1 → 2 → 3 → 4 → 5 → 6 → ...
```

其他事务虽然已经提交，但是 A 仍然可能需要读取很早以前的版本。

因此：

1. MySQL 不能随便删除 A 可能需要的历史版本。
    
2. 其他事务不断修改数据，会不断产生新的 Undo Log。
    
3. 旧版本不断积累。
    
4. Undo Log 占用的空间越来越大。
    

### 长事务造成的问题

事务 A 长时间不提交

Read View 一直需要保留

旧版本无法及时清理

Undo Log 不断积累

### 数据库存储空间压力增大

严重时还会影响数据库整体性能

这就是为什么文章不建议使用长事务。

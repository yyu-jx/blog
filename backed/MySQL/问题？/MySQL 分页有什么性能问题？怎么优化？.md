# MySQL 分页有什么性能问题？怎么优化？

## 基于主键索引的limit执行过程

执行这条sql
```sql

select * from page order by id limit 0, 10;
```

上面select后面带的是星号*，也就是要求获得行数据的所有字段信息。
server层会调用innodb的接口，在innodb里的主键索引中获取到第0到10条完整行数据，依次返回给server层，并放到server层的结果集中，返回给客户端。

而当我们把offset搞离谱点，比如执行的是
```sql

select * from page order by id limit 6000000, 10;
```

server层会调用innodb的接口，由于这次的offset=6000000，会在innodb里的主键索引中获取到第0到（6000000 + 10）条完整行数据，返回给server层之后根据offset的值挨个抛弃，最后只留下最后面的size条，也就是10条数据，放到server层的结果集中，返回给客户端。

可以看出，当offset非0时，server层会从引擎层获取到很多无用的数据，而获取的这些无用数据都是要耗时的。

因此，我们就知道了文章开头的问题的答案，mysql查询中 limit 1000,10 会比 limit 10 更慢。原因是 limit 1000,10 会取出1000+10条数据，并抛弃前1000条，这部分耗时更大

## 那这种case有办法优化吗？

可以看出，当offset非0时，server层会从引擎层获取到很多无用的数据，而当select后面是*号时，就需要拷贝完整的行信息，拷贝完整数据跟只拷贝行数据里的其中一两个列字段耗时是不同的，这就让原本就耗时的操作变得更加离谱。

因为前面的offset条数据最后都是不要的，就算将完整字段都拷贝来了又有什么用呢，所以我们可以将sql语句修改成下面这样。

```sql
select * from page  where id >=(select id from page  order by id limit 6000000, 1) order by id limit 10;
```

上面这条sql语句，里面先执行子查询 select id from page order by id limit 6000000, 1, 这个操作，其实也是将在innodb中的主键索引中获取到6000000+1条数据，然后server层会抛弃前6000000条，只保留最后一条数据的id。

但不同的地方在于，在返回server层的过程中，只会拷贝数据行内的id这一列，而不会拷贝数据行的所有列，当数据量较大时，这部分的耗时还是比较明显的。

在拿到了上面的id之后，假设这个id正好等于6000000，那sql就变成了

```sql
select * from page  where id >=(6000000) order by id limit 10;
```

这样innodb再走一次主键索引，通过B+树快速定位到id=6000000的行数据，时间复杂度是lg(n)，然后向后取10条数据。

这样性能确实是提升了，亲测能快一倍左右，属于那种耗时从3s变成1.5s的操作。
这······

属实有些杯水车薪，有点搓，属于没办法中的办法。

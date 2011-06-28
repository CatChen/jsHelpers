# List 说明文档

List 是一个用于进行数据集合运算的组件，它提供类似于 Haskell List 或 Python List/Generator 的功能，同时支持无穷列表。

List 与 Array 的主要区别在于， List 只计算和存储你访问的元素（及其依赖的元素）。对于你不访问的元素， List 并不进行计算或存储，这些运算仅存在于运算表达式中。因此，你可以使用类似 Python Generator 的形式创建无穷 List ，然后访问其中有穷的区间。

## List

* type: constructor
* input:
	* none | initialArray : arguments (length > 1) | intialArray : Array
* output: this : List

表示一维数据集合的类。类似于 Array ，每一个实例代表一组一维数据集合。

    var originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var originalList = new List(originalArray);
    
    var calculatedList = originalList
        .map(function(i) { return i * (i + 1) / 2; })
        .filter(function(i) { return i > 10 && i < 50; })
    
    var calculatedArray = calculatedList.toArray();
    assert(calculatedArray == [15, 21, 28, 36, 45]);

### List.at()

* type: instance
* input:
    * index : Number
* output: item

根据给定的索引，获取对应的项。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.at(0));
    alert(list.at(4));

### List.length()

* type: instance
* input: none
* output: length : Number

返回列表长度。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.length());

### List.each()

* type: instance
* input:
    * iterator : Function
* output: this : List

迭代遍历列表，将每一项作为参数传递给迭代器函数。

    var list = new List(1, 2, 3, 4, 5);
    list.each(function(object) { alert(object); });

### List.reverse()

* type: instance
* input: none
* output: list : List

返回逆序列表。

    var list = new List(1, 2, 3, 4, 5);
    var reversedList = list.reversed();
    alert(reversedList.toArray().join(', '));

### List.map()

* type: instance
* input:
    * predicate : Function
* output: list : List

对列表进行投影运算，返回运算结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var mappedList = list.map(function(i) { return i * i; });
    alert(mappedList.toArray().join(', '));

### List.filter()

* type: instance
* input:
    * predicate : Function
* output: list : List

对列表进行筛选运算，返回运算结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var filteredList = list.filter(function(i) { return i > 1 && i < 5; });
    alert(filteredList.toArray().join(', '));

### List.fold()

* type: instance
* input:
    * predicate : Function
    * start
* output: result

对列表进行归并运算，返回运算结果。

    var list = new List(1, 2, 3, 4, 5);
    var sum = List.fold(function(acc, i) { return acc + i; }, 0);
    alert(sum);

### List.scan()

* type: instance
* input:
    * predicate : Function
    * start
* output: list : List

对列表进行聚合操作，返回聚合操作每一步结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var sums = List.scan(function(acc, i) { return acc + i; }, 0);
    alert(sums.toArray().join(', '));

### List.takeWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

从列表左侧开始获取项，直到检测函数返回 false 或到达列表末端为止，然后返回获取项组成的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var lessThanThree = List.takeWhile(function(i) { return i < 3; });
    alert(lessThanThree.toArray().join(', '));

### List.take()

* type: instance
* input:
    * number : Number
* output: list : List

从列表左侧开始获取项，直到获取到指定数量的项或到达列表末端，然后返回获取项组成的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var firstThree = List.take(3);
    alert(firstThree.toArray().join(', '));

### List.dropWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

从列表左侧开始删除项，直到检测函数返回 false 或到达列表末端为止，然后返回原列表减去删除项后的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var noLessThanThree = List.dropWhile(function(i) { return i < 3; });
    alert(noLessThanThree.toArray().join(', '));

### List.drop()

* type: instance
* input:
    * number : Number
* output: list : List

从列表左侧开始删除项，直到删除了指定数量的项或到达列表末端为止，然后返回原列表减去删除项后的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var exceptForFirstThree = List.drop(3);
    alert(exceptForFirstThree.toArray().join(', '));

### List.cycle()

* type: instance
* input: none
* output: list : List

返回一个列表，该列表是原列表的无穷次循环结果。

    var list = new List(1, 2, 3, 4, 5);
    var cycledList = list.cycle();
    alert(cycledList.take(20).toArray().join(', '));

### List.generate()

* type: static
* input:
    * generator : Function
* output: list : List

使用类似 Python Generator 的方式生成一个列表。 generator 函数可以获取到一个 proxy 对象，通过调用该对象的 yield 方法生成下一个项，或通过 end 方法表示列表结束。 generator 函数会被不断调用，直到获取到足够的项或 end 方法被调用为止。

    var a = 0, b = 1;
    var fibonacci = List
        .generate(function(proxy) {
            proxy.yield(a);
            var aNext = b;
            var bNext = a + b;
            a = aNext;
            b = bNext;
        });
    alert(fibonacci.take(20).toArray().join(', '));

### List.iterate()

* type: static
* input:
    * generator : Function
    * start
* output: list : List

将 start 作为列表的第一项，并且使用 generator 及列表的第 n 项生成第 n + 1 项，返回所生成无穷列表。

    var list = List
        .iterate(function() { return this * 2; }, 1);
    alert(list.take(20).toArray().join(', '));

### List.count()

* type: static
* input:
    * start = 0 (optional)
    * step = 1 (optional)
* output: list : List

生成无穷列表，其第一项为 start （默认值为 0 ），然后每一项都比前一项增加 step （默认值为 1 ），返回所生成的无穷列表。

    var list = List.count();
    alert(list.take(20).toArray().join(', '));

### List.repeat()

* type: static
* input:
    * object
* output: list : List

生成无穷列表，其中的每一项都是参数 object 指定的值，返回所生成的无穷列表。

    var list = List.repeat(42);
    alert(list.take(20).toArray().join(', '));

### List.concatenate()

* type: static
* input:
    * lists : arguments
* output: list : List

串联多个列表，返回串联的结果。

    var list1 = new List(1, 2, 3, 4, 5);
    var list2 = new List(6, 7, 8, 9, 10);
    var concatenatedList = List.concatenate(list1, list2);
    alert(concatenatedList.toArray().join(', '));

### List.zip()

* type: static
* input:
    * predicate : Function
    * lists : arguments
* output: list : List

使用 predicate 参数指定的函数做归并，并联多个列表，返回并联结果。

    var list1 = new List(1, 2, 3, 4, 5);
    var list2 = new List(6, 7, 8, 9, 10);
    var zippedList = List.zip(function(x, y) { return { x: x, y: y }; }, list1, list2);
    alert(zippedList.toArray().join(', '));

### List.all()

* type: instance
* input:
    * predicate : Function
* output: result : Boolean

检测列表是否每一项都满足特定条件。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.all(function(i) { return i > 0; });

### List.any()

* type: instance
* input:
    * predicate : Function
* output: result : Boolean

检测列表是否至少有一项都满足特定条件。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.any(function(i) { return i > 0; });

### List.sum()

* type: instance
* input: none
* output: result : Number

计算列表项的总和。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.sum());

### List.average()

* type: instance
* input: none
* output: result : Number

计算列表项的平均值。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.sum());

### List.maximum()

* type: instance
* input: none
* output: result : Number

搜索列表项的最大值。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.maximum());

### List.minimum()

* type: instance
* input: none
* output: result : Number

搜索列表项的最小值。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.minimum());

### List.head()

* type: instance
* input: none
* output: item

返回列表的首项。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.head());

### List.tail()

* type: instance
* input: none
* output: list : List

返回列表除去首项以外的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var tailList = list.tail();
    alert(tailList.toArray().join(', '));

### List.init()

* type: instance
* input: none
* output: list : List

返回列表除去末项以外的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var initList = list.init();
    alert(initList.toArray().join(', '));

### List.last()

* type: instance
* input: none
* output: item

返回列表的末项。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.last());

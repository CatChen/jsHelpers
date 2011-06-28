# List 快速入门

要使用 List ，首先需要创建一个基于 Array 的 List ，然后各种演算都可以通过 List 进行。完成演算后，可以使用 toArray 方法将数据输出为 Array ，可以使用 each 方法遍历数据，还可以通过 at 方法按索引访问数据。

    var originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var originalList = new List(originalArray);
    
    var calculatedList = originalList
        .map(function(i) { return i * (i + 1) / 2; })
        .filter(function(i) { return i > 10 && i < 50; })
    
    var calculatedArray = calculatedList.toArray();
    assert(calculatedArray == [15, 21, 28, 36, 45]);
    
    calculatedList.each(function(i) { alert(i); });
    
    assert(calculatedList.at(0) == 15);
    assert(calculatedList.at(4) == 45);

在某些情况下，无穷 List 会特别有用。例如说，你需要按照一个规则填充一个数组，这个填充可以无限进行下去，但是你在演算之前无法预知需要填充多大的数组。一个具体的例子是，你需要知道对 Fibonacci 数列排除掉第一位的 0 后进行连乘的话，多少项后乘积会超过 10000 ，这时候你无法预知需要生成 Fibonacci 数列的前多少位，所以可以使用无穷 List 来解决这个问题。

    var a = 0, b = 1;
    var list = List
        .generate(function(proxy) {
            proxy.yield(a);
            var aNext = b;
            var bNext = a + b;
            a = aNext;
            b = bNext;
        })
        .drop(1)
        .scan(function(acc, i) { return acc * i; }, 1)
        .takeWhile(function(i) { return i < 10000; });
    assert(list.length() == 8);

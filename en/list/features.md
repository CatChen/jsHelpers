# List Features

List is a component for data set operations. It's like Haskell List or Python List/Generator with infinite set support.

The difference between List and Array is that List only compute and store the items you access. List won't compute or store any item you don't access and these items only exist in the computational expression. Thus you can create infinite List in a way like Python Generator and access a finite area of it.

## List

* type: constructor
* input:
	* none | initialArray : arguments (length > 1) | intialArray : Array
* output: this : List

List represents a one dimensional set. It's like Array and every instance represents a data set.

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

Look up the given index and retrieve the corresponding item.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.at(0));
    alert(list.at(4));

### List.length()

* type: instance
* input: none
* output: length : Number

Return the length of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.length());

### List.each()

* type: instance
* input:
    * iterator : Function
* output: this : List

Iterate through the list and pass every item to the iterator function as an argument.

    var list = new List(1, 2, 3, 4, 5);
    list.each(function(object) { alert(object); });

### List.reverse()

* type: instance
* input: none
* output: list : List

Return the reversed List.

    var list = new List(1, 2, 3, 4, 5);
    var reversedList = list.reversed();
    alert(reversedList.toArray().join(', '));

### List.map()

* type: instance
* input:
    * predicate : Function
* output: list : List

Run the map function on every item of the List and return a List containing each corresponding result.

    var list = new List(1, 2, 3, 4, 5);
    var mappedList = list.map(function(i) { return i * i; });
    alert(mappedList.toArray().join(', '));

### List.filter()

* type: instance
* input:
    * predicate : Function
* output: list : List

Run the filter function on every item of the List and return a List containing items passed the filter.

    var list = new List(1, 2, 3, 4, 5);
    var filteredList = list.filter(function(i) { return i > 1 && i < 5; });
    alert(filteredList.toArray().join(', '));

### List.fold()

* type: instance
* input:
    * predicate : Function
    * start
* output: result

Run the reduction function on the List and return the result.

    var list = new List(1, 2, 3, 4, 5);
    var sum = List.fold(function(acc, i) { return acc + i; }, 0);
    alert(sum);

### List.scan()

* type: instance
* input:
    * predicate : Function
    * start
* output: list : List

Run the reduction function on the List and return a List containing the result of every step.

    var list = new List(1, 2, 3, 4, 5);
    var sums = List.scan(function(acc, i) { return acc + i; }, 0);
    alert(sums.toArray().join(', '));

### List.takeWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

Scan the List from left to right and take items until the test function returns false, then return a List containing items passed the test.

    var list = new List(1, 2, 3, 4, 5);
    var lessThanThree = List.takeWhile(function(i) { return i < 3; });
    alert(lessThanThree.toArray().join(', '));

### List.take()

* type: instance
* input:
    * number : Number
* output: list : List

Take items in the List from left to right till the number is reached or the right most item is reached, then return the List containing these items.

    var list = new List(1, 2, 3, 4, 5);
    var firstThree = List.take(3);
    alert(firstThree.toArray().join(', '));

### List.dropWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

Scan the List from left to right and drop items until the test function returns false, then return a List containing the remaining items started with the one failed the test.

    var list = new List(1, 2, 3, 4, 5);
    var noLessThanThree = List.dropWhile(function(i) { return i < 3; });
    alert(noLessThanThree.toArray().join(', '));

### List.drop()

* type: instance
* input:
    * number : Number
* output: list : List

Drop items in the List from left to right till the number is reached or the right most item is reached, then return the List containing the remaining items.

    var list = new List(1, 2, 3, 4, 5);
    var exceptForFirstThree = List.drop(3);
    alert(exceptForFirstThree.toArray().join(', '));

### List.cycle()

* type: instance
* input: none
* output: list : List

Return a new List, which is the infinite repeat of the original one.

    var list = new List(1, 2, 3, 4, 5);
    var cycledList = list.cycle();
    alert(cycledList.take(20).toArray().join(', '));

### List.generate()

* type: static
* input:
    * generator : Function
* output: list : List

Generate a List like using Python Generator. The generator function will receive a proxy object through which it can call the yield method to generate the next item or call end method to end the List. The generator method will be called indefinitely till the end method is called.

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

Take the start item as the first item and use the generator function to generate the next item based on the previous one, and then return this infinte List.

    var list = List
        .iterate(function() { return this * 2; }, 1);
    alert(list.take(20).toArray().join(', '));

### List.count()

* type: static
* input:
    * start = 0 (optional)
    * step = 1 (optional)
* output: list : List

Generate an infintie List with the first item equals to the start item (default is 0) and every other item equals to its previous item plus step (default is 1), and then return the List.

    var list = List.count();
    alert(list.take(20).toArray().join(', '));

### List.repeat()

* type: static
* input:
    * object
* output: list : List

Generate an infinite List with every item equals to the object and then return the List.

    var list = List.repeat(42);
    alert(list.take(20).toArray().join(', '));

### List.concatenate()

* type: static
* input:
    * lists : arguments
* output: list : List

Concatenate multiple Lists and return the result.

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

Merge multiple Lists with the function and return the result.

    var list1 = new List(1, 2, 3, 4, 5);
    var list2 = new List(6, 7, 8, 9, 10);
    var zippedList = List.zip(function(x, y) { return { x: x, y: y }; }, list1, list2);
    alert(zippedList.toArray().join(', '));

### List.all()

* type: instance
* input:
    * predicate : Function
* output: result : Boolean

Detect if every item of the List satisfies the condition.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.all(function(i) { return i > 0; });

### List.any()

* type: instance
* input:
    * predicate : Function
* output: result : Boolean

Detect if at least one item of the List satisfies the condition.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.any(function(i) { return i > 0; });

### List.sum()

* type: instance
* input: none
* output: result : Number

Calculate the sum of the items of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.sum());

### List.average()

* type: instance
* input: none
* output: result : Number

Calculate the average of the items of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.sum());

### List.maximum()

* type: instance
* input: none
* output: result : Number

Search for the maximum value in the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.maximum());

### List.minimum()

* type: instance
* input: none
* output: result : Number

Search for the minimum value in the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.minimum());

### List.head()

* type: instance
* input: none
* output: item

Return the first item of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.head());

### List.tail()

* type: instance
* input: none
* output: list : List

Return a List with the first item removed.

    var list = new List(1, 2, 3, 4, 5);
    var tailList = list.tail();
    alert(tailList.toArray().join(', '));

### List.init()

* type: instance
* input: none
* output: list : List

Return a List with the last item removed.

    var list = new List(1, 2, 3, 4, 5);
    var initList = list.init();
    alert(initList.toArray().join(', '));

### List.last()

* type: instance
* input: none
* output: item

Return the Last item of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.last());

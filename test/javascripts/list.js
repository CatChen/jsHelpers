function testList() {
    module("list core");

    test("list existence", function() {
        expect(3);
        
        ok(List, "List exists");
        
        var list = new List(1, 2, 3, 4, 5, 6);
        ok(list.each, "list.each exists");
        ok(list.toArray, "list.each exists");
    });
    
    test("list constructor", function() {
        expect(4);
        
        var count = 0;
        
        var list1 = new List();
        var list2 = new List(1, 2, 3, 4, 5, 6);
        var list3 = new List([1, 2, 3, 4, 5, 6]);
        var list4 = new List({
            "item": function() { return count; },
            "next": function() { return !!(count += 1); },
            "reset": function() { count = 0; }
        });
        
        same(list1.toArray(), [], "empty constructor works correctly");
        same(list2.toArray(), [1, 2, 3, 4, 5, 6], "arguments constructor works correctly");
        same(list3.toArray(), [1, 2, 3, 4, 5, 6], "array constructor works correctly");
        same(list4.drop(2).take(4).toArray(), [3, 4, 5, 6], "enumerator constructor works correctly");
    });
    
    test("list each method", function() {
        expect(12);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var i = 0;
        
        list.each(function(object) {
            equals(this, i + 1, "this value correct");
            equals(object, i + 1, "object value correct");
            i++;
        });
    });
    
    test("list toArray method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        
        same(list.toArray(), [1, 2, 3, 4, 5, 6], "toArray result correct");
    });
    
    module("list methods");
    
    test("list methods existence", function() {
        expect(15);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        
        ok(list.reverse, "list.reverse exists");
        ok(list.map, "list.map exists");
        ok(list.filter, "list.filter exists");
        ok(list.fold, "list.fold exists");
        ok(list.scan, "list.scan exists");
        ok(list.takeWhile, "list.takeWhile exists");
        ok(list.take, "list.take exists");
        ok(list.dropWhile, "list.dropWhile exists");
        ok(list.drop, "list.drop exists");
        ok(list.cycle, "list.cycle exists");
        
        ok(List.iterate, "List.iterate exists");
        ok(List.count, "List.count exists");
        ok(List.repeat, "List.repeat exists");
        ok(List.concatenate, "List.concatenate exists");
        ok(List.zip, "List.zip exists");
    });
    
    test("list reverse method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .reverse();
        list.toArray();
        
        same(list.toArray(), [6, 5, 4, 3, 2, 1], "reverse result correct");
    });
    
    test("list map method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .map(function() { return this * 2; });
        list.toArray();
        
        same(list.toArray(), [2, 4, 6, 8, 10, 12], "map result correct");
    });
    
    test("list filter method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .filter(function() { return this > 2 && this % 2; });
        list.toArray();
        
        same(list.toArray(), [3, 5], "filter result correct");
    });
    
    test("list fold method", function() {
        expect(1);
        
        var product = new List(1, 2, 3, 4, 5, 6)
            .fold(function(accumulation, i) { return accumulation * i; }, 1);
        
        equals(product, 720, "fold result correct");
    });
    
    test("list scan method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .scan(function(accumulation, i) { return accumulation * i; }, 1);
        list.toArray();
        
        same(list.toArray(), [1, 1, 2, 6, 24, 120, 720], "scan result correct");
    });
    
    test("list takeWhile method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .takeWhile(function() { return this < 4; });
        list.toArray();
        
        same(list.toArray(), [1, 2, 3], "takeWhile result correct");
    });
    
    test("list take method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .take(2);
        list.toArray();
        
        same(list.toArray(), [1, 2], "take result correct");
    });
    
    test("list dropWhile method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .dropWhile(function() { return this < 4; });
        list.toArray();
        
        same(list.toArray(), [4, 5, 6], "dropWhile result correct");
    });
    
    test("list drop method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .drop(2);
        list.toArray();
        
        same(list.toArray(), [3, 4, 5, 6], "drop result correct");
    });
    
    test("list cycle method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .cycle()
            .take(20);
        list.toArray();
        
        same(list.toArray(), [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2], "cycle result correct");
    });
    
    test("list iterate method", function() {
        expect(1);
        
        var list = List
            .iterate(function() { return this * 2; }, 1)
            .take(10);
        list.toArray();
        
        same(list.toArray(), [1, 2, 4, 8, 16, 32, 64, 128, 256, 512], "iterate result correct");
    });
    
    test("list count method", function() {
        expect(2);
        
        var list1 = List
            .count()
            .drop(10)
            .take(10);
        list1.toArray();
        
        var list2 = List
            .count(100, 3)
            .drop(10)
            .take(10);
        list2.toArray();
        
        same(list1.toArray(), [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "count result correct");
        same(list2.toArray(), [130, 133, 136, 139, 142, 145, 148, 151, 154, 157], "count result correct");
    });
    
    test("list repeat method", function() {
        expect(1);
        
        var list = List
            .repeat(42)
            .drop(10)
            .take(10);
        list.toArray();
        
        same(list.toArray(), [42, 42, 42, 42, 42, 42, 42, 42, 42, 42], "repeat result correct");
    });
    
    test("list concatenate method", function() {
        expect(1);
        
        var list = List.concatenate(
            new List(1, 2, 3, 4, 5, 6),
            new List([]),
            new List([]),
            new List(7, 8, 9, 10, 11, 12),
            new List(13, 14, 15, 16, 17, 18));
        list.toArray();
        
        same(list.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "concatenate result correct");
    });
    
    test("list concatenate method", function() {
        expect(1);
        
        var list = List.zip(
            function(x, y, z) {
                return {
                    "x": x,
                    "y": y,
                    "z": z
                };
            },
            new List(1, 2, 3, 4, 5, 6),
            new List(7, 8, 9, 10),
            new List(11, 12, 13, 14, 15, 16, 17, 18, 19, 20));
        list.toArray();
        
        same(list.toArray(), [
            { "x": 1, "y": 7, "z": 11 },
            { "x": 2, "y": 8, "z": 12 },
            { "x": 3, "y": 9, "z": 13 },
            { "x": 4, "y": 10, "z": 14 }
        ], "zip result correct");
    });
    
    test("list all method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result1 = list.all(function(object) { return object > 0; });
        var result2 = list.all(function(object) { return object > 1; });
        
        equals(result1, true, "all result correct");
        equals(result2, false, "all result correct");
    });
    
    test("list any method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result1 = list.any(function(object) { return object < 1; });
        var result2 = list.any(function(object) { return object < 2; });
        
        equals(result1, false, "any result correct");
        equals(result2, true, "any result correct");
    });
    
    test("list length method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.length();
        
        equals(result, 6, "length result correct");
    });
    
    test("list sum method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.sum();
        
        equals(result, 21, "sum result correct");
    });
    
    test("list average method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.average();
        
        equals(result, 3.5, "average result correct");
    });
    
    test("list maximum method", function() {
        expect(1);
        
        var list = new List(1, 3, 5, 2, 4);
        var result = list.maximum();
        
        equals(result, 5, "maximum result correct");
    });
    
    test("list minimum method", function() {
        expect(1);
        
        var list = new List(1, 3, 5, 2, 4);
        var result = list.minimum();
        
        equals(result, 1, "minimum result correct");
    });
    
    test("list head method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.head();
        
        equals(result, 1, "head result correct");
    });
    
    test("list tail method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .tail();
        list.toArray();
        
        same(list.toArray(), [2, 3, 4, 5, 6], "tail result correct");
    });
    
    test("list init method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .init();
        list.toArray();
        
        same(list.toArray(), [1, 2, 3, 4, 5], "init result correct");
    });
    
    test("list last method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.last();
        
        equals(result, 6, "last result correct");
    });
}

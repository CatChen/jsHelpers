function testOverload() {
	module("overload");
	
	test("overload existence", function() {
		expect(3);
		
		ok(Overload.create, "Overload.create exists");
		
		var overloaded = Overload.create();
		ok(overloaded.add, "overloaded.add exists");
		ok(overloaded.select, "overloaded.select exists");
	});
	
	test("overload support for no argument", function() {
		expect(1);
		
		var testValue = "-- this is the return value --";
		
		var overloaded = Overload
			.add("", function() { return testValue });
		
		equals(overloaded(), testValue, "overloaded()");
	});
	
	test("overload support for different argument counts", function() {
		expect(2);
		
		var sum = Overload
			.add("Number, Number",
				function(x, y) { return x + y; })
			.add("Number, Number, Number",
				function(x, y, z) { return x + y + z; });
		
		equals(sum(1, 2), 3, "sum(1, 2)");
		equals(sum(1, 2, 3), 6, "sum(1, 2, 3)");
	});
	
	test("overload support for different argument types", function() {
		expect(2);
		
		var list = Overload
			.add("Array",
				function(o) { return o.join(', '); })
			.add("Object",
				function(o) {
					var array = [];
					for (var key in o) {
						array.push(o[key]);
					}
					return list(array);
				});
		
		equals(list([1, 2, 3]), "1, 2, 3", "list([1, 2, 3])");
		equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
	});
	
	test("overload support for argument of any type", function() {
		expect(2);
		
		var list = Overload
			.add("Array",
				function(o) { return o.join(', '); })
			.add("*",
				function(o) {
					var array = [];
					for (var key in o) {
						array.push(o[key]);
					}
					return list(array);
				});
		
		equals(list([1, 2, 3]), "1, 2, 3", "list([1, 2, 3])");
		equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
	});
	
	test("overload support for more arguments after argument list", function() {
		expect(3);
		
		var join = Overload
			.add("*",
				function(x) { return [x]; })
			.add("*, *",
				function(x, y) { return [x, y]; })
			.add("*, *, ...", 
				function() {
					var result = [];
					for (var i = 0; i < arguments.length; i++) {
						result.push(arguments[i]);
					}
					return result;
				});
		
		same(join(new Object()), [new Object()], 'join(new Object())');
		same(join("hello", "world"), ["hello", "world"], 'join("hello", "world")');
		same(join(1, 2, 3), [1, 2, 3], "join(1, 2, 3)");
	});
	
	test("overload resolution for arguments in the same inheritance hierarchy", function() {
		expect(2);
		
		var parent = function parent() { this.x = 1; };
		var child = function child() { this.y = 2; };
		child.prototype = new parent();
		
		var overloadForParent = function overloadForParent() {};
		var overloadForChild = function overloadForChild() {};
		
		var overloaded = Overload
			.add([parent], overloadForParent)
			.add([child], overloadForChild);
		
		equals(overloaded.select([new parent()]), overloadForParent, "overloaded.select([new parent()])");
		equals(overloaded.select([new child()]), overloadForChild, "overloaded.select([new child()])");
	});
	
	test("overload resolution for ambiguous argument types", function() {
		expect(1);
		
		var parent = function parent() { this.x = 1; };
		var child = function child() { this.y = 2; };
		child.prototype = new parent();
		
		var overloaded = Overload
			.add([parent, child], function() {})
			.add([child, parent], function() {});
		
		equals(overloaded.select([new child(), new child()]), null, "overloaded.select([new child(), new child()])");
	});
	
	test("overload resolution for no argument", function() {
		expect(3);
		
		var overloadForArgumentless = function overloadForArgumentless() {};
		var overloadForArgumentness = function overloadForArgumentness() {};
		
		var overloaded = Overload
			.add("", overloadForArgumentless)
			.add("...", overloadForArgumentness);
		
		equals(overloaded.select([]), overloadForArgumentless, "overloaded.select([])");
		equals(overloaded.select([true]), overloadForArgumentness, "overloaded.select([true])");
		equals(overloaded.select(["hello", "world"]), overloadForArgumentness, 'overloaded.select(["hello", "world"])');
	});
	
	test("overload resolution for argument of any type", function() {
		expect(3);
		
		var overloadForArray = function overloadForArray() {};
		var overloadForObject = function overloadForObject() {};
		var overloadForAny = function overloadForAny() {};
		
		var overloaded = Overload
			.add("Array", overloadForArray)
			.add("Object", overloadForObject)
			.add("*", overloadForAny);
			
		equals(overloaded.select([[]]), overloadForArray, "overloaded.select([])");
		equals(overloaded.select([{}]), overloadForObject, "overloaded.select({})");
		equals(overloaded.select([0]), overloadForAny, "overloaded.select(0)");
	});
	
	test("overload resolution for more arguments after argument list", function() {
		expect(3);
		
		var overloadForOneString = function overloadForOneString() {};
		var overloadForOneStringAndMore = function overloadForOneStringAndMore() {};
		var overloadForTwoString = function overloadForTwoString() {};
		var overloadForTwoStringAndMore = function overloadForTwoStringAndMore() {};
		
		var overloaded = Overload
			.add("String", overloadForOneString)
			.add("String, ...", overloadForOneStringAndMore)
			.add("String, String", overloadForTwoString)
			.add("String, String, ...", overloadForTwoStringAndMore);
		
		equals(overloaded.select(["hello"]), overloadForOneString, 'overloaded.select(["hello"])');
		equals(overloaded.select(["hello", "world"]), overloadForTwoString, 'overloaded.select(["hello", "world"])');
		equals(overloaded.select(["hello", ",", "world", "!"]), overloadForTwoStringAndMore, 'overloaded.select(["hello", ",", "world", "!"])');
	});
	
	test("overload null argument support", function() {
		ok(false, "null argument support to be tested");
	});
}

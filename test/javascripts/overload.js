function testOverload() {
	module("overload core");
	
	test("overload existence", function() {
		expect(3);
		
		ok(Overload.create, "Overload.create exists");
		
		var overloaded = Overload.create();
		ok(overloaded.add, "overloaded.add exists");
		ok(overloaded.select, "overloaded.select exists");
	});
	
	module("overload string definition")
	
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
		
		var parent = window.parent = function parent() { this.x = 1; };
		var child = window.child = function child() { this.y = 2; };
		child.prototype = new parent();
		
		var overloadForParent = function overloadForParent() { return "overload-for-parent"; };
		var overloadForChild = function overloadForChild() { return "overload-for-child"; };
		
		var overloaded = Overload
			.add("parent", overloadForParent)
			.add("child", overloadForChild);
		
		equals(overloaded(new parent()), "overload-for-parent", "overloaded(new parent())");
		equals(overloaded(new child()), "overload-for-child", "overloaded(new child())");
	});
	
	test("overload resolution for ambiguous argument types", function() {
		expect(1);
		
		var parent = window.parent = function parent() { this.x = 1; };
		var child = window.child = function child() { this.y = 2; };
		child.prototype = new parent();
		
		var overloaded = Overload
			.add("parent, child", function() {})
			.add("child, parent", function() {});
		
		try {
		    overloaded([new child(), new child()]);
		    ok(false, "no exception for overloaded(new child(), new child())");
		} catch (e) {
		    ok(true, "exception for overloaded(new child(), new child())");
		}
	});
	
	test("overload resolution for no argument", function() {
		expect(3);
		
		var overloadForArgumentless = function overloadForArgumentless() { return "overload-for-argumentless"; };
		var overloadForArgumentness = function overloadForArgumentness() { return "overload-for-argumentness"; };
		
		var overloaded = Overload
			.add("", overloadForArgumentless)
			.add("...", overloadForArgumentness);
		
		equals(overloaded(), "overload-for-argumentless", "overloaded()");
		equals(overloaded(true), "overload-for-argumentness", "overloaded(true)");
		equals(overloaded("hello", "world"), "overload-for-argumentness", 'overloaded("hello", "world")');
	});
	
	test("overload resolution for argument of any type", function() {
		expect(3);
		
		var overloadForArray = function overloadForArray() { return "overload-for-array"; };
		var overloadForObject = function overloadForObject() { return "overload-for-object"; };
		var overloadForAny = function overloadForAny() { return "overload-for-any"; };
		
		var overloaded = Overload
			.add("Array", overloadForArray)
			.add("Object", overloadForObject)
			.add("*", overloadForAny);
			
		equals(overloaded([]), "overload-for-array", "overloaded([])");
		equals(overloaded({}), "overload-for-object", "overloaded({})");
		equals(overloaded(0), "overload-for-any", "overloaded(0)");
	});
	
	test("overload resolution for more arguments after argument list", function() {
		expect(3);
		
		var overloadForOneString = function overloadForOneString() { return "overload-for-one-string"; };
		var overloadForOneStringAndMore = function overloadForOneStringAndMore() { return "overload-for-one-string-and-more"; };
		var overloadForTwoString = function overloadForTwoString() { return "overload-for-two-string"; };
		var overloadForTwoStringAndMore = function overloadForTwoStringAndMore() { return "overload-for-two-string-and-more"; };
		
		var overloaded = Overload
			.add("String", overloadForOneString)
			.add("String, ...", overloadForOneStringAndMore)
			.add("String, String", overloadForTwoString)
			.add("String, String, ...", overloadForTwoStringAndMore);
		
		equals(overloaded("hello"), "overload-for-one-string", 'overloaded("hello")');
		equals(overloaded("hello", "world"), "overload-for-two-string", 'overloaded("hello", "world")');
		equals(overloaded("hello", ",", "world", "!"), "overload-for-two-string-and-more", 'overloaded("hello", ",", "world", "!")');
	});
	
	test("overload null argument support", function() {
		expect(2);
		
		var overloadForOneArgument = function overloadForOneArgument() { return "overload-for-one-argument"; };
		var overloadForOneArgumentAndMore = function overloadForOneArgumentAndMore() { return "overload-for-one-argument-and-more"; };
		
		var overloaded = Overload
			.add("*", overloadForOneArgument)
			.add("*, ...", overloadForOneArgumentAndMore)
		
		equals(overloaded(null), "overload-for-one-argument", 'overloaded(null)');
		equals(overloaded(null, null), "overload-for-one-argument-and-more", 'overloaded(null, null)');
	});
	
	module("overload array definition")
	
	test("overload support for no argument", function() {
		expect(1);
		
		var testValue = "-- this is the return value --";
		
		var overloaded = Overload
			.add([], function() { return testValue });
		
		equals(overloaded(), testValue, "overloaded()");
	});
	
	test("overload support for different argument counts", function() {
		expect(2);
		
		var sum = Overload
			.add([Number, Number],
				function(x, y) { return x + y; })
			.add([Number, Number, Number],
				function(x, y, z) { return x + y + z; });
		
		equals(sum(1, 2), 3, "sum(1, 2)");
		equals(sum(1, 2, 3), 6, "sum(1, 2, 3)");
	});
	
	test("overload support for different argument types", function() {
		expect(2);
		
		var list = Overload
			.add([Array],
				function(o) { return o.join(', '); })
			.add([Object],
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
			.add([Array],
				function(o) { return o.join(', '); })
			.add([Overload.Any],
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
			.add([Overload.Any],
				function(x) { return [x]; })
			.add([Overload.Any, Overload.Any],
				function(x, y) { return [x, y]; })
			.add([Overload.Any, Overload.Any, Overload.More], 
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
		
		var overloadForParent = function overloadForParent() { return "overload-for-parent"; };
		var overloadForChild = function overloadForChild() { return "overload-for-child"; };
		
		var overloaded = Overload
			.add([parent], overloadForParent)
			.add([child], overloadForChild);
		
		equals(overloaded(new parent()), "overload-for-parent", "overloaded(new parent())");
		equals(overloaded(new child()), "overload-for-child", "overloaded(new child())");
	});
	
	test("overload resolution for ambiguous argument types", function() {
		expect(1);
		
		var parent = function parent() { this.x = 1; };
		var child = function child() { this.y = 2; };
		child.prototype = new parent();
		
		var overloaded = Overload
			.add([parent, child], function() {})
			.add([child, parent], function() {});
		
		try {
		    overloaded([new child(), new child()]);
		    ok(false, "no exception for overloaded(new child(), new child())");
		} catch (e) {
		    ok(true, "exception for overloaded(new child(), new child())");
		}
	});
	
	test("overload resolution for no argument", function() {
		expect(3);
		
		var overloadForArgumentless = function overloadForArgumentless() { return "overload-for-argumentless"; };
		var overloadForArgumentness = function overloadForArgumentness() { return "overload-for-argumentness"; };
		
		var overloaded = Overload
			.add([], overloadForArgumentless)
			.add([Overload.More], overloadForArgumentness);
		
		equals(overloaded(), "overload-for-argumentless", "overloaded()");
		equals(overloaded(true), "overload-for-argumentness", "overloaded(true)");
		equals(overloaded("hello", "world"), "overload-for-argumentness", 'overloaded("hello", "world")');
	});
	
	test("overload resolution for argument of any type", function() {
		expect(3);
		
		var overloadForArray = function overloadForArray() { return "overload-for-array"; };
		var overloadForObject = function overloadForObject() { return "overload-for-object"; };
		var overloadForAny = function overloadForAny() { return "overload-for-any"; };
		
		var overloaded = Overload
			.add([Array], overloadForArray)
			.add([Object], overloadForObject)
			.add([Overload.Any], overloadForAny);
			
		equals(overloaded([]), "overload-for-array", "overloaded([])");
		equals(overloaded({}), "overload-for-object", "overloaded({})");
		equals(overloaded(0), "overload-for-any", "overloaded(0)");
	});
	
	test("overload resolution for more arguments after argument list", function() {
		expect(3);
		
		var overloadForOneString = function overloadForOneString() { return "overload-for-one-string"; };
		var overloadForOneStringAndMore = function overloadForOneStringAndMore() { return "overload-for-one-string-and-more"; };
		var overloadForTwoString = function overloadForTwoString() { return "overload-for-two-string"; };
		var overloadForTwoStringAndMore = function overloadForTwoStringAndMore() { return "overload-for-two-string-and-more"; };
		
		var overloaded = Overload
			.add([String], overloadForOneString)
			.add([String, Overload.More], overloadForOneStringAndMore)
			.add([String, String], overloadForTwoString)
			.add([String, String, Overload.More], overloadForTwoStringAndMore);
		
		equals(overloaded("hello"), "overload-for-one-string", 'overloaded("hello")');
		equals(overloaded("hello", "world"), "overload-for-two-string", 'overloaded("hello", "world")');
		equals(overloaded("hello", ",", "world", "!"), "overload-for-two-string-and-more", 'overloaded("hello", ",", "world", "!")');
	});
	
	test("overload null argument support", function() {
		expect(2);
		
		var overloadForOneArgument = function overloadForOneArgument() { return "overload-for-one-argument"; };
		var overloadForOneArgumentAndMore = function overloadForOneArgumentAndMore() { return "overload-for-one-argument-and-more"; };
		
		var overloaded = Overload
			.add([Overload.Any], overloadForOneArgument)
			.add([Overload.Any, Overload.More], overloadForOneArgumentAndMore)
		
		equals(overloaded(null), "overload-for-one-argument", 'overloaded(null)');
		equals(overloaded(null, null), "overload-for-one-argument-and-more", 'overloaded(null, null)');
	});
}

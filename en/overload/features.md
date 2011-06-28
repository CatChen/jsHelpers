# Overload Features

Overload is for creating overloaded functions in JavaScript in a simpler and better way. It let you describe the signature of different functions and relieve you of handling signatures recognition in your function.

## Overload

A static class for creating overloaded functions.

	var sum = Overload
		.add("Number, Number",
			function(x, y) { return x + y; })
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; });
	
	alert(sum(1, 2));
	alert(sum(3, 4, 5));

### Overload.add()

* type: static and instance
* input:
	* types : String or Array
	* handler : Function
* output: overloaded : Function

Create an overloaded function entrance and add the first function or add a function to the existed overloaded function entrance.

	var concatenate = Overload
		.add("String, String"),
			function(s1, s2) { return s1 + s2; })
		.add("String, String, String"),
			function(s1, s2, s3) { return s1 + s2 + s3; });
	
	concatenate
		.add("Array",
			function(array) { return array.join(""); });
		.add("Array, String",
			function(array, separator) { return array.join(separator); });
	
	alert(concatenate("hello", " ", "world"));
	alert(concatenate([1, 2, 3], " + "));

#### Any Argument

"*" represents an argument which matches any type of variable.

	var add = Overload
		.add("*, *",
			function(x, y) { return x + y; });
		.add("*, *, *",
			function(x, y, z) { return x + y + z; });
	
	alert(add(1, 2, 3));
	alert(add("hello", " ", "world"));

#### More Argument

"..." represents arguments of any number.

	var sum = Overload
		.add("Number, Number",
			function(x, y) { return x + y; });
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; });
		.add("Number, Number, Number, ...",
			function() {
				var sum = 0;
				for (var i = 0; i < arguments.length; i++) {
					sum += arguments[i];
				}
				return sum;
			});
	
	alert(sum(1, 2));
	alert(sum(1, 2, 3));
	alert(sum(1, 2, 3, 4, 5, 6));

#### Internal Class

If the signature of an overloaded function includes classes that can't be evaluate in the global scope via eval, the signature could be passed as an Array. In this case, "*" is replaced by Overload.Any and "..." is replaced by Overload.More.

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add("String",
			function(string) { alert("Hello, " + string); }) 
		.add("String, String",
			function(string1, string2) { sayHello(string1 + " and " + string2); }) 
		.add([User],
			function(user) { sayHello(user.name); })
		.add([User, User],
			function(user1, user2) { sayHello(user1.name, user2.name); })
		.add([Overload.Any],
			function(object) { sayHello(object.toString()); })
		.add([Overload.More],
			function() { sayHello([].slice.call(arguments).join(" & ")); });
	
	sayHello("World");
	sayHello(new User("Cat"), new User("Erik"));
	sayHello(1, 2, 3, 4, 5);

#### Class Inheritance Resolution

If classes in signatures of overloaded functions have inheritance relationship, Overload will choose the only best match. If there's no only best best, an error will be thrown.

	var Parent = function() {};
	var Child = function() {};
	Child.prototype = new Parent();
	
	var selectClass = Overload
		.add([Parent],
			function(parent) { return "[Parent]"; })
		.add([Child],
			function(child) { return "[Child]"; })
		.add([Parent, Child],
			function(parent, child) { return "[Parent, Child]"; })
		.add([Child, Parent],
			function(child, parent) { return "[Child Parent]"; });
	
	alert(selectClass(new Parent()));
	alert(selectClass(new Child()));
	try {
		alert(selectClass(new Parent(), new Parent()));
	} catch (e) {
		alert (e);
	}
	try {
		alert(selectClass(new Child(), new Child()));
	} catch (e) {
		alert (e);
	}

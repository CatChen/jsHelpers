# Overload 说明文档

Overload 是一个用于在 JavaScript 环境中快速创建函数重载的组件，让使用者能够通过简单的语言描述不同的重载入口，免除各个函数自行处理函数重载的麻烦。 Overload 的细设计目标及实现机制请参考 Weblab 系列文章《让 JavaScript 轻松支持函数重载 (Part <a href="http://www.cnblogs.com/cathsfz/archive/2009/07/02/1515188.html">1</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/07/02/1515566.html">2</a>)》，本文仅用作面向开发者用户的说明文档。

## Overload

用于创建重载入口函数的静态类。

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

创建重载入口函数，并添加函数重载，或在已有入口函数上添加重载。

	var concatenate = Overload
		.add("String, String"),
			function(s1, s2) { return s1 + s2; })
		.add("String, String, String"),
			function(s1, s2, s3) { return s1 + s2 + s3; });
	
	concatenate
		.add("Array",
			function(array) { return array.join(""); })
		.add("Array, String",
			function(array, separator) { return array.join(separator); });
	
	alert(concatenate("hello", " ", "world"));
	alert(concatenate([1, 2, 3], " + "));

#### Any Argument

如果重载包括可以匹配任意类型的形参，这个类型使用 "*" 代替。

	var add = Overload
		.add("*, *",
			function(x, y) { return x + y; })
		.add("*, *, *",
			function(x, y, z) { return x + y + z; });
	
	alert(add(1, 2, 3));
	alert(add("hello", " ", "world"));

#### More Argument

如果重载的形参个数可以是 n 个到无数个，将第 n 个参数使用 "..." 表示。

	var sum = Overload
	    .add("Number",
	        function(x) { return x; })
		.add("Number, Number",
			function(x, y) { return x + y; })
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; })
		.add("Number, Number, Number, ...",
			function(x, y, z, more) {
				return x + y + z + sum.apply(this, more);
			});
	
	alert(sum(1, 2));
	alert(sum(1, 2, 3));
	alert(sum(1, 2, 3, 4, 5, 6));

#### Internal Class

如果重载的形参包括全局 eval 无法解释的类，形参列表可以以数组的形式传入 add 。匹配任意类型的 "*" 类型，可使用 Overload.Any 代替。匹配形参列表末端任意多个参数的 "..." ，可使用 Overload.More 代替。

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
			function(objects) { sayHello(objects.join(" & ")); });
	
	sayHello("World");
	sayHello(new User("Cat"), new User("Erik"));
	sayHello(1, 2, 3, 4, 5);

#### Class Inheritance Resolution

如果多个重载的形参之间存在继承关系， Overload 会选择最匹配的唯一一个重载。如果不存在唯一一个最匹配的重载，则抛出错误。

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

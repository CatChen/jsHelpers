# Overload 内部实现

如果你需要使用 Overload ，请参考对应的<a href="Overload_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## Overload

### Overload.create()

* type: static
* input: none
* output: overloaded : Function

创建重载方法入口，但不添加任何函数重载。静态的 add 方法实际上是调用了静态的 create 方法后，获得了实例再调用实例的 add 方法。

	var sum = Overload.create();
	
	sum
		.add("Number, Number",
			function(x, y) { return x + y; })
	
	sum
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; });

### Overload.match()

* type: instance
* input:
	* arguments : Array
* output: overloads : Array

根据给定的实参列表，筛选出所有类型匹配的函数重载。

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add("String",
			function(string) { alert("Hello, " + string); }) 
		.add([User],
			function(user) { sayHello(user.name); })
		.add("*",
			function(object) { sayHello(object.toString()); })
	
	alert(sayHello.match(["Cat"]).length);

### Overload.select()

* type: instance
* input:
	* arguments : Array
* output: overload : Function

根据给定的实参列表，筛选出唯一一个最匹配的函数重载。如果不存在惟一一个最匹配的函数重载，则返回 null 。

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add("String",
			function(string) { alert("Hello, " + string); }) 
		.add([User],
			function(user) { sayHello(user.name); })
		.add("*",
			function(object) { sayHello(object.toString()); })
	
	alert(sayHello.select(["Cat"]));

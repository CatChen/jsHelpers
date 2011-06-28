# Overload 快速入门

使用 Overload.add ，我们可以创建一个支持重载的函数，并添加第一个重载。

	var sum = Overload
		.add("Number, Number",
			function(x, y) { return x + y; })

再次使用 add ，可以添加下一个重载。

	sum
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; });

之后只要你调用这个函数，对应的重载就会被调用。

	alert(sum(1, 2));
	alert(sum(3, 4, 5));

如果形参列表包含自定义类型，你可以使用数组来表示某一个重载的形参列表。

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add([User]
			function(user) { alert("Hello, " + user.name); });

对于函数的调用者而言，这一切都是透明的。同时， Overload 也为组织函数逻辑带来了极大的方便。

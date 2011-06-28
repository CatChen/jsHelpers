# GrandCentral 内部实现

如果你需要使用 GrandCentral ，请参考对应的<a href="GrandCentral_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## GrandCentral.Operators

* type: static

GrandCentral 所有的 Operator 函数集合。可以通过修改这个集合实现对 Operator 的修改。 GrandCentral 单例及所有通过扩展对象获得的实例共享这一个 Operator 函数集合。其中，每一个 Operator 函数接收两个参数，代表测试表达式的 testValue 以及代表待测试值的 value 。如果待测试值不存在（而非等于 undefined ），则 Operator 函数内部 arguments.length 等于 1 。

	GrandCentral.Operators["odd"] = function(testValue, value) {
		return arguments.length == 2 && ((value % 2 != 0) == testValue)
	};
	
	GrandCentral.Operators["even"] = function(testValue, value) {
		return arguments.length == 2 && ((value % 2 == 0) == testValue)
	};
	
	GrandCentral.listen({
		value1$odd: true,
		value2$even: true
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: 99,
		value2: 42
		value3: "other"
	});

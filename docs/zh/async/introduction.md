# Async 快速入门

在大多数应用程序当中， Async 用于解决 Ajax 带来的复杂异步回调关系，因此先将基本的 Ajax 操作封装起来，让它返回 Operation 实例。

	/* jQuery required for this sample */
	
	var getAsync = function(url, data) {
		var operation = new Async.Operation();
		$.get(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};

接下来，我们编写调用 Ajax 操作的函数，让它同样返回 Operation 实例。

	var plusAsync = function(x, y) {
		return getAsync("/plus", "x=" + x + "&y=" + y);
	}
	
按照这个风格，所有直接调用异步操作的函数都明明为以 Async 结尾，并且返回 Operation 实例。这样，整个应用程序中哪些函数是异步的，哪些函数是同步的，一看就知道了。对于异步函数，也有统一的获取结果方式。

	var x = 1;
	var y = 2;
	
	plusAsync(x, y)
		.addCallback(function(result) { alert(result); });

# Async 功能列表

Async 是一个用于统一 JavaScript 异步编程模式的组件，通过让异步函数统一返回 Async.Operation 使得异步函数不再需要自行处理异步回调，其详细设计目标及实现机制请参考系列文章《写个 JavaScript 异步调用框架 (Part <a href="http://www.cnblogs.com/cathsfz/archive/2009/05/06/1450332.html">1</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/05/07/1451200.html">2</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/05/07/1451937.html">3</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/05/09/1452875.html">4</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/06/30/1514339.html">5</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/07/01/1514983.html">6</a>)》，本文仅用作面向开发者用户的说明文档。

## Async.Operation

表示异步操作的类，异步函数在每次调用时都应该实例化该类的一个新实例。

	/* jQuery required for this sample */
	
	var getAsync = function(url, data) {
		var operation = new Async.Operation();
		$.get(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};
	
	var getOperation = getAsync("/ping", "")
	getOperation.addCallback(function(result) { alert("ping returns: " + result); });

### Async.Operation.result

* type: instance

异步操作的结果。在 yield 执行之前，值一直为 undefined 。在 yield 执行之后，值为 yield 传入的值。

### Async.Operation.state

* type: instance

异步操作的状态。在 yield 执行之前，状态一直为 "running" 。在 yield 执行之后，状态为 "completed" 。

### Async.Operation.completed

* type: instance

异步操作是否已完成。在 yield 执行之前，已完成标志位一直为 false 。在 yield 执行之后，已完成标志位一直为 true 。

### Async.Operation.yield()

* type: instance
* input:
	* value (optional)
* output: this : Operation

为特定的异步操作返回结果。

	var waitAsync = function(delay) {
		var operation = new Async.Operation();
		setTimeout(function() {
			var result = "You have waited " + delay + " millisecond(s)."
			operation.yield(result);
		}, delay);
		return operation;
	}

### Async.Operation.addCallback()

* type: instance
* input:
	* callback : Function
* output: this : Operation

为特定的异步操作添加回调函数。回调函数会在异步操作返回后逐一被调用，回调函数都会接收到一个参数，也就是异步操作的返回结果。

	var waitOperation = wait(999);
	waitOperation.addCallback(function(result) { alert(result); });

## Async.chain()

* type: static
* input: none
* output: chain : Operation

创建一个异步调用队列。

	Async
		.chain()
		.next(firstFunction)
		.next(secondFunction)
		.next(thirdFunction)
		.go();

### Async.chain().result

* type: instance

异步操作的结果。在 go 执行之前，值一直为 undefined 。在 go 执行之后，值为 go 传入的值。随后队列中每一个函数执行完，这个值都会更新为最后执行完的函数的返回值。

### Async.chain().state

* type: instance

异步操作的状态。在 go 执行之前，状态一直为 "waiting" 。在 go 执行之后，状态为 "chain running" 。当队列中的所有函数都执行完后，状态为 "completed" 。

### Async.chain().completed

* type: instance

异步操作是否已完成。在队列执行之前，已完成标志位一直为 false 。在队列执行完之后，已完成标志位改为 true 。

### Async.chain().next()

* type: instance
* input:
	* function : Function
* output: this : Operation

向异步调用队列添加函数。如果该函数返回值类型为 Async.Operation ，队列会等待该异步操作结束后再执行下一个函数；否则队列在执行完该函数后立即执行下一个函数。无论是哪种情况，该函数都会接收到一个参数，该参数为 go 传入的初始值，或者是上一个的函数返回值。该函数的返回值会作为唯一一个参数传给下一个的函数。

	var plusOne = function(i) {
		return i + 1;
	};
	
	var plusOneAsync = function(i) {
		var operation = new Async.Operation();
		setTimeout(function() { operation.yield(i + 1); }, 1000);
		return operation;
	};
	
	Async
		.chain()
		.next(plusOne)
		.next(plusOneAsync)
		.next(function(i) { alert(i); })
		.go(0);

### Async.chain().go()

* type: instance
* input:
	* value (optional)
* output: this : Operation

启动函数队列。如果向 go 传入一个参数，该参数将会作为唯一参数传递给函数队列中的第一个函数。在执行 go 之后，仍可以通过next向函数队列追加函数，并且函数队列总会执行这些追加的函数。

	Async
		.chain()
		.next(firstFunction)
		.next(secondFunction)
		.go()
		.next(thirdFunction);

### Async.chain().wait()

* type: instance
* input:
	* delay : Number
* output: this : Operation

让函数队列等待指定的毫秒数。如果 wait 接收到一个参数，则它会原封不动地把这个参数返回，使得 wait 后面一个函数总能接收到 wait 前面一个函数的返回值。

	Async
		.chain()
		.next(firstFunction)
		.wait(999)
		.next(secondFunction)
		.go();

## Helpers

以下是 Async 主要功能以外的辅助函数

### Async.go()

* type: static
* input:
	* value (optional)
* output: operation : Operation

创建一个异步调用队列，并立即启动该队列。如果传入一个参数，则该参数作为队列第一个函数的唯一参数。

	var plusOne = function(i) {
		return i + 1;
	};
	
	var plusOneAsync = function(i) {
		var operation = new Async.Operation();
		setTimeout(function() { operation.yield(i + 1); }, 1000);
		return operation;
	};
	
	Async
		.go(0)
		.next(plusOne)
		.next(plusOneAsync)
		.next(function(i) { alert(i); });

### Async.wait()

* type: static
* input:
	* delay : Number
	* value (optional)
* output: operation : Operation

等待指定的毫秒数，然后开始执行回调函数。回调函数将要接收到的异步操作结果，可以在第二个参数指定。

	var waitOperation = Async.wait(999, "predefined result");
	waitOperation.addCallback(function(result) { alert(result); });

### Async.instant()

* type: static
* input:
	* value (optional)
* output: operation : Operation

生成一个立即返回的异步函数。回调函数将要接收到的异步操作结果，可以在参数中指定。

	var instantOperation = Async.instant("predefined result");
	instantOperation.addCallback(function(result) { alert(result); });

### Function.prototype.asyncCall()

* type: instance
* input:
	* context
	* values : Params (optional)
* output: operation : Operation

以异步方式调用同步函数，使用方式与 Function.prototype.call() 一致，返回类型为 Async.Operation 。

	var sayHello = function(name) { return "Hello, " + name; };
	sayHello
		.asyncCall(this, "Cat")
		.addCallback(function(result) { alert(result); });

### Function.prototype.asyncApply()

* type: instance
* input:
	* context
	* values : Array (optional)
* output: operatoin : Operation

以异步方式调用同步函数，使用方式与 Function.prototype.apply() 一致，返回类型为 Async.Operation 。

	var sayHello = function(name) { return "Hello, " + name; };
	sayHello
		.asyncApple(this, ["Cat"])
		.addCallback(function(result) { alert(result); });

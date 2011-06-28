# Async 内部实现

如果你需要使用 Async ，请参考对应的<a href="Async_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## Async.Operation

在实例化一个异步操作时，可以传入一组选项。如果其中的 chain 属性为 true ，则该异步操作与 Async.chain() 创建的异步调用队列无异。

	var operation = new Async.Operation({ chain: true });

### Async.Operation.error

* type: instance

异步操作的错误信息。

### Async.Operation.go()

* type: instance
* input:
	* value (optional)
* output: this : Operation

Async.Operation.yield 的别名，在异步队列中使用。

### Async.Operation.next()

* type: instance
* input:
	* function : Function
* output: this : Operation

Async.Operation.addCallback 的别名，在异步队列中使用。

### Async.Operation.onerror()

* type: instance
* input:
	* handler : Function
* output: this : Operation

为异步操作添加错误处理函数。当异步操作的回调发生错误时，错误处理函数将被调用。

	var operation = new Async.Operation();
	operation.addCallback(function() { throw "predefined error"; });
	operation.onerror(function(operation) { alert(operation.error); });
	operation.yield();

## Async.chain()

### Async.chain().error

* type: instance

异步队列的错误信息。

### Async.chain().onerror()

* type: instance
* input:
	* handler : Function
* output: this : Operation

为异步队列添加错误处理函数。当异步队列的回调发生错误时，错误处理函数将被调用。

## Helpers

### Async.onerror()

* type: static
* input:
	* handler : Function
* output: Async

为 Async 添加错误处理函数。任何异步操作或异步队列发生错误时，错误处理函数都会被调用。

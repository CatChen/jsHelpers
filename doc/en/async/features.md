# Async Features

Async is a component for the unification of JavaScript asynchronous programming style. It let all asynchronous functions return instances of Async.Operation and they don't have to handle callback functions themselves.

## Async.Operation

A class represents an asynchronous operation. Every asynchronous operation should instantiate an Async.Operation object.

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

Result of the asynchronous operation. It should be undefinied before yield is called. It should be the same value as the argument of yield after yield is called.

### Async.Operation.state

* type: instance

State of the asynchronous operation. It should be "running" before yield is called. It should be "completed" after yield is called.

### Async.Operation.completed

* type: instance

Indicator of whether the asynchronous operation is completed. It should be false before yield is called. It should be true after yield is called.

### Async.Operation.yield()

* type: instance
* input:
	* value (optional)
* output: this : Operation

Return value for a specific asynchronous operation.

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

Add callback function to a specific asynchronous operation. These callback functions will be executed one by one and they will receive one argument as the result of the asynchronous operation.

	var waitOperation = wait(999);
	waitOperation.addCallback(function(result) { alert(result); });

## Async.chain()

* type: static
* input: none
* output: chain : Operation

Create an asynchronous execution queue.

	Async
		.chain()
		.next(firstFunction)
		.next(secondFunction)
		.next(thirdFunction)
		.go();

### Async.chain().result

* type: instance

Result of the asynchronous operation. It should be undefined before go is called. It should be the result of the last executed function in the queue after go is called.

### Async.chain().state

* type: instance

State of the asynchronous operation. It should be "waiting" before go is called. It should be "chain running" after go is called. It should be "completed" when all functions in the queue are executed.

### Async.chain().completed

* type: instance

Indicator of whether the asynchronous operation is completed. It should be false before all functions in the queue are executed. It should be true after that.

### Async.chain().next()

* type: instance
* input:
	* function : Function
* output: this : Operation

Append a function to the queue. If the function returns an instance of Async.Operation, the queue will wait for the asynchronous operation inside this function to be finished before moving on to next function in the queue. Otherwise, next function in the queue is executed right after this function. In both situations, the function will receive one argument when it's call. This argument will be the argument of go if the function is the first in the queue. Otherwise, it's result of the previous function in the queue. In both situations, the result of this function will be passed on to next function in the queue as an argument.

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

Start the functions queue. If go is called with one argument, this argument will be the argument of the first function in the queue. Appending more functions to the queue by calling next is still possible after go is called.

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

Let the functions queue wait in milliseconds. It will let the result of the previous function pass through and the next function will receive it as an argument.

	Async
		.chain()
		.next(firstFunction)
		.wait(999)
		.next(secondFunction)
		.go();

## Helpers

Below are the helper functions besides Async's main functions.

### Async.go()

* type: static
* input:
	* value (optional)
* output: operation : Operation

Create an asynchronous function queue and start the queue imidiately. If an argument is passed to go, it will be passed to the first function in the queue.

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

### Async.collect()

* type: static
* input:
	* functions : Array
	* functionArguments : Array (optional)
* output: operation : Operation

Create an asynchronous operation containing a set of parallel child operations. The operation will call its callbacks when all child operations are completed.

	var plusOne = function(i) {
		return i + 1;
	};
	
	var plusOneAsync = function(i) {
		var operation = new Async.Operation();
		setTimeout(function() { operation.yield(i + 1); }, 1000);
		return operation;
	};
	
	var parallelOperation = Async
		.collect([
			plusOne,
			plusOneAsync
		], [99, 100]);
	parallelOperation.addCallback(function(results) { alert(results); });

### Async.wait()

* type: static
* input:
	* delay : Number
	* value (optional)
* output: operation : Operation

Wait in millisenconds as an asynchronous operation. If the second argument is assigned, callback functions will receive it as an argument.

	var waitOperation = Async.wait(999, "predefined result");
	waitOperation.addCallback(function(result) { alert(result); });

### Async.instant()

* type: static
* input:
	* value (optional)
* output: operation : Operation

Generate an instant yielded asynchronous operation. If an argument is given, it will be passed to the callback functions.

	var instantOperation = Async.instant("predefined result");
	instantOperation.addCallback(function(result) { alert(result); });

### Function.prototype.asyncCall()

* type: instance
* input:
	* context
	* values : Params (optional)
* output: operation : Operation

Call function in an asynchronous manner. It works like Function.prototype.call() and returns an instance of Async.Operation.

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

Call function in an asynchronous manner. It works like Function.prototype.apply() and returns an instance of Async.Operation.

	var sayHello = function(name) { return "Hello, " + name; };
	sayHello
		.asyncApple(this, ["Cat"])
		.addCallback(function(result) { alert(result); });

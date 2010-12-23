function testAsync() {
	module("async");

	test("async existence", function() {
		expect(13);

		ok(Async, "Async exists");
		ok(Async.Operation, "Async.Operation exists");

		var operation = new Async.Operation();
		ok(operation.yield, "operation.yield exists");
		ok(operation.go, "operation.go exists");
		ok(operation.addCallback, "operation.addCallback exists");
		ok(operation.next, "operation.next exists");
		ok(operation.onerror, "operation.onerror exists");

		ok(Async.chain, "Async.chain exists");
		ok(Async.go, "Async.go exists");
		ok(Async.wait, "Async.wait exists");
		ok(Async.onerror, "Async.onerror exists");

		ok(Function.prototype.asyncCall, "Function.prototype.asyncCall exists");
		ok(Function.prototype.asyncApply, "Function.prototype.asyncApple exists");
	});

    module("async operation");

	test("async operation callback", function() {
		expect(6);

		var testValue = "-- this is the callback result --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(value); }, asyncFunctionDelay);
			return operation;
		};

		stop();

		var operation = asyncFunction(testValue)
			.addCallback(function(result) {
				ok(true, "first callback called");
				equals(result, testValue, "first callback result");
			})
			.addCallback(function(result) {
				ok(true, "second callback called");
				equals(result, testValue, "second callback result");
			});

		setTimeout(function() {
			operation.addCallback(function(result) {
				ok(true, "late callback called");
				equals(result, testValue, "late callback result");
			});
		}, asyncFunctionDelay * 2)

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3)
	});

	test("async operation callback without yield", function() {
		expect(3);

		var asyncFunctionWithoutYield = function() {
			var operation = new Async.Operation();
			return operation;
		};

		stop();

		var operation = asyncFunctionWithoutYield()
			.addCallback(function(result) {
				ok(false, "no yield operation should not callback")
			})

		equals(operation.result, undefined, "operation.result at the beginning");
		equals(operation.state, "running", "operation.state at the beginning");
		equals(operation.completed, false, "operation.completed at the beginning");

		start();
	});

	test("async operation object", function() {
		expect(15);

		var testValue = "-- this is the callback result --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(value); }, asyncFunctionDelay);
			return operation;
		};

		stop();

		var operation = asyncFunction(testValue)
			.addCallback(function(result) {
			})

		equals(operation.result, undefined, "operation.result at the beginning");
		equals(operation.state, "running", "operation.state at the beginning");
		equals(operation.completed, false, "operation.completed at the beginning");

		setTimeout(function() {
			equals(operation.result, undefined, "operation.result before yield");
			equals(operation.state, "running", "operation.state before yield");
			equals(operation.completed, false, "operation.completed before yield");
		}, asyncFunctionDelay - 1);

		setTimeout(function() {
			equals(operation.result, testValue, "operation.result after yield");
			equals(operation.state, "completed", "operation.state after yield");
			equals(operation.completed, true, "operation.completed after yield");
		}, asyncFunctionDelay + 1);

		setTimeout(function() {
			equals(operation.result, testValue, "operation.result after callback");
			equals(operation.state, "completed", "operation.state after callback");
			equals(operation.completed, true, "operation.completed after callback");
		}, asyncFunctionDelay + syncFunctionDelay);

		setTimeout(function() {
			operation.addCallback(function(result) {
			});
		}, asyncFunctionDelay * 2)

		setTimeout(function() {
			equals(operation.result, testValue, "operation.result after late callback");
			equals(operation.state, "completed", "operation.state after late callback");
			equals(operation.completed, true, "operation.completed after late callback");
		}, asyncFunctionDelay * 2 + syncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3)
	});

	test("error during async operation", function() {
		expect(9);
		
		var testValue = "-- this is the callback result --";
		var errorValue = "-- this is the error --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(testValue) }, asyncFunctionDelay);
			return operation;
		};

		stop();

		Async.onerror(function(operation) {
				ok(true, "Async.onerror called")
				equals(operation.error, errorValue, "operation.error after error occured");
				equals(operation.state, "error", "operation.state after error occured")
			});
			
		var operation = asyncFunction(testValue)
			.addCallback(function(result) {
				ok(true, "first callback called");
				throw errorValue;
			})
			.addCallback(function(result) {
				ok(false, "second callback shouldn't be called");
			})
			.onerror(function(operation) {
				ok(true, "operation.onerror called")
				equals(operation.error, errorValue, "operation.error after error occured");
				equals(operation.state, "error", "operation.state after error occured")
			});

		setTimeout(function() {
			operation.addCallback(function(result) {
				ok(false, "late callback shouldn't be called");
			});
		}, asyncFunctionDelay * 2)

		setTimeout(function() {
			equals(operation.error, errorValue, "operation.error after late callback added");
			equals(operation.state, "error", "operation.state after late callback added")
		}, asyncFunctionDelay * 2 + syncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3)
	});
	
	module("async chain");
	
	test("sync chain go only operation", function() {
		expect(1);

		var syncFunctionDelay = 100;

		stop();

		var chain = Async
			.go(0);
			
		setTimeout(function() {
			equals(chain.result, 0, "sync chain result")
			start();
		}, syncFunctionDelay);
	});
	
	test("sync chain go first operation", function() {
		expect(4);

		var syncFunctionDelay = 100;

		stop();

		Async
			.go(0)
			.next(function(i) {
				ok(true, "sync chain first next called");
				equals(i, 0, "sync chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain second next called");
				equals(i, 1, "sync chain second next argument");
				return i + 1;
			});

		setTimeout(function() {
			start();
		}, syncFunctionDelay);
	});

	test("sync chain go between operation", function() {
		expect(6);

		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "sync chain started");
				equals(i, 0, "sync chain initial argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain first next called");
				equals(i, 1, "sync chain first next argument");
				return i + 1;
			})
			.go(0)
			.next(function(i) {
				ok(true, "sync chain second next called");
				equals(i, 2, "sync chain second next argument");
				return i + 1;
			});

		setTimeout(function() {
			start();
		}, syncFunctionDelay);
	});

	test("sync chain go last operation", function() {
		expect(6);

		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "sync chain started");
				equals(i, 0, "sync chain initial argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain first next called");
				equals(i, 1, "sync chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain second next called");
				equals(i, 2, "sync chain second next argument");
				return i + 1;
			})
			.go(0);

		setTimeout(function() {
			start();
		}, syncFunctionDelay);
	});

	test("sync chain late go operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		var chain = Async
			.chain(function(i) {
				ok(true, "sync chain started");
				equals(i, 0, "sync chain initial argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain first next called");
				equals(i, 1, "sync chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "sync chain second next called");
				equals(i, 2, "sync chain second next argument");
				return i + 1;
			});

		setTimeout(function() {
			chain.go(0);
		}, asyncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay + syncFunctionDelay);
	});

	test("async chain go first operation", function() {
		expect(4);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.go(0)
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 0, "async chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain second next called");
				equals(i, 1, "async chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			});

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2 + syncFunctionDelay);
	});

	test("async chain go between operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "async chain started");
				equals(i, 0, "async chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 1, "async chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.go(0)
			.next(function(i) {
				ok(true, "async chain second next called");
				equals(i, 2, "async chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			});

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3 + syncFunctionDelay);
	});

	test("async chain go last operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "async chain started");
				equals(i, 0, "async chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 1, "async chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain second next called");
				equals(i, 2, "async chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.go(0);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3 + syncFunctionDelay);
	});

	test("async chain late go operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		var chain = Async
			.chain(function(i) {
				ok(true, "async chain started");
				equals(i, 0, "async chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 1, "async chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain second next called");
				equals(i, 2, "async chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			});

		setTimeout(function() {
			chain.go(0);
		}, asyncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 4 + syncFunctionDelay);
	});

	test("hybrid chain go first operation", function() {
		expect(8);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.go(0)
			.next(function(i) {
				ok(true, "hybrid chain first next called");
				equals(i, 0, "hybrid chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "hybrid chain second next called");
				equals(i, 1, "hybrid chain second next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "hybrid chain third next called");
				equals(i, 2, "hybrid chain third next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "hybrid chain fourth next called");
				equals(i, 3, "hybrid chain fourth next argument");
				return i + 1;
			});

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2 + syncFunctionDelay);
	});

	test("hybrid chain go between operation", function() {
		expect(10);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "hybrid chain started");
				equals(i, 0, "hybrid chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "hybrid chain first next called");
				equals(i, 1, "hybrid chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "hybrid chain second next called");
				equals(i, 2, "hybrid chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.go(0)
			.next(function(i) {
				ok(true, "hybrid chain third next called");
				equals(i, 3, "hybrid chain third next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "hybrid chain fourth next called");
				equals(i, 4, "hybrid chain fourth next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			});

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3 + syncFunctionDelay);
	});

	test("hybrid chain go last operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		Async
			.chain(function(i) {
				ok(true, "hybrid chain started");
				equals(i, 0, "hybrid chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "hybrid chain first next called");
				equals(i, 1, "hybrid chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "hybrid chain second next called");
				equals(i, 2, "hybrid chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.go(0);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2 + syncFunctionDelay);
	});

	test("hybrid chain late go operation", function() {
		expect(6);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		var chain = Async
			.chain(function(i) {
				ok(true, "hybrid chain started");
				equals(i, 0, "hybrid chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "hybrid chain first next called");
				equals(i, 1, "hybrid chain first next argument");
				return i + 1;
			})
			.next(function(i) {
				ok(true, "hybrid chain second next called");
				equals(i, 2, "hybrid chain second next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			});

		setTimeout(function() {
			chain.go(0);
		}, asyncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2 + syncFunctionDelay);
	});

	test("async chain wait operation", function() {
		expect(5);

		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;

		stop();

		var chain = Async
			.chain(function(i) {
				ok(true, "async chain started");
				equals(i, 0, "async chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.wait(asyncFunctionDelay)
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 1, "async chain first next argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.go(0);
			
		setTimeout(function() {
			equals(chain.result, 1, "async chain waited after initial call")
		}, asyncFunctionDelay * 1 + syncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 3 + syncFunctionDelay);
	});
	
	test("error during async chain", function() {
		expect(15);
		
		var testValue = "-- this is the callback result --";
		var errorValue = "-- this is the error --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(testValue) }, asyncFunctionDelay);
			return operation;
		};

		stop();

		/* global error was registered before */
		/* it will be triggered by chain and each inner chain */
		/*
		Async.onerror(function(operation) {
				ok(true, "Async.onerror called")
				equals(operation.error, errorValue, "operation.error after error occured");
				equals(operation.state, "error", "operation.state after error occured")
			});
		*/
			
		var chain = Async
			.chain(function(i) {
				ok(true, "async chain started");
				equals(i, 0, "async chain initial argument");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.next(function(i) {
				ok(true, "async chain first next called");
				equals(i, 1, "async chain first next argument");
				
				throw errorValue;
			})
			.next(function(i) {
				ok(false, "async chain second next shouldn't be called");

				var operation = new Async.Operation();
				setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
				return operation;
			})
			.onerror(function(chain) {
				ok(true, "chain.onerror called")
				equals(chain.error, errorValue, "chain.error after error occured");
				equals(chain.state, "error", "chain.state after error occured")
			})
			.go(0);

		setTimeout(function() {
			chain.next(function(i) {
				ok(false, "late callback shouldn't be called");
				return i + 1;
			});
		}, asyncFunctionDelay * 2)

		setTimeout(function() {
			equals(chain.error, errorValue, "chain.error after late callback added");
			equals(chain.state, "error", "chain.state after late callback added")
		}, asyncFunctionDelay * 2 + syncFunctionDelay);

		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2 + syncFunctionDelay)
	});
	
	test("sync to async conversion", function() {
		expect(8);

		var self = this;

		var testValue1 = "hello world";
		var testValue2 = 41.9999;
		var syncFunction = function(argument1, argument2) {
			equals(self, this, "this pointer");
			equals(argument1, testValue1, "argument1");
			equals(argument2, testValue2, "argument2");
			return [testValue1, testValue2];
		};

		stop();

		syncFunction.asyncCall(this, testValue1, testValue2)
			.addCallback(function(result) {
				same(result, [testValue1, testValue2], "asyncCall result");
			});
		syncFunction.asyncApply(this, [testValue1, testValue2])
			.addCallback(function(result) {
				same(result, [testValue1, testValue2], "asyncApply result");
			});

		start.asyncCall(this);
	});
	
	test("async wait short-cut", function() {
		expect(4);
		
		var testValue = "-- this is the callback result --";
		var asyncFunctionDelay = 200;
		var waitMark = false;
		
		stop();
		
		Async.wait(asyncFunctionDelay).addCallback(function() {
			ok(true, "wait callback called");
			waitMark = true;
		});
		
		Async.wait(asyncFunctionDelay, testValue).addCallback(function(context) {
			ok(true, "wait callback with context called");
			equals(context, testValue, "callback context");
			waitMark = true;
		});
		
		setTimeout(function() {
			equals(waitMark, false, "wait callback not called yet");
		}, asyncFunctionDelay * 0.9)
		
		setTimeout(function() {
			start();
		}, asyncFunctionDelay * 2)
	});
}

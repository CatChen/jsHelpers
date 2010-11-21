function testAsync() {
    module("operation");

    test("async existence", function() {
        expect(15);

        ok(Async, "Async exists");
        ok(Async.Operation, "Async.Operation exists");

        var operation = new Async.Operation();
        ok(operation, "new Async.Operation not null");
        ok(operation.yield, "operation.yield exists");
        ok(operation.go, "operation.go exists");
        ok(operation.addCallback, "operation.addCallback exists");
        ok(operation.next, "operation.next exists");
        ok(operation.onerror, "operation.onerror exists");
        ok(operation.wait, "operation.wait exists");

        ok(Async.chain, "Async.chain exists");
        ok(Async.go, "Async.go exists");
        ok(Async.wait, "Async.wait exists");
        ok(Async.onerror, "Async.onerror exists");

        ok(Function.prototype.asyncCall, "Function.prototype.asyncCall exists");
        ok(Function.prototype.asyncApply, "Function.prototype.asyncApple exists");
    });

    test("async operation without callback", function(){
        expect(6);
        
        var testValue = "-- this is without callback result --";
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var asyncFunction = function(value) {
            var operation = new Async.Operation();
            setTimeout(function() { operation.yield(value); }, asyncFunctionDelay);
            return operation;
        };
        
        stop();
        
        var operation = asyncFunction(testValue);
        equals(operation.result, undefined, "operation.result at the beginning, is undefined");
        equals(operation.state, "running", "operation.state at the beginning, is running");
        equals(operation.completed, false, "operation.completed at the beginning, is false");
        
        setTimeout(function() {
            equals(operation.result, testValue, "operation.result after yield, is yield's param");
            equals(operation.state, "completed", "operation.state after yield, is completed");
            equals(operation.completed, true, "operation.completed after yield, is true");
        }, asyncFunctionDelay + 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay);
    });

    test("async operation with one callback", function() {
        expect(5);

        var testValue = "-- this is one callback result --";
        var asyncFunctionDelay = 200;
        var yieldValue = "noset";
        var asyncFunction = function(value) {
            var operation = new Async.Operation();
            setTimeout(function() { 
                equals(yieldValue, "noset", "before yield callback function is not called");
                operation.yield(value); 
            }, asyncFunctionDelay);
            return operation;
        };

        stop();

        var operation = asyncFunction(testValue)
            .addCallback(function(result) {
                yieldValue = "set";
                ok(true, "first callback called");
                equals(result, testValue, "one callback result");
            });
        equals(yieldValue, "noset", "before yield callback function is not called");
        
        setTimeout(function() {
            equals(yieldValue, "set", "after yield callback function is called");
            start();
        }, asyncFunctionDelay+40);
    });

    test("async operation with more callback", function() {
        expect(10);

        var testValue = "-- this is the callback result --";
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var num = 0;
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
                num++;
                equals(num, 1, "this callback first called");
            })
            .addCallback(function(result) {
                ok(true, "second callback called");
                equals(result, testValue, "second callback result");
                num++;
                equals(num, 2, "this callback second called");
            });

        setTimeout(function() {
            var operationCopy = operation.addCallback(function(result) {
                ok(true, "late callback called");
                equals(result, testValue, "late callback result");
                num++;
                equals(num, 3, "this callback third called");
            });
            equals(operationCopy, operation, "callback function return operation");
        }, asyncFunctionDelay * 2)

        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 3);
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
    
    test("async operation object, yield with value", function() {
        expect(16);

        var testValue = "-- this is the callback result --";
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var asyncFunction = function(value) {
            var operation = new Async.Operation();
            setTimeout(function() { 
                var operationCopy = operation.yield(value); 
                equals(operationCopy, operation, "yield's return is operation Object");
            }, asyncFunctionDelay);
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
    
    test("async operation object, yield without value", function() {
        expect(16);

        var testValue = "-- this is the callback result --";
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var asyncFunction = function(value) {
            var operation = new Async.Operation();
            setTimeout(function() { 
                var operationCopy = operation.yield(); 
                equals(operationCopy, operation, "yield's return is operation Object");
            }, asyncFunctionDelay);
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
            equals(operation.result, undefined, "operation.result after yield, yield without value");
            equals(operation.state, "completed", "operation.state after yield");
            equals(operation.completed, true, "operation.completed after yield");
        }, asyncFunctionDelay + 1);

        setTimeout(function() {
            equals(operation.result, undefined, "operation.result after callback, yield without value");
            equals(operation.state, "completed", "operation.state after callback");
            equals(operation.completed, true, "operation.completed after callback");
        }, asyncFunctionDelay + syncFunctionDelay);

        setTimeout(function() {
            operation.addCallback(function(result) {
            });
        }, asyncFunctionDelay * 2)

        setTimeout(function() {
            equals(operation.result, undefined, "operation.result after late callback, yield without value");
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
    
    module("chain");
    test("chain go without next", function() {
        expect(6);
        var syncFunctionDelay = 100;
        stop();

        var chain = Async.chain();
        equals(chain.result, undefined, "before go,result is undefined");
        equals(chain.state, "waiting", "before go,state is waiting");
        equals(chain.completed, false, "before go,completed is undefined");
        chain.go(0);
        setTimeout(function() {
            equals(chain.result, 0, "after go,result is go's param");
            equals(chain.state, "completed", "after go,state is completed");
            equals(chain.completed, true, "after go,completed is true");
        }, syncFunctionDelay/2);
        
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });
    
    test("chain go with one next", function() {
        expect(10);
        var syncFunctionDelay = 100;
        stop();

        var chain = Async.chain();
        equals(chain.result, undefined, "before go,result is undefined");
        equals(chain.state, "waiting", "before go,state is waiting");
        equals(chain.completed, false, "before go,completed is undefined");
        chain
            .next(function(i){
                equals(i, 0, "next's param is go's input");
                equals(chain.result, 0, "after go,result is go's param");
                equals(chain.state, "chain running", "after go,state is chain running");
                equals(chain.completed, false, "after go,completed is true");
                return i+1;
            })
            .go(0);
            
        setTimeout(function() {
            equals(chain.result, 1, "after go,result is go's param");
            equals(chain.state, "completed", "after go,state is completed");
            equals(chain.completed, true, "after go,completed is true");
        }, syncFunctionDelay);
        
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });
    
    test("chain go without param", function() {
        expect(2);
        var syncFunctionDelay = 100;
        stop();

        var chain = Async.chain();
        chain
            .next(function(i){
                equals(i, undefined, "next's param is undefined, for go input no param");
                return 10;
            })
            .go();
            
        setTimeout(function() {
            equals(chain.result, 10, "after go,result is go's param");
        }, syncFunctionDelay);
        
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });
    
    test("chain object", function() {
        expect(12);
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        stop();

        var chain = Async.chain();
        equals(chain.result, undefined, "before go,result is undefined");
        equals(chain.state, "waiting", "before go,state is waiting");
        equals(chain.completed, false, "before go,completed is undefined");
        chain
            .next(function(i){
                equals(chain.result, 0, "first next,result is go's param");
                equals(chain.state, "chain running", "first next,state is chain running");
                equals(chain.completed, false, "first next,completed is true");
                return i+1;
            })
            .go(0)
            .next(function(i){
                equals(chain.result, 1, "second next,result is go's param");
                equals(chain.state, "chain running", "second next,state is chain running");
                equals(chain.completed, false, "second next,completed is true");
                
                var operation = new Async.Operation();
                setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
                return operation;
            });
            
        setTimeout(function() {
            equals(chain.result, 2, "after go,result is go's param");
            equals(chain.state, "completed", "after go,state is completed");
            equals(chain.completed, true, "after go,completed is true");
        }, asyncFunctionDelay + syncFunctionDelay);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay + syncFunctionDelay);
    });

    test("chain next function async、sync、param", function() {
        expect(9);
        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var nextValue = "init";
        stop();

        var chain = Async.chain();
        chain
            .next(function(i){
                var operation = new Async.Operation();
                setTimeout(function() { 
                    nextValue = "async value";
                    operation.yield(nextValue); 
                }, asyncFunctionDelay);
                return operation;
            })
            .next(function(i, j){
                equals(i, nextValue, "next function's input is last next function's return");
                equals(j, undefined, "only one param get from last next function");
                equals(nextValue, "async value", "operation wait async finish, finish");
                nextValue = "sync value";
                return nextValue;
            })
            .next(function(i, j){
                equals(i, nextValue, "next function's input is last next function's return");
                equals(j, undefined, "only one param get from last next function");
                nextValue = "sync value 2";
                return nextValue;
            })
            .go(nextValue);
        equals(nextValue, "init", "nextValue is init before next");
        setTimeout(function() {
            equals(nextValue, "init", "operation wait async finish, no finish yet");
        }, syncFunctionDelay);
        
        if (baidu.browser.chrome){
            setTimeout(function() {
                equals(nextValue, "async value", "operation wait async finish, after asyncFunctionDelay, in chrome");
            }, asyncFunctionDelay+10);
        }
        else if (baidu.browser.opera){
            setTimeout(function() {
                equals(nextValue, "async value", "operation wait async finish, after asyncFunctionDelay, in opera");
            }, asyncFunctionDelay+12);
        }
        else {
            setTimeout(function() {
                equals(nextValue, "async value", "operation wait async finish, after asyncFunctionDelay");
            }, asyncFunctionDelay+20);
        }
        
        setTimeout(function() {
            equals(nextValue, "sync value 2", "operation wait async finish, finished");
        }, asyncFunctionDelay + syncFunctionDelay);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay + syncFunctionDelay);
    });
        
    test("sync chain go first operation", function() {
        expect(5);

        var syncFunctionDelay = 100;

        stop();

        var chain = Async
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
        setTimeout(function(){
            equals(chain.result, 2, "sync chain finished");
        }, syncFunctionDelay - 1);
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });

    test("sync chain go between operation", function() {
        expect(7);

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
            .go(0)
            .next(function(i) {
                ok(true, "sync chain second next called");
                equals(i, 2, "sync chain second next argument");
                return i + 1;
            });

        setTimeout(function(){
            equals(chain.result, 3, "sync chain finished");
        }, syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });

    test("sync chain go last operation", function() {
        expect(7);

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
            })
            .go(0);
        
        setTimeout(function(){
            equals(chain.result, 3, "sync chain finished");
        }, syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });

    test("sync chain late go operation", function() {
        expect(7);

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
        
        setTimeout(function(){
            equals(chain.result, 3, "sync chain finished");
        }, asyncFunctionDelay + syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay + syncFunctionDelay);
    });

    test("async chain go first operation", function() {
        expect(5);

        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;

        stop();

        var chain = Async
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
        setTimeout(function(){
            equals(chain.result, 2, "async chain finished");
        }, asyncFunctionDelay * 2 + syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 2 + syncFunctionDelay);
    });

    test("async chain go between operation", function() {
        expect(7);

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
            .go(0)
            .next(function(i) {
                ok(true, "async chain second next called");
                equals(i, 2, "async chain second next argument");

                var operation = new Async.Operation();
                setTimeout(function() { operation.yield(i + 1); }, asyncFunctionDelay);
                return operation;
            });

        setTimeout(function() {
            equals(chain.result, 3, "async chain finished");
            start();
        }, asyncFunctionDelay * 3 + syncFunctionDelay*2);
    });

    test("async chain go last operation", function() {
        expect(7);

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
            })
            .go(0);

        setTimeout(function() {
            equals(chain.result, 3, "async chain finished");
            start();
        }, asyncFunctionDelay * 3 + syncFunctionDelay*2);
    });

    test("async chain late go operation", function() {
        expect(7);

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
            equals(chain.result, 3, "async chain finished");
            start();
        }, asyncFunctionDelay * 4 + syncFunctionDelay*2);
    });

    test("hybrid chain go first operation", function() {
        expect(9);

        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;

        stop();

        var chain = Async
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
        setTimeout(function(){
            equals(chain.result, 4, "hybrid chain finished");
        }, asyncFunctionDelay * 2 + syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 2 + syncFunctionDelay);
    });

    test("hybrid chain go between operation", function() {
        expect(11);

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
            equals(chain.result, 5, "hybrid chain finished");
            start();
        }, asyncFunctionDelay * 3 + syncFunctionDelay*2);
    });

    test("hybrid chain go last operation", function() {
        expect(7);

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
            })
            .go(0);
        
        setTimeout(function(){
            equals(chain.result, 3, "hybrid chain finished");
        }, asyncFunctionDelay * 2 + syncFunctionDelay - 1);

        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 2 + syncFunctionDelay);
    });

    test("hybrid chain late go operation", function() {
        expect(7);

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

        setTimeout(function(){
            equals(chain.result, 3, "hybrid chain finished");
        }, asyncFunctionDelay * 3 + syncFunctionDelay - 1);

        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 3 + syncFunctionDelay);
    });

    test("sync chain wait operation", function() {
        expect(7);

        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;
        var waitValue = "noset";

        stop();

        var chain = Async
            .chain(function(i) {
                ok(true, "async chain started");
                equals(i, 0, "async chain initial argument");
                waitValue = "first next";
                return i+1;
            })
            .wait(asyncFunctionDelay)
            .next(function(i) {
                waitValue = "second next";
                ok(true, "async chain first next called");
                equals(i, 1, "async chain first next argument");
                return i+1;
            })
            .go(0);
            
        setTimeout(function() {
            equals(waitValue, "first next", "sync chain waited after initial call");
            equals(chain.result, 1, "sync chain waited after initial call");
        }, asyncFunctionDelay - 1);

        setTimeout(function() {
            equals(chain.result, 2, "sync chain finished");
            start();
        }, asyncFunctionDelay + syncFunctionDelay);
    });
    
    test("async chain wait operation", function() {
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
        }, asyncFunctionDelay * 2 + syncFunctionDelay);

        setTimeout(function() {
            equals(chain.result, 2, "sync chain finished");
            start();
        }, asyncFunctionDelay * 3 + syncFunctionDelay*2);
    });
    
    test("hybrid chain wait operation, sync first", function() {
        expect(6);

        var asyncFunctionDelay = 200;
        var syncFunctionDelay = 100;

        stop();

        var chain = Async
            .chain(function(i) {
                ok(true, "async chain started");
                equals(i, 0, "async chain initial argument");
                return i+1;
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
        }, asyncFunctionDelay + syncFunctionDelay);

        setTimeout(function() {
            equals(chain.result, 2, "sync chain finished")
        }, asyncFunctionDelay * 2 + syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 2 + syncFunctionDelay);
    });
    
    test("hybrid chain wait operation, async first", function() {
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
            .wait(asyncFunctionDelay)
            .next(function(i) {
                ok(true, "async chain first next called");
                equals(i, 1, "async chain first next argument");
                return i+1;
            })
            .go(0);
            
        setTimeout(function() {
            equals(chain.result, 1, "async chain waited after initial call")
        }, asyncFunctionDelay * 2);

        setTimeout(function() {
            equals(chain.result, 2, "sync chain finished")
        }, asyncFunctionDelay * 2 + syncFunctionDelay - 1);
        
        setTimeout(function() {
            start();
        }, asyncFunctionDelay * 2 + syncFunctionDelay);
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

    module("Function");    
    test("sync to async conversion", function() {
        expect(18);

        var self = this;
        var syncFunctionDelay = 100;
        var testValue1 = "hello world";
        var testValue2 = 41.9999;
        var testValue3 = "one argu";
        var testValue4 = "no argu";
        var syncFunction = function(argument1, argument2) {
            equals(self, this, "this pointer");
            equals(argument1, testValue1, "argument1");
            equals(argument2, testValue2, "argument2");
            return [testValue1, testValue2];
        };
        var syncFunction2 = function(argument1){
            equals(self, this, "this pointer");
            equals(argument1, testValue3, "argument1");
            return [testValue3];
        };
        var syncFunction3 = function(){
            equals(self, this, "this pointer");
            return [];
        }

        stop();

        syncFunction.asyncCall(this, testValue1, testValue2)
            .addCallback(function(result) {
                same(result, [testValue1, testValue2], "asyncCall result, more param");
            });
        syncFunction2.asyncCall(this, testValue3)
            .addCallback(function(result) {
                same(result, [testValue3], "asyncCall result, one param");
            });
        syncFunction3.asyncCall(this)
            .addCallback(function(result) {
                same(result, [], "asyncCall result, no param");
            });
        syncFunction.asyncApply(this, [testValue1, testValue2])
            .addCallback(function(result) {
                same(result, [testValue1, testValue2], "asyncApply result");
            });
        syncFunction2.asyncApply(this, [testValue3])
            .addCallback(function(result) {
                same(result, [testValue3], "asyncCall result, one param");
            });
        syncFunction3.asyncCall(this)
            .addCallback(function(result) {
                same(result, [], "asyncCall result, no param");
            });
        setTimeout(function(){
            start();
        }, syncFunctionDelay);
//        start.asyncCall(this);
    });
    
    module("Async");
    test("async only go", function() {
        expect(2);
        var syncFunctionDelay = 100;
        stop();
        
        var chain = Async.go();
        var chain2 = Async.go(10);
        
        setTimeout(function() {
            equals(chain.result, undefined, "go without param");
            equals(chain2.result, 10, "go with param");
        }, syncFunctionDelay);

        setTimeout(function() {
            start();
        }, syncFunctionDelay);
    });
    
    test("async wait short-cut", function() {
        expect(5);
        
        var testValue = "-- this is the callback result --";
        var asyncFunctionDelay = 200;
        var waitMark = false;
        
        stop();
        
        Async.wait(asyncFunctionDelay).addCallback(function(text) {
            ok(true, "wait callback called");
            equals(text, undefined, "wait without value,text is undefined");
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

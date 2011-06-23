/*
An implementation to support traditional callback argument or options = { callback: fn } argument
*/

/*
Traditional callback argument support:

    var print = function(result, callback) {
        console.log(result);
        callback(result);
    };
    
    var asyncSquare = function(number, callback) {
        setTimeout(function() {
            callback(number * number);
        }, 0);
    };
    
    Async
        .appendCallbackAsArgument()
        .startWith(2)
        .call(asyncSquare) // 4 is expected
        .call(asyncSquare) // 16 is expected
        .call(print);

More than one non-callback argument support:

    var asyncExponent = function(number, power, callback) {
        var result = 1;
        for (var i = 0; i < power; i++) {
            result *= number;
        }
        setTimeout(function() {
            callback(result);
        }, 0);
    };
    
    Async
        .prependReturnValueAsArgument()
        .appendCallbackAsArgument()
        .startWith(2)
        .call(asyncExponent, 5) // 32 is expected
        .call(asyncExponent, 2) // 1024 is expected
        .call(print);
    
    // or the alternative as
    
    Async
        .insertReturnValueAsArgumentAt(0)
        .appendCallbackAsArgument()
        .startWith(2)
        .call(asyncExponent, 5) // 32 is expected
        .call(asyncExponent, 2) // 1024 is expected
        .call(print);

Callback as a property on options

    var asyncExponentByOptions = function(options) {
        var result = 1;
        for (var i = 0; i < options.power; i++) {
            result *= options.number;
        }
        setTimeout(function() {
            options.callback(result);
        }, 0);
    };
    
    Async
        .injectCallbackAsProperty({ callback: Async.callback })
        .mergeCallbackObjectWithLastArgument()
        .injectReturnValueAsProperty({ number: Async.returnValue })
        .mergeReturnValueObjectWithArgumentAt(0)
        .startWith(2)
        .call(asyncExponentByOptions, { power: 5 }) // 32 is expected
        .call(asyncExponentByOptions, { power: 2 }) // 1024 is expected
        .callWith(print, {
            returnValue: Async.prependAsArgument,
            callback: Async.appendAsArgument
        });
*/
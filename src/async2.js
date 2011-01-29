/*
Reimplement Async1 interface:

    Async.Future()
    Async.Future.prototype.then(function(result) {})
    Async.Future.prototype.when(function(result) {})
    Async.Future.prototype.call(result)
    Object.prototype.asFuture()

*/

/*
Workflow implementation:

    Async.all(future1, future2, future3, ..., callback)
    Async.any(future1, future2, future3, ..., callback)
    Async.sequence(future, callback1, callback2, ...)
        = future.then(function(result1) {
            return callback1(result1).asFuture();
        }).then(function(result2) {
            return callback2(result2).asFuture();
        }).then(function(result3) {
            ...
        })
    Async.if(conditionFuture, successCallback, failureCallback)
    Async.case(...)

*/

/*
Provide Async1 to Async2 facade:

    Async.Operation = Async.Future
    Async.Operation.prototype.addCallback = Async.Future.prototype.when
    Async.Operation.prototype.yield = Async.Future.prototype.call
    Async.chain ~= Async.sequence

*/
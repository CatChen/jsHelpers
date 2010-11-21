(function() {
    var Async = window.Async = {};
    
    var globalErrorCallbacks = [];
    
    var raiseGlobalError = function(operation) {
        for (var i = 0; i < globalErrorCallbacks.length; i++) {
            try {
                globalErrorCallbacks[i](operation);
            } catch (error) {}
        }
    };

    Async.Operation = function(options) {
        options = options || {};

        var callbackQueue = [];
        var errorCallbacks = [];
        var chain = (options.chain && options.chain === true) ? true : false;
        var started = false;
        var innerChain = null;
        
        this.result = undefined;
        this.error = undefined;
        this.state = chain ? "waiting" : "running";
        this.completed = false;
        
        var raiseError = function(operation) {
            for (var i = 0; i < errorCallbacks.length; i++) {
                try {
                    errorCallbacks[i](operation);
                } catch (error) {}
            }
            raiseGlobalError(operation);
        };

        this.yield = function(result) {
            var self = this;
            
            if (self.error) {
                /* will not proceed if any error occured before */
                return this;
            }

            if (!chain) {
                self.result = result;
                self.state = "completed";
                self.completed = true;
            } else {
                started = true;
                self.result = result;
                self.state = "chain running";
                self.completed = false;
            }

            setTimeout(function() {
                if (!innerChain) {
                    /* there is no inner chain constructed and no error occured before */
                    /* we will call all functions in the queue until we encounter an asynchronous function */
                    while (callbackQueue.length > 0 && !self.error) {
                        var callback = callbackQueue.shift();
                        if (chain) {
                            try {
                                var callbackResult = callback(self.result);
                            } catch (error) {
                                self.error = error;
                                self.state = "error";
                                raiseError(self);
                                break;
                            }
                            if (callbackResult && callbackResult instanceof Async.Operation) {
                                /* the result tells that this is an asynchronous function */
                                /* we will construct a inner chain and move all functions in queue to the inner chain */
                                innerChain = Async.chain();
                                innerChain.onerror(function(operation) {
                                    self.error = innerChain.error;
                                    self.state = "error";
                                    raiseError(self);
                                });
                                while (callbackQueue.length > 0) {
                                    innerChain.next(callbackQueue.shift());
                                }
                                innerChain.next(function(result) {
                                    self.result = result;
                                    self.state = "completed";
                                    self.completed = true;
                                    return result;
                                });
                                callbackResult.addCallback(function(result) {
                                    self.result = result;
                                    innerChain.go(result);
                                });
                            } else {
                                self.result = callbackResult;
                            }
                        } else {
                            try {
                                callback(self.result);
                            } catch (error) {
                                self.error = error;
                                self.state = "error";
                                raiseError(self);
                                break;
                            }
                        }
                    }

                    if (!innerChain && !self.error) {
                        /* there is no inner chain constructed in this yield call */
                        /* which means there is no asynchronous function has been called in this chain */
                        /* then the chain is completed */
                        self.state = "completed";
                        self.completed = true;
                    }
                } else {
                    /* there is inner chain constructed by former yield */
                    /* we will move all functions in queue to the inner chain */
                    while (callbackQueue.length > 0) {
                        innerChain.next(callbackQueue.shift());
                    }
                    innerChain.next(function(result) {
                        self.result = result;
                        self.state = "completed";
                        self.completed = true;
                        return result;
                    });
                }
            }, 1);
            return this;
        };

        this.go = function(initialArgument) {
            return this.yield(initialArgument);
        }

        this.addCallback = function(callback) {
            callbackQueue.push(callback);
            if (this.completed || (chain && started)) {
                this.yield(this.result);
            }
            return this;
        };

        this.next = function(nextFunction) {
            return this.addCallback(nextFunction);
        };
        
        this.wait = function(delay) {
            var self = this;
            if (chain) {
                this.next(function() { return Async.wait(delay, self.result); });
            }
            return this;
        };
        
        this.onerror = function(callback) {
            errorCallbacks.push(callback);
            return this;
        };
    };

    Async.chain = function(firstFunction) {
        var chain = new Async.Operation({ chain: true });
        if (firstFunction) {
            chain.next(firstFunction);
        }
        return chain;
    };

    Async.go = function(initialArgument) {
        return Async.chain().go(initialArgument);
    }

    Async.wait = function(delay, context) {
        var operation = new Async.Operation();
        setTimeout(function() {
            operation.yield(context);
        }, delay);
        return operation;
    }
    
    Async.onerror = function(callback) {
        globalErrorCallbacks.push(callback);
        return Async;
    };

    Function.prototype.asyncCall = function() {
        var thisReference = arguments[0];
        var argumentsArray = [];
        for (var i = 1; i < arguments.length; i++) {
            argumentsArray.push(arguments[i]);
        }
        return this.asyncApply(thisReference, argumentsArray);
    };

    Function.prototype.asyncApply = function(thisReference, argumentsArray) {
        var operation = new Async.Operation();
        var self = this;
        setTimeout(function() {
            operation.yield(self.apply(thisReference, argumentsArray || []));
            /* default value for argumentsArray is empty array */
            /* IE8 throws when argumentsArray is undefined */
        }, 1);
        return operation;
    };
})();

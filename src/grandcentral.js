(function() {
    var GrandCentral = window.GrandCentral = {};
    
    var operators = GrandCentral.Operators = {};
    
    operators[""] = function(testValue, value) {
        if (testValue instanceof Array) {
            return operators["in"].apply(this, arguments);
        } else if (testValue instanceof RegExp) {
            return operators["re"].apply(this, arguments);
        } else if (testValue instanceof Function) {
            return operators["ld"].apply(this, arguments);
        } else {
            return operators["eq"].apply(this, arguments);
        }
    };
    
    operators["eq"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        if (testValue === null || testValue === undefined || value === null || value === undefined) {
            return (value === testValue);
        }
        switch (testValue.constructor) {
            case String:
            case Number:
            case Boolean:
                if (testValue.constructor != value.constructor) {
                    return false;
                }
                return value == testValue && value.constructor == testValue.constructor;
            default:
                if (testValue instanceof Array) {
                    if (!(value instanceof Array)) {
                        return false;
                    }
                    if (value.length != testValue.length) {
                        return false;
                    }
                    for (var i = 0; i < testValue.length; i++) {
                        if (!operators["eq"](testValue[i], value[i])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    if (!(value instanceof Object)) {
                        return false;
                    }
                    /* assuming that something is neither String, Number, Boolean, nor Array is Object */
                    for (var key in testValue) {
                        var index = key.lastIndexOf("$");
                        var valueKey;
                        var childValue;
                        var childTestValue = testValue[key];
                        var operator;
                        if (index < 0) {
                            valueKey = key;
                            operator = "";
                        } else {
                            valueKey = key.substr(0, index);
                            operator = key.substr(index + 1);
                        }
                        if (operators[operator]) {
                            if (valueKey in value) {
                                childValue = value[valueKey];
                                if (!operators[operator](childTestValue, childValue)) {
                                    return false;
                                }
                            } else {
                                if (!operators[operator](childTestValue)) {
                                    return false;
                                }
                            }
                        } else {
                            throw "operator doesn't exist: " + operator;
                        }
                    }
                    return true;
                }
        }
    };
    
    operators["ne"] = function(testValue, value) { return arguments.length == 2 && !operators["eq"](testValue, value); };
    operators["lt"] = function(testValue, value) { return arguments.length == 2 && value < testValue; };
    operators["lte"] = function(testValue, value) { return arguments.length == 2 && value <= testValue; };
    operators["gt"] = function(testValue, value) { return arguments.length == 2 && value > testValue; };
    operators["gte"] = function(testValue, value) { return arguments.length == 2 && value >= testValue; };
    
    operators["in"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        for (var i = 0; i < testValue.length; i++) {
            if (operators["eq"](testValue[i], value)) {
                return true;
            }
        }
        return false;
    };
    
    operators["nin"] = function(testValue, value) { return arguments.length == 2 && !operators["in"](testValue, value); };
    
    operators["all"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        if (!(value instanceof Array)) {
            return false;
        }
        var found;
        for (var i = 0; i < testValue.length; i++) {
            found = false;
            for (var j = 0; j < value.length; j++) {
                if (operators["eq"](testValue[i], value[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    };
    
    operators["ex"] = function(testValue, value) {
        if (testValue === true) {
            return arguments.length == 2;
        } else if (testValue === false) {
            return arguments.length == 1;
        }
        return false;
    };
    
    operators["re"] = function(testValue, value) { return arguments.length == 2 && value && value.match && value.match(testValue); };
    
    operators["f"] = function(testValue, value) { return testValue.call(value, value); };
    
    var createFilter = function(condition) {
        return function(json) {
            if (arguments.length > 0) {
                return operators[""](condition, json);
            } else {
                return operators[""](condition);
            }
        };
    };

    var grandCentralService = function(target) {
        var filterHandlerBundles = [];

        target.listen = function(filter, handler) {
            if (!(filter instanceof Function)) {
                filter = createFilter(filter);
            }
            filterHandlerBundles.push({
                filter: filter,
                handler: handler
            });
            return target;
        };

        target.call = function(json) {
            for (var i = 0; i < filterHandlerBundles.length; i++) {
                if (filterHandlerBundles[i].filter.apply(this, arguments)) {
                    filterHandlerBundles[i].handler(json);
                }
            }
            return target;
        };
    };
    
    GrandCentral.extend = function(target) {
        new grandCentralService(target);
        return target;
    };
    
    GrandCentral.extend(GrandCentral);
})();

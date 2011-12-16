(function() {
    var Overload = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Overload;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('overload', function(Y) {
            Y.Overload = Overload;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Overload = Overload;
    } else {
        return;
    }

    var copySignature = function(signature) {
        var copy = signature.slice(0);
        if (signature.more) {
            copy.more = true;
        }
        return copy;
    };

	var parseSignature = function(signature) {
		if (signature.replace(/(^\s+|\s+$)/ig, "") === "") {
			signature = [];
		} else {
			signature = signature.split(",");
			for (var i = 0; i < signature.length; i++) {
				var typeExpression = signature[i].replace(/(^\s+|\s+$)/ig, "");
				var type = null;
				if (typeExpression == "*") {
					type = Overload.Any;
				} else if (typeExpression == "...") {
					type = Overload.More;
				} else {
					try {
						type = eval("(" + typeExpression + ")");
					} catch (error) {
						throw "type expression cannot be evaluated: " + typeExpression;
					}
				}
				signature[i] = type;
			}
		}
		return signature;
	};
    
    var inheritanceComparator = function(type1, type2) {
        if (type1 == type2) {
            return 0;
        } else if (type2 == Overload.Any) {
            return 1;
        } else if (type1 == Overload.Any) {
            return -1;
        } else if (type1.prototype instanceof type2) {
            return 1;
        } else if (type2.prototype instanceof type1) {
            return -1;
        } else {
            return 0;
        }
    };
    
    var overloadComparator = function(overload1, overload2) {
        var signature1Better = false;
        var signature2Better = false;
        var signature1 = overload1.signature;
        var signature2 = overload2.signature;
        if (!signature1.more && signature2.more) {
            /* Function.more only exists in the second signature */
            signature1Better = true;
            signature1 = copySignature(signature1);
            signature1.length = signature2.length;
        } else if (signature1.more && !signature2.more) {
            /* Function.more only exists in the first signature */
            signature2Better = true;
            signature2 = copySignature(signature2);
            signature2.length = signature1.length;
        } else if(signature1.more && signature2.more) {
            /* Function.more exisits in both signature */
            if (signature1.length > signature2.length) {
                signature1Better = true;
                signature1 = copySignature(signature1);
                signature1.length = signature2.length;
            } else if (signature1.length < signature2.length) {
                signature2Better = true;
                signature2 = copySignature(signature2);
                signature2.length = signature1.length;
            }
        }
        for (var i = 0; i < signature1.length; i++) {
            var comparison = inheritanceComparator(signature1[i], signature2[i]);
            if (comparison > 0) {
                signature1Better = true;
            } else if (comparison < 0) {
                signature2Better = true;
            }
        }
        if (signature1Better && !signature2Better) {
            return 1;
        } else if (!signature1Better && signature2Better) {
            return -1;
        } else {
            /* if both signatures are better in some way it means a conflict */
            return 0;
        }
    };
    
    var matchSignature = function(argumentsArray, signature) {
        if (argumentsArray.length < signature.length) {
            return false;
        } else if (argumentsArray.length > signature.length && !signature.more) {
            return false;
        }
        for (var i = 0; i < signature.length; i++) {
            if (!(argumentsArray[i] === null
                || argumentsArray[i] === undefined
                || signature[i] == Overload.Any
                || argumentsArray[i] instanceof signature[i]
                || argumentsArray[i].constructor == signature[i])) {
                    return false;
            }
        }
        return true;
    };
    
    Overload.create = function(overloadsArray) {
        var overloads = [];
        
        var match = function(argumentsArray) {
            var matches = [];
            for (var i = 0; i < overloads.length; i++) {
                if (matchSignature(argumentsArray, overloads[i].signature)) {
                    matches.push(overloads[i]);
                }
            }
            return matches;
        };
        
        var select = function(argumentsArray) {
            var matches = match(argumentsArray);
            switch (matches.length) {
                case 0:
                    return null;
                case 1:
                    return matches[0];
                default:
                    matches = matches.sort(overloadComparator);
                    if (overloadComparator(matches[matches.length - 1], matches[matches.length - 2]) > 0) {
                        return matches[matches.length - 1];
                    } else {
                        return null;
                    }
            }
        };
        
        var overloaded = function() {
            var overload = select(arguments);
            if (overload) {
                var transformedArguments = Array.prototype.slice.call(arguments, 0);
                if (overload.signature.more) {
                    var moreArguments = transformedArguments.splice(overload.signature.length);
                    transformedArguments.push(moreArguments);
                }
                return overload['function'].apply(this, transformedArguments);
            } else {
                throw "cannot select a proper overload";
            }
        };
        
        overloaded.match = match;
        
        overloaded.select = select;
        
        overloaded.add = function(signature, overload) {
            if (signature instanceof Array) {
                signature = copySignature(signature);
            } else if (signature.constructor == String) {
				signature = parseSignature(signature);
            } else {
                throw "signature is neither a string nor an array";
            }
            for (var i = 0; i < signature.length; i++) {
                if (!(signature[i] instanceof Function)) {
                    throw "argument type should be a function";
                }
                if (i < signature.length - 1 && signature[i] == Overload.More) {
                    throw "arguments type cannot be used in any argument except the last one";
                }
            }
            if (signature[signature.length - 1] == Overload.More) {
                signature.length = signature.length - 1;
                signature.more = true;
            }
            overloads.push({
                "signature": signature,
                "function": overload
            });
            return this;
        };
        
        return overloaded;
    };
    
    Overload.add = function(signature, overload) {
        return Overload.create().add(signature, overload);
    };
    
    Overload.Any = function any() {
        throw "this type is only an identifier and should not be instantiated";
    };

    Overload.More = function more() {
        throw "this type is only an identifier and should not be instantiated";
    };
})();

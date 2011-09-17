(function() {
    var AbstractEnumerator = function() {
    };
    
    AbstractEnumerator.prototype.item = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.next = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.reset = function() { throw "abstract enumerator should not be instantiated"; };
    
    var ArrayEnumerator = function(array) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var state = BEFORE;
        var index = 0;
        
        this.item = function() {
            if (state == RUNNING) {
                return array[index];
            } else if (state == BEFORE) {
                throw "incorrect index";
            } else if (state == AFTER) {
                throw "incorrect index";
            }
        };

        this.next = function() {
            switch (state) {
                case BEFORE:
                    if (array.length === 0) {
                        state = AFTER;
                    } else {
                        state = RUNNING;
                    }
                    break;
                case RUNNING:
                    index++;
                    if (index >= array.length) {
                        state = AFTER;
                    }
                    break;
                case AFTER:
                    break;
            }
            return (state != AFTER);
        };

        this.reset = function() {
            state = BEFORE;
            index = 0;
        };
    };
    
    ArrayEnumerator.prototype = new AbstractEnumerator();
    
    var CachedEnumerator = function(innerEnumerator) {
        var index = NaN;
        var arrayCache = [];
        
        this.item = function() {
            if (index >= 0) {
                if (!(index in arrayCache)) {
                    arrayCache[index] = innerEnumerator.item();
                }
                return arrayCache[index];
            } else {
                return innerEnumerator.item();
            }
        };
        
        this.next = function() {
            if (index >= -1) {
                index++;
            }
            return innerEnumerator.next();
        };
        
        this.reset = function() {
            index = -1;
            return innerEnumerator.reset();
        };
        
        this.cache = function() {
            /* this method is for debug only */
            return [].slice.call(arrayCache, 0);
        };
    };
    
    CachedEnumerator.prototype = new AbstractEnumerator();
    
    var BaseEnumerator = function(extensions) {
        this.item = extensions.item;
        this.next = extensions.next;
        this.reset = extensions.reset;
    };
    
    BaseEnumerator.prototype = new AbstractEnumerator();
    
    var StackedEnumerator = function(innerEnumerator, extensions) {
        this.item = innerEnumerator.item;
        this.next = innerEnumerator.next;
        this.reset = innerEnumerator.reset;
        
        if (extensions.item) {
            this.item = function() {
                return extensions.item(innerEnumerator);
            };
        }
        
        if (extensions.next) {
            this.next = function() {
                return extensions.next(innerEnumerator);
            };
        }
        
        if (extensions.reset) {
            this.reset = function() {
                return extensions.reset(innerEnumerator);
            };
        }
    };
    
    StackedEnumerator.prototype = new AbstractEnumerator();
    
    var GeneratorProxy = function(handlers) {
        this["yield"] = function(object) {
            if (handlers["yield"]) {
                handlers["yield"](object);
            }
        };
        
        this.end = function() {
            if (handlers.end) {
                handlers.end();
            }
        };
    };
    
    var List = function(source) {
        var enumerator;
        var arrayCache = [];
        var lengthCache = -1;
        
        if (!source) {
            enumerator = new ArrayEnumerator([]);
            arrayCache = [];
            lengthCache = 0;
        } else if (arguments.length > 1) {
            enumerator = new ArrayEnumerator([].slice.call(arguments, 0));
            arrayCache = [].slice.call(arguments, 0);
            lengthCache = arrayCache.length;
        } else if (source instanceof Array) {
            enumerator = new ArrayEnumerator([].slice.call(source, 0));
            arrayCache = [].slice.call(source, 0);
            lengthCache = arrayCache.length;
        } else if (source instanceof AbstractEnumerator) {
            enumerator = source;
        } else {
            throw "source should be an array";
        }
        
        this.at = function(index) {
            var cacheIndex = 0;
            
            if (index < 0) {
                throw "incorrect index";
            }
            
            if (arrayCache.length > index) {
                return arrayCache[index];
            } else if (lengthCache >= 0 && index >= lengthCache) {
                throw "incorrect index";
            }
            
            enumerator.reset();
            while (enumerator.next()) {
                arrayCache[cacheIndex] = enumerator.item();
                if (index === 0) {
                    var item = arrayCache[cacheIndex];
                    return item;
                } else {
                    index--;
                    cacheIndex++;
                }
            }
            
            lengthCache = cacheIndex;
            throw "incorrect index";
        };
        
        this.length = function() {
            if (lengthCache < 0) {
                enumerator.reset();
                lengthCache = 0;
                while (enumerator.next()) {
                    lengthCache++;
                }
            }
            return lengthCache;
        };
        
        this.each = function(iterator) {            
            enumerator.reset();
            for (var index = 0; index < arrayCache.length; index++) {
                enumerator.next();
                iterator.call(arrayCache[index], arrayCache[index]);
            }
            
            var cacheIndex = arrayCache.length;
            while (enumerator.next()) {
                arrayCache[cacheIndex] = enumerator.item();
                iterator.call(arrayCache[cacheIndex], arrayCache[cacheIndex]);
                cacheIndex++;
            }
            
            lengthCache = cacheIndex;
            return this;
        };
        
        this.toArray = function() {
            if (lengthCache < 0 || arrayCache.length < lengthCache) {
                enumerator.reset();
                for (var index = 0; index < arrayCache.length; index++) {
                    enumerator.next();
                }

                var cacheIndex = arrayCache.length;
                while (enumerator.next()) {
                    arrayCache[cacheIndex] = enumerator.item();
                    cacheIndex++;
                }

                lengthCache = cacheIndex;
            }
            
            return [].slice.call(arrayCache, 0);
        };
        
        this.enumerator = function() {
            return enumerator;
        };
        
        this.cache = function() {
            /* this method is for debug only */
            return [].slice.call(arrayCache, 0);
        };
    };
    
    List.prototype.reverse = function() {
        return new List(this.toArray().reverse());
    };
    
    List.prototype.map = function(predicate) {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                return predicate.call(innerEnumerator.item(), innerEnumerator.item());
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.filter = function(predicate) {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                while ((active = active && innerEnumerator.next()) && !predicate.call(innerEnumerator.item(), innerEnumerator.item()));
                return active;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.fold = function(predicate, start) {
        var accumulation = start;
        
        this.each(function(object) {
            accumulation = predicate.call(object, accumulation, object);
        });
        
        return accumulation;
    };
    
    List.prototype.scan = function(predicate, start) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        var current;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return current;
                    case AFTER:
                        throw "incorrect index";
                }
            },

            next: function(innerEnumerator) {
                var object;
                var active;

                switch (state) {
                    case BEFORE:
                        state = RUNNING;
                        current = start;
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (active) {
                            object = innerEnumerator.item();
                            current = predicate.call(object, current, object);
                        } else {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.takeWhile = function(predicate) {
        var RUNNING = 0, AFTER = 1;
        var self = this;
        var state = RUNNING;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                switch (state) {
                    case RUNNING:
                        active = innerEnumerator.next() && predicate.call(innerEnumerator.item(), innerEnumerator.item());
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = RUNNING;
                innerEnumerator.reset();
            }
        });
                
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.take = function(number) {
        var self = this;
        var count = 0;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                if (count <= number) {
                    return innerEnumerator.item();
                } else {
                    throw "incorrect index";
                }
            },

            next: function(innerEnumerator) {
                if (count < number) {
                    count++;
                    return innerEnumerator.next();
                } else {
                    return false;
                }
            },

            reset: function(innerEnumerator) {
                count = 0;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.dropWhile = function(predicate) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                switch (state) {
                    case BEFORE:
                        while ((active = innerEnumerator.next()) && predicate.call(innerEnumerator.item(), innerEnumerator.item()));
                        if (active) {
                            state = RUNNING;
                        } else {
                            state = AFTER;
                        }
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.drop = function(number) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var count = 0;
                var active = true;
                switch (state) {
                    case BEFORE:
                        while ((active = innerEnumerator.next()) && count < number) {
                            count++;
                        }
                        if (active) {
                            state = RUNNING;
                        } else {
                            state = AFTER;
                        }
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.cycle = function() {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                if (innerEnumerator.next()) {
                    return true;
                } else {
                    innerEnumerator.reset();
                    if (innerEnumerator.next()) {
                        return true;
                    } else {
                        /* empty list produces empty list after cycling */
                        return false;
                    }
                }
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.generate = function(generator) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var current;
        var state = BEFORE;
        var yieldState = RUNNING;
        var arrayCache = [];
        var index = NaN;
        
        var proxy = new GeneratorProxy({
            "yield": function(object) {
                if (yieldState != AFTER) {
                    arrayCache[arrayCache.length] = object;
                }
            },
            end: function() {
                yieldState = AFTER;
            }
        });
        
        var enumerator = new BaseEnumerator({
            item: function() {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return arrayCache[index];
                    case AFTER:
                        throw "incorrect index";
                }
            },

            next: function() {
                switch (state) {
                    case BEFORE:
                    case RUNNING:
                        index++;
                        if (yieldState != AFTER) {
                            while (index >= arrayCache.length && yieldState != AFTER) {
                                generator.call(proxy, proxy);
                            }
                        }
                        state = yieldState;
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function() {
                index = -1;
                state = BEFORE;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.iterate = function(generator, start) {
        var BEFORE = 0, RUNNING = 1;
        var current;
        var state = BEFORE;
        
        var enumerator = new BaseEnumerator({
            item: function() {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return current;
                }
            },

            next: function() {
                switch (state) {
                    case BEFORE:
                        current = start;
                        state = RUNNING;
                        break;
                    case RUNNING:
                        current = generator.call(current, current);
                        break;
                }
                return true;
            },

            reset: function() {
                state = BEFORE;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.count = function(start, step) {
        start = start || 0;
        step = step || 1;
        return List.iterate(function(object) { return object + step; }, start);
    };
    
    List.repeat = function(object) {
        return List.iterate(function(object) { return object; }, object);
    };
    
    List.concatenate = function() {
        var RESET = 0, RUNNING = 1, AFTER = 2;
        var lists = [].slice.call(arguments, 0);
        var listsIndex = 0;
        var state = RESET;
        
        var enumerator = new BaseEnumerator({
            item: function() {
                return lists[listsIndex].enumerator().item();
            },

            next: function() {
                switch (state) {
                    case RESET:
                        lists[listsIndex].enumerator().reset();
                        state = RUNNING;
                        return enumerator.next();
                    case RUNNING:
                        if (!lists[listsIndex].enumerator().next()) {
                            listsIndex++;
                            if (listsIndex < lists.length) {
                                state = RESET;
                                return enumerator.next();
                            } else {
                                state = AFTER;
                            }
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function() {
                listsIndex = 0;
                state = RESET;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.zip = function(predicate) {
        var RUNNING = 0, AFTER = 1;
        var lists = [].slice.call(arguments, 1);
        var state = RUNNING;
        
        if (lists.length === 0) {
            return new List([]);
        }
        
        lists = new List(lists);
        
        var enumerator = new BaseEnumerator({
            item: function() {
                var items;
                switch (state) {
                    case RUNNING:
                        items = lists
                            .map(function() { return this.enumerator().item(); })
                            .toArray();
                        return predicate.apply(items, items);
                    case AFTER:
                        throw "incorrect index";
                }
            },

            next: function() {
                var active = true;
                switch (state) {
                    case RUNNING:
                        lists.each(function() {
                            active = active && this.enumerator().next();
                        });
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }

                return (state != AFTER);
            },

            reset: function() {
                lists.each(function() { this.enumerator().reset(); });
                state = RUNNING;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.all = function(predicate) {
        return this.fold(function(accumulation, object) {
            return accumulation && predicate.call(object, object);
        }, true);
    };

    List.prototype.any = function(predicate) {
        return this.fold(function(accumulation, object) {
            return accumulation || predicate.call(object, object);
        }, false);
    };

    List.prototype.sum = function() {
        return this.fold(function(accumulation, object) {
            return accumulation + object;
        }, 0);
    };

    List.prototype.average = function() {
        var accumulation = this.fold(function(accumulation, object) {
            return [accumulation[0] + object, accumulation[1] + 1];
        }, [0, 0]);
        return accumulation[0] / accumulation[1];
    };

    List.prototype.maximum = function() {
        var first = this.at(0);
        if (first) {
            return this.drop(1).fold(function(accumulation, object) {
                return accumulation > object ? accumulation : object;
            }, first);
        } else {
            throw "cannot process empty list";
        }
    };

    List.prototype.minimum = function() {
        var first = this.at(0);
        if (first) {
            return this.drop(1).fold(function(accumulation, object) {
                return accumulation < object ? accumulation : object;
            }, first);
        } else {
            throw "cannot process empty list";
        }
    };

    List.prototype.head = function() {
        if (this.take(1).length() < 1) {
            throw "cannot process empty list";
        } else {
            return this.at(0);
        }
    };

    List.prototype.tail = function() {
        if (this.take(1).length() < 1) {
            throw "cannot process empty list";
        } else {
            return this.drop(1);
        }
    };

    List.prototype.init = function() {
        if (this.take(1).length() < 1) {
            throw "cannot process empty list";
        } else {
            var BEFORE = 0, RUNNING = 1, AFTER = 2;
            var self = this;
            var state = BEFORE;
            var last;

            var enumerator = new StackedEnumerator(self.enumerator(), {
                item: function(innerEnumerator) {
                    switch (state) {
                        case BEFORE:
                            throw "incorrect index";
                        case RUNNING:
                            return last;
                        case AFTER:
                            throw "incorrect index";
                    }
                },

                next: function(innerEnumerator) {
                    var count = 0;
                    var active = true;
                    switch (state) {
                        case BEFORE:
                            innerEnumerator.next();
                            last = innerEnumerator.item();
                            active = innerEnumerator.next();
                            if (active) {
                                state = RUNNING;
                            } else {
                                state = AFTER;
                            }
                            break;
                        case RUNNING:
                            last = innerEnumerator.item();
                            active = innerEnumerator.next();
                            if (!active) {
                                state = AFTER;
                            }
                            break;
                        case AFTER:
                            break;
                    }
                    return (state != AFTER);
                },

                reset: function(innerEnumerator) {
                    state = BEFORE;
                    innerEnumerator.reset();
                }
            });
            return new List(new CachedEnumerator(enumerator));
        }
    };

    List.prototype.last = function() {
        if (this.take(1).length() < 1) {
            throw "cannot process empty list";
        } else {
            return this.at(this.length() - 1);
        }
    };

    if (typeof module != 'undefined' && module.exports) {
        module.exports = List;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('list', function(Y) {
            Y.List = List;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.List = List;
    } else {
        return;
    }
})();

(function() {
    var List;
    if (module && module.exports) {
        List = module.exports;
    } else if (window) {
        List = window.List;
    } else {
        return;
    }
    
    var ES5Array = List.ES5Array = function(source) {
        List.apply(this, arguments);
        
        this.indexOf = function(searchElement, fromIndex) {
            fromIndex = fromIndex || 0;
            var index = fromIndex;
            var tailList = this.drop(fromIndex).dropWhile(function(object) {
                if (searchElement !== object) {
                    index++;
                    return true;
                } else {
                    return false;
                }
            });
            if (tailList.take(1).length() > 0) {
                return index;
            } else {
                return -1;
            }
        };

        this.lastIndexOf = function(searchElement, fromIndex) {
            fromIndex = fromIndex || this.length();
            var headList = this.take(fromIndex);
            var reversedHeadList = headList.reverse();
            var reversedIndex = this.indexOf.call(reversedHeadList, searchElement);
            if (reversedIndex >= 0) {
                return headList.length() - 1 - reversedIndex;
            } else {
                return -1;
            }
        };

        this.every = function(callbackfn, thisArg) {
            return this.all(function(object) {
                return callbackfn.call(thisArg, object);
            });
        };

        this.some = function(callbackfn, thisArg) {
            return this.any(function(object) {
                return callbackfn.call(thisArg, object);
            });
        };

        this.forEach = function(callbackfn, thisArg) {
            this.each(function(object) {
                callbackfn.call(thisArg, object);
            });
        };

        this.map = function(callbackfn, thisArg) {
            return ES5Array.prototype.map.call(this, function(object) {
                return callbackfn.call(thisArg, object);
            });
        };

        this.filter = function(callbackfn, thisArg) {
            return ES5Array.prototype.filter.call(this, function(object) {
                return callbackfn.call(thisArg, object);
            });
        };

        var reduce = this.reduce = function(callbackfn, initialValue) {
            if (arguments.length > 1) {
                return this.fold(function(accumulation, object) {
                    return callbackfn.call(undefined, accumulation, object);
                }, initialValue);
            } else {
                return reduce.call(this.drop(1), callbackfn, this.at(0));
            }
        };

        this.reduceRight = function(callbackfn, initialValue) {
            return reduce.apply(this.reverse(), arguments);
        };
    };
    
    ES5Array.prototype = new List();
})();

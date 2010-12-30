(function() {
    var Central = window.Central = {};
    
    var centralService = function(target) {
        var listeners = {};

        target.listen = function(command, handler) {
            listeners[command] = listeners[command] || [];
            var i = 0, 
                handlers = listeners[command],
                length = handlers.length;
            while (i < length && handlers[i] != handler) {
                i ++;
            }
            if (i == length) {
                handlers.push(handler);
            }
            return target;
        };

        target.call = function(command, argument) {
            if (listeners[command]) {
                var i = 0, 
                    handlers = listeners[command], 
                    length = handlers.length; 
                for (; i < length; i ++) {
                    try {
                        handlers[i](argument);
                    } catch (error) {}
                }
            }
            return target;
        };
    };
    
    Central.extend = function(target) {
        centralService(target);
        return target;
    };
    
    Central.extend(Central);
})();

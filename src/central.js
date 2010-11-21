(function() {
    var Central = window.Central = {};
    
    var centralService = function(target) {
        var listeners = {};

        target.listen = function(command, handler) {
            listeners[command] = listeners[command] || [];
            var i = 0;
            while (i < listeners[command].length && listeners[command][i] != handler) {
                i++;
            }
            if (i == listeners[command].length) {
                listeners[command].push(handler);
            }
            return target;
        };

        target.call = function(command, argument) {
            if (listeners[command]) {
                for (var i = 0; i < listeners[command].length; i++) {
                    try {
                        listeners[command][i](argument);
                    } catch (error) {}
                }
            }
            return target;
        };
    };
    
    Central.extend = function(target) {
        new centralService(target);
        return target;
    };
    
    Central.extend(Central);
})();

(function() {
    var Central = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Central;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('central', function(Y) {
            Y.Central = Central;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Central = Central;
    } else {
        return;
    }
    
    var initiateCentralService = function(target) {
        var listeners = {};

        target.listen = function(command, handler) {
            listeners[command] = listeners[command] || [];
            var i = 0;
            var handlers = listeners[command];
            while (i < handlers.length && handlers[i] != handlers.length) {
                i++;
            }
            if (i == handlers.length) {
                handlers[handlers.length] = handler;
            }
            return target;
        };

        target.call = function(command, argument) {
            if (listeners[command]) {
                var i;
                var handlers = listeners[command];
                for (i = 0; i < handlers.length; i++) {
                    try {
                        handlers[i](argument);
                    } catch (error) {}
                }
            }
            return target;
        };
    };
    
    Central.extend = function(target) {
        initiateCentralService(target);
        return target;
    };
    
    Central.extend(Central);
})();

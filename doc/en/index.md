# jsHelpers

jsHelpers are several JavaScript components for composing complicated AJAX applications. They are designed to help you write in declarative manner via internal domain specific language. You only need to describe the problem in a proper way and the component will manage the process of solving the problem.

## Async

<!--* <a href="async/introduction.html">Introduction</a>-->
* <a href="async/features.html">Features</a>
<!--* <a href="async/secrets.html">Secrets</a>-->

If your application involves a lot of AJAX operation, Aysnc might help you simplify your code and interface and let you write asynchronous code in synchronous way. You can describe AJAX operation queue in a declarative way.

You can encapsulate fundamental AJAX operation with Async and use Async.Operation to manage every AJAX operation within your application. In the following example, all functions with "Async" suffix return an instance of Async.Operation. Asynchronous callee doesn't need to accept callback function in arguments and doesn't need to invoke callback function explicitly. Asynchronous function returns like any synchronous function does and only those who care about asynchronous result need to retrieve the result.

	/* jQuery required for this sample */
	
	var getAsync = function(url, data) {
		var operation = new Async.Operation();
		$.get(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};
	
	var plusAsync = function(x, y) {
		return getAsync("/plus", "x=" + x + "&y=" + y);
	};
	
	var minusAsync = function(x, y) { /* implementation */ };
	
	var multiplyAsync = function(x, y) { /* implementation */ };
	
	var divideAsync = function(x, y) { /* implementation */ };
	
	var calculateAsync = function(operand, x, y) {
		switch operand {
			case "+":
				return plusAsync(x, y);
			case "-":
				return minusAsync(x, y);
			case "*":
				return multiplyAsync(x, y);
			case "/":
				return divideAsync(x, y);
		}
	}
	
	calculateAsync("+", 99, 1)
		.addCallback(function(result) { alert(result); });

## Overload

<!--* <a href="overload/introduction.html">Introduction</a>-->
* <a href="overload/features.html">Features</a>
<!--* <a href="overload/secrets.html">Secrets</a>-->

You can utilize Overload and simplify function overloading signature description if your application has overloaded functions.

In JavaScript, overloaded functions with the same name must be implemented with one function and this function need to decide which overloaded function is called within itself. Pitfall of such approach is that you have to maintain hard-coded dispatchers within each overloaded functions. All these dispatchers have something in common but code reuse is impossible.

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add("String",
			function(string) { alert("Hello, " + string); }) 
		.add([User],
			function(user) { sayHello(user.name) })

## Central

<!--* <a href="central/introduction.html">Introduction</a>-->
* <a href="central/features.html">Features</a>
<!--* <a href="central/secrets.html">Secrets</a>-->

If your application is composed of a lot of modules, you would like to decouple all these modules. One way to do so is rewriting method invoking with event dispatching.

For example: If methods of module A invoke methods of module B, A depends on B. If it's rewritten as event dispatched by A being listened, A doens't depend on B but B depends on A. In order to remove dependency between A and B, we can use a Central event dispatcher instead. A dispatches event via Central event dispatcher and B listens to Central event dispatcher.

Central event dispatcher distinguish events by their names. One event name represents one event, no matter which module calls of listens to.

    /* jQuery required for this sample */
    
    var mapController = new (function() {
        var mapOffset = { x: 0, y: 0 };
        var redrawMap = function() { /* implementation */ };
        
        Central.listen("mapmove", function(event) {
            mapOffset.x += event.x;
            mapOffset.y += event.y;
            redrawMap();
        });
    })();
    
    var keyboardListener = new (function() {
        var LEFT_ARROW = 37,
            RIGHT_ARROW = 39,
            UP_ARROW = 38,
            DOWN_ARROW = 40;
        
        $(document).keypress(function(event) {
            switch (event.which) {
                case LEFT_ARROW:
                    Central.call("mapmove", { x: -10, y: 0 });
                    break;
                case RIGHT_ARROW:
                    Central.call("mapmove", { x: 10, y: 0 });
                    break;
                case UP_ARROW:
                    Central.call("mapmove", { x: 0, y: 10 });
                    break;
                case DOWN_ARROW:
                    Central.call("mapmove", { x: 0, y: -10 });
                    break;
            }
        });
    })();
    
    var mouseListener = new (function() {
        /* monitor mouse events and dispatch move event in Central */
        /* this module won't be loaded on touch screen devices */
    })();
    
    var touchListener = new (function() {
        /* monitor touch events and dispatch move event in Central */
        /* this module will be loaded on touch screen devices */
    })();

## GrandCentral

<!--* <a href="grandcentral/introduction.html">Introduction</a>-->
* <a href="grandcentral/features.html">Features</a>
<!--* <a href="grandcentral/secrets.html">Secrets</a>-->

If your application has an event source and it needs to dispatch events based on event data, GrandCentral can help you with this. All you need to do is writing patterns for matching in JSON.

For example: Your application watches to all AJAX operations and decide how to react based on JSON in response. In this case, you can write handlers for each types of reaction and use GrandCentral to pattern match JSON response and to call the right handler.

    /* jQuery required for this sample */
    
    $(document).ajaxComplete(function(event, xhr, settings) {
        var response = {
            status: xhr.status,
            json: $.parseJSON(xhr.responseText)
        };
        GrandCentral.call(response);
    };
    
    var chatMessageController = new (function() {
        var renderChatMessage = function(message) { /* implementation */ };
        
        GrandCentral.listen({
            status: 200,
            json: {
                command: "message"
            }
        }, function(response) {
            renderChatMessage(response.json.message);
        });
    })();
    
    var systemNotificationController = new (function() {
        var renderSystemNotification = function(notification) { /* implementation */ };
        
        GrandCentral.listen({
            status: 200,
            json: {
                command: "notification"
            }
        }, function(response) {
            renderSystemNotification(response.json.notification);
        });
    })();
    
    var errorController = new (function() {
        var displayErrorMessage = function() { /* implementation */ };
        
        GrandCentral.listen({
            status$ne: 200
        }, function(response) {
            displayErrorMessage();
        });
    })();

## List

<!--* <a href="list/introduction.html">Introduction</a>-->
* <a href="list/features.html">Features</a>
<!--* <a href="list/secrets.html">Secrets</a>-->

JavaScript built-in Array seems to be not enough if you need to process a lot of data in the form of 1-dimension set. You would like to use Haskell List in this case and this List component for JavaScript is a substitute. List encapsulates Array, provides Haskell List style methods, and simplify your work on data processing.

    var list1 = new List(1, 2, 3, 4, 5, 4, 3, 2, 1, 0);
    
    var list2 = list1.filter(function(i) { return i > 2; });
    assert(list2.toArray() == [3, 4, 5, 4, 3]);
    
    var list3 = list2.map(function(i) { return i * i; });
    assert(list3.toArray() == [9, 16, 25, 16, 9]);
    
    var list4 = List.iterate(function(i) { return i * 2; }, 1);
    
    var list5 = list4.take(10);
    assert(list5.toArray() == [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]);
    
    var list6 = list4
        .map(function(i) { return i - 1; })
        .dropWhile(function(i) { return i < 100; })
        .takeWhile(function(i) { return i < 1000; });
    assert(list6.toArray() == [127, 255, 511]);

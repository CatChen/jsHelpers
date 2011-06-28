# JavaScript 辅助模块

JavaScript 辅助模块是一组专门用于构建复杂 Ajax 应用的基础模块。这些模块有一个共同点，就是它们都让你更多地用声明式语言描述问题，更少地用命令式语言解决问题。从本质上来说，它们相当于在 JavaScript 之上建立了各自问题领域的 Internal DSL (Domain Specific Language) ，并且鼓励你使用这些 Internal DSL 描述该领域的问题，然后模块内部的逻辑会为你求解这些问题，你也就无需编写控制求解过程的命令。

## Async

* <a href="async/introduction.html">快速入门</a>
* <a href="async/features.html">接口文档</a>
* <a href="async/secrets.html">实现文档</a>

如果你的应用程序涉及大量的 Ajax 操作，并且采用了分层的设计思想， Async 能够简化异步操作的接口，使得你可以如同控制同步流程一样控制异步流程。如果你的应用程序还涉及 Ajax 操作队列， Async 能够简化这些队列的实现，让你以声明式语言描述异步队列。

你可以使用 Async 封装最基础的 Ajax 操作，从而使得整个应用程序都通过 Async.Operation 来管理 Ajax 操作，而无需为异步函数加入回调参数。在下面这个例子中，所有名称以 Async 结尾的函数都返回 Async.Operation 实例，这使得异步函数无需接收回调函数，也无需主动调用回调函数，如同同步函数一般把调用结果返回既可。只有在真正关心回调结果的地方，才去获取回调结果。

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

* <a href="overload/introduction.html">快速入门</a>
* <a href="overload/features.html">接口文档</a>
* <a href="overload/secrets.html">实现文档</a>

如果你的应用程序包含若干带有多个重载的函数，你可以使用 Overload 简化对重载入口的描述。

在一般情况下，如果一个函数有多个重载，往往意味着你要在这个函数的内部自行编写代码以识别用户调用的是哪一个重载，然后再选择对应的逻辑执行下去。这样做的坏处是，每一个函数都需要有自己的重载识别逻辑，这些逻辑有相似的地方，但是又略有不同，你很难将它们抽取为子函数，但每个函数独立维护一份这样的逻辑成本也不低。 Overload 完成了对这部分逻辑的抽象工作，使得你不再需要重复编写和维护这些代码，然后提供一个声明式接口，你只需要描述重载入口就可以了。

在下面这个例子当中，我们通过简单的描述实现了一个函数多个重载的分离。

	var User = function(name) { this.name = name; };
	
	var sayHello = Overload
		.add("String",
			function(string) { alert("Hello, " + string); }) 
		.add([User],
			function(user) { sayHello(user.name) })

## Central

* <a href="central/introduction.html">快速入门</a>
* <a href="central/features.html">接口文档</a>
* <a href="central/secrets.html">实现文档</a>

如果你的应用程序由多个不同的模块组成，并且你希望减少这些模块之间的相互依赖关系，一个很简单的解决方案就是把模块之间的方法调用改写为事件派发，并且把事件监听和派发工作都交由中央事件派发器去做。

例如说，原本 A 模块需要调用 B 模块，那么就存在 A 对 B 的单向依赖；如果改写为 A 派发事件， B 监听事件，则可以去掉 A 对 B 的单向依赖，但会增加 B 对 A 的单向依赖。为了解决这个问题，我们可以使用中央事件派发器 Central ， A 通过 Central 派发事件， B 通过 Central 监听 A 可能派发的事件，这时候 A 和 B 之间就不存在任何的依赖关系了，它们都单向依赖于 Central 。

Central 通过字符串形式的事件名称区分不同的事件。无论由哪个模块调用 Central 进行派发，使用同一个名称的事件应该总是代表同一个语义。

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

* <a href="grandcentral/introduction.html">快速入门</a>
* <a href="grandcentral/features.html">接口文档</a>
* <a href="grandcentral/secrets.html">实现文档</a>

如果你的应用程序需要监听一个事件源，并从中根据事件数据进行分拣， GrandCentral 能够帮你完成分拣工作，而你需要做的只是使用简单的 JSON 描述分拣需要进行匹配的模式。

一个常见的例子是，你的应用程序需要监听所有的 AJAX 请求，然后根据服务器端返回的 JSON 内容来判断具体应该如何响应。这时候你可以将响应进行分组，为每一组响应编写一个处理函数，然后使用 GrandCentral 匹配服务器端返回的 JSON 并且让它来调用正确的处理函数。

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

* <a href="list/introduction.html">快速入门</a>
* <a href="list/features.html">接口文档</a>
* <a href="list/secrets.html">实现文档</a>

如果你的应用程序需要处理数组形式的数据，然而你觉得 Array 内置的功能并不够用，并且希望能够使用 Haskell 风格的 List 处理形式，那么你可以使用 List 组件。 List 组件能够封装 Array 操作，提供 Haskell 命令风格的方法，简化列表形式数据的操作。

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

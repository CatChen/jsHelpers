# Central 快速入门

如果需要监听一个事件，我们可以使用 Central.listen 。

	Central.listen("eventname", function(e) {
		/* handle event */
	});

如果需要派发一个事件，我们可以使用 Central.call 。

	Central.call("eventname", {
		/* event argument */
	});

如果单例的 Central 无法满足需求，可以使用 Central.extend 获取多个实例。

	var controller = new Controller();
	
	Central.extend(controller);
	
	controller.listen("eventname", function(e) {
		/* handle event */
	});
	
	controller.call("eventname", {
		/* event argument */
	});

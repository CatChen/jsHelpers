# GrandCentral 快速入门

如果需要捕捉指定属性等于指定值的 JSON ，我们可以使用 GrandCentral.listen 。

	Central.listen({
		status: 200,
		command: "friendstatus"
	}, function(json) {
		/* update friend status */
	});

如果需要派发一个 JSON ，我们可以使用 Central.call 。

	Central.call({
		status: 200,
		command: "friendstatus",
		content: [
			{
				username: "user0",
				status: "online"
			},
			{
				username: "user42",
				status: "away"
			}
		]
	});

如果单例的 GrandCentral 无法满足需求，可以使用 GrandCentral.extend 获取多个实例。

	var controller = new Controller();
	
	GrandCentral.extend(controller);
	
	controller.listen({
		status: 200,
		command: "friendstatus"
	}, function(json) {
		/* update friend status */
	});
	
	controller.call({
		status: 200,
		command: "friendstatus",
		content: [
			{
				username: "user0",
				status: "online"
			},
			{
				username: "user42",
				status: "away"
			}
		]
	});

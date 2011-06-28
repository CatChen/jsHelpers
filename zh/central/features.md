# Central 说明文档

Central 是一个用于在 JavaScript 环境中快速创建事件派发者的组件。

## Central

用于监听事件和派发事件的静态类。

	Central.listen("move", function(e) {
		element.style.left = parseInt(element.style.left) + e.x + "px";
		element.style.top = parseInt(element.style.top) + e.y + "px";
	});
	
	Central.call("move", {
		x: 10,
		y: -20
	});

### Central.listen()

* type: static
* input:
	* command : String
	* handler : Function
* output: Central

监听指定名称的事件。

	Central.listen("move", function(e) {
		element.style.left = parseInt(element.style.left) + e.x + "px";
		element.style.top = parseInt(element.style.top) + e.y + "px";
	});

### Central.call()

* type: static
* input:
	* command : String
	* argument : Object
* output: Central

派发指定名称的事件。

	Central.call("move", {
		x: 10,
		y: -20
	});

## Central.extend()

* type: static
* input: target : Object
* output: target : Object

扩展指定对象，使其拥有 Central 功能。

### Central.extend().listen()

* type: instance
* input:
	* command : String
	* handler : Function
* output: this

监听指定名称的事件。

	var controller = new Controller();
	
	Central.extend(controller);
	
	controller.listen("move", function(e) {
		element.style.left = parseInt(element.style.left) + e.x + "px";
		element.style.top = parseInt(element.style.top) + e.y + "px";
	});

### Central.extend().call()

* type: instance
* input:
	* command : String
	* argument : Object
* output: this

派发指定名称的事件。

	var controller = new Controller();
	
	Central.extend(controller);
	
	controller.call("move", {
		x: 10,
		y: -20
	});

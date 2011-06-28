# Central Features

Central is a JavaScript component for central event dispatcher.

## Central

A static class for listening to and dispatching events.

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

Listen to an event by name.

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

Dispatch event by name.

	Central.call("move", {
		x: 10,
		y: -20
	});

## Central.extend()

* type: static
* input: target : Object
* output: target : Object

Extend an object and it will have the functionalities of Central.

### Central.extend().listen()

* type: instance
* input:
	* command : String
	* handler : Function
* output: this

Listen to an event by name.

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

Dispatch event by name.

	var controller = new Controller();
	
	Central.extend(controller);
	
	controller.call("move", {
		x: 10,
		y: -20
	});

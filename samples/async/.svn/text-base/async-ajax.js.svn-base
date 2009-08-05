(function() {
	var Ajax = window.Ajax = function() {};
	
	Ajax.get = function(url, data) {
		var operation = new Async.Operation();
		$.get(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};

	Ajax.post = function(url, data) {
		var operation = new Async.Operation();
		$.post(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};
})();

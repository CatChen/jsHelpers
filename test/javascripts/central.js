function testCentral() {
	module("central core");
	
	var argument = {};
	
	test("central existence", function() {
		expect(4);
		
		ok(Central, "Central exists");
		ok(Central.listen, "Central.listen exists");
		ok(Central.call, "Central.call exists");
		ok(Central.extend, "Central.extend exists");
	});
	
	test("listen only", function() {
		expect(0);
		
		Central.listen("listen-only", function(e) {
			ok(false, "nobody calls this");
		});
	});
	
	test("call only", function() {
		expect(0);
		
		Central.call("call-only", argument);
	});
	
	test("single call single listen", function() {
		expect(2);
		
		Central.listen("single-call-single-listen", function(e) {
			ok(true, "listener called");
			equals(e, argument, "argument");
		});
		
		Central.call("single-call-single-listen", argument);
	});
	
	test("multiple call single listen", function() {
		expect(4);
		
		Central.listen("multiple-call-single-listen", function(e) {
			ok(true, "listener called");
			equals(e, argument, "argument");
		});
		
		Central.call("multiple-call-single-listen", argument);
		Central.call("multiple-call-single-listen", argument);
	});
	
	test("single call multiple listen", function() {
		expect(4);
		
		Central
			.listen("single-call-multiple-listen", function(e) {
				ok(true, "first listener called");
				equals(e, argument, "argument");
			})
			.listen("single-call-multiple-listen", function(e) {
				ok(true, "second listener called");
				equals(e, argument, "argument");
			});
		
		Central.call("single-call-multiple-listen", argument);
	});
	
	test("multiple call multiple listen", function() {
		expect(8);
		
		Central
			.listen("multiple-call-multiple-listen", function(e) {
				ok(true, "first listener called");
				equals(e, argument, "argument");
			})
			.listen("multiple-call-multiple-listen", function(e) {
				ok(true, "second listener called");
				equals(e, argument, "argument");
			});
		
		Central.call("multiple-call-multiple-listen", argument);
		Central.call("multiple-call-multiple-listen", argument);
	});
	
	test("multiple command", function() {
		expect(8);
		
		Central
			.listen("command-one", function(e) {
				ok(true, "command-one listener called");
				equals(e, argument, "argument");
			})
			.listen("command-two", function(e) {
				ok(true, "command-two listener called");
				equals(e, argument, "argument");
			});
		
		Central
			.listen("command-one", function(e) {
				ok(true, "command-one listener called");
				equals(e, argument, "argument");
			})
			.listen("command-two", function(e) {
				ok(true, "command-two listener called");
				equals(e, argument, "argument");
			});
		
		Central.call("command-one", argument);
		Central.call("command-two", argument);
	});
	
	test("empty command", function() {
		expect(2);
		
		Central.listen("", function(e) {
			ok(true, "listener called");
			equals(e, argument, "argument");
		});
		
		Central.call("", argument);
	});
	
	module("central extension");
	
	test("central extension", function() {
		expect(2);
		
		var extended = Central.extend({});
		
		ok(extended.listen, "extended.listen exists");
		ok(extended.call, "extended.call exists");
	});
	
	test("extension multiple call multiple listen", function() {
		expect(8);
		
		var extended = Central.extend({});
		
		extended
			.listen("command-one", function(e) {
				ok(true, "command-one listener called");
				equals(e, argument, "argument");
			})
			.listen("command-two", function(e) {
				ok(true, "command-two listener called");
				equals(e, argument, "argument");
			});
		
		extended
			.listen("command-one", function(e) {
				ok(true, "command-one listener called");
				equals(e, argument, "argument");
			})
			.listen("command-two", function(e) {
				ok(true, "command-two listener called");
				equals(e, argument, "argument");
			});
		
		extended.call("command-one", argument);
		extended.call("command-two", argument);
	});
}

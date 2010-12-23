function testGrandCentral() {
	module("grand central");
	
	var argument = {};
	
	test("grand central existence", function() {
		expect(4);
		
		ok(GrandCentral, "GrandCentral exists");
		ok(GrandCentral.listen, "GrandCentral.listen exists");
		ok(GrandCentral.call, "GrandCentral.call exists");
		ok(GrandCentral.extend, "GrandCentral.extend exists");
	});
	
	test("listen only", function() {
		expect(0);
		
		GrandCentral.listen({ command: "listen-only" }, function(e) {
			ok(false, "nobody calls this");
		});
	});
	
	test("call only", function() {
		expect(0);
		
		GrandCentral.call({ command: "call-only", value: argument });
	});
	
	test("single call single listen", function() {
		expect(2);
		
		GrandCentral.listen({ command: "single-call-single-listen" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "single-call-single-listen", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "single-call-single-listen", value: argument });
	});
	
	test("multiple call single listen", function() {
		expect(4);
		
		GrandCentral.listen({ command: "multiple-call-single-listen" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "multiple-call-single-listen", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "multiple-call-single-listen", value: argument });
		GrandCentral.call({ command: "multiple-call-single-listen", value: argument });
	});
	
	test("single call multiple listen", function() {
		expect(4);
		
		GrandCentral
			.listen({ command: "single-call-multiple-listen" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "single-call-multiple-listen", value: argument }, "json");
			})
			.listen({ command: "single-call-multiple-listen" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "single-call-multiple-listen", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "single-call-multiple-listen", value: argument });
	});
	
	test("multiple call multiple listen", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "multiple-call-multiple-listen" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "multiple-call-multiple-listen", value: argument}, "json");
			})
			.listen({ command: "multiple-call-multiple-listen" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "multiple-call-multiple-listen", value: argument}, "json");
			});
		
		GrandCentral.call({ command: "multiple-call-multiple-listen", value: argument});
		GrandCentral.call({ command: "multiple-call-multiple-listen", value: argument});
	});
	
	test("multiple command", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "command-one" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one", value: argument }, "json");
			})
			.listen({ command: "command-two" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two", value: argument }, "json");
			});
		
		GrandCentral
			.listen({ command: "command-one" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one", value: argument }, "json");
			})
			.listen({ command: "command-two" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "command-one", value: argument });
		GrandCentral.call({ command: "command-two", value: argument });
	});
	
	test("grand central extension", function() {
		expect(2);
		
		var extended = GrandCentral.extend({});
		
		ok(extended.listen, "extended.listen exists");
		ok(extended.call, "extended.call exists");
	});
	
	test("default operator", function() {
		expect(2);
		
		ok(GrandCentral.Operators[""](
			{ test: "test string" },
			{ test: "test string", value: argument }), "eq selected for non-Array");
		
		ok(GrandCentral.Operators[""](
			{ test: [0, 1, 2] },
			{ test: 1, value: argument }), "in selected for Array");
		
	});
	
	test("eq operator", function() {
		expect(10);
		
		ok(GrandCentral.Operators[""](
			{ test$eq: "test string" },
			{ test: "test string", value: argument }), "passed string test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: "test string" },
			{ test: "not test string", value: argument }), "passed string test");
		ok(GrandCentral.Operators[""](
			{ test$eq: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: 42 },
			{ test: 24, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$eq: true },
			{ test: true, value: argument }), "passed boolean test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: true },
			{ test: false, value: argument }), "passed boolean test");
		ok(GrandCentral.Operators[""](
			{ test$eq: ["test string", 42, true] },
			{ test: ["test string", 42, true], value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: ["test string", 42, false] },
			{ test: ["test string", 42, true], value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$eq: { test$eq: ["test string", 42, true] } },
			{ test: { test: ["test string", 42, true] }, value: argument }), "passed object test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: { test$eq: ["test string", 42, false] } },
			{ test: { test: ["test string", 42, true] }, value: argument }), "passed object test");
	});
	
	test("ne operator", function() {
		expect(10);
		
		ok(!GrandCentral.Operators[""](
			{ test$ne: "test string" },
			{ test: "test string", value: argument }), "passed string test");
		ok(GrandCentral.Operators[""](
			{ test$ne: "test string" },
			{ test: "not test string", value: argument }), "passed string test");
		ok(!GrandCentral.Operators[""](
			{ test$ne: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$ne: 42 },
			{ test: 24, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$ne: true },
			{ test: true, value: argument }), "passed boolean test");
		ok(GrandCentral.Operators[""](
			{ test$ne: true },
			{ test: false, value: argument }), "passed boolean test");
		ok(!GrandCentral.Operators[""](
			{ test$ne: ["test string", 42, true] },
			{ test: ["test string", 42, true], value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$ne: ["test string", 42, false] },
			{ test: ["test string", 42, true], value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$eq: { test$ne: ["test string", 42, true] } },
			{ test: { test: ["test string", 42, true] }, value: argument }), "passed object test");
		ok(GrandCentral.Operators[""](
			{ test$eq: { test$ne: ["test string", 42, false] } },
			{ test: { test: ["test string", 42, true] }, value: argument }), "passed object test");
	});
	
	test("lt operator", function() {
		expect(3);
		
		ok(GrandCentral.Operators[""](
			{ test$lt: 42 },
			{ test: 9.999, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$lt: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$lt: 42 },
			{ test: 99.99, value: argument }), "passed number test");
	});
	
	test("lte operator", function() {
		expect(3);
		
		ok(GrandCentral.Operators[""](
			{ test$lte: 42 },
			{ test: 9.999, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$lte: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$lte: 42 },
			{ test: 99.99, value: argument }), "passed number test");
	});
	
	test("gt operator", function() {
		expect(3);
		
		ok(!GrandCentral.Operators[""](
			{ test$gt: 42 },
			{ test: 9.999, value: argument }), "passed number test");
		ok(!GrandCentral.Operators[""](
			{ test$gt: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$gt: 42 },
			{ test: 99.99, value: argument }), "passed number test");
	});
	
	test("gte operator", function() {
		expect(3);
		
		ok(!GrandCentral.Operators[""](
			{ test$gte: 42 },
			{ test: 9.999, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$gte: 42 },
			{ test: 42, value: argument }), "passed number test");
		ok(GrandCentral.Operators[""](
			{ test$gte: 42 },
			{ test: 99.99, value: argument }), "passed number test");
	});
	
	test("in operator", function() {
		expect(4);
		
		ok(GrandCentral.Operators[""](
			{ test$in: ["test string", 42, true] },
			{ test: "test string", value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$in: ["test string", 42, true] },
			{ test: 42, value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$in: ["test string", 42, true] },
			{ test: true, value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$in: ["test string", 42, true] },
			{ test: false, value: argument }), "passed array test");
	});
	
	test("nin operator", function() {
		expect(4);
		
		ok(!GrandCentral.Operators[""](
			{ test$nin: ["test string", 42, true] },
			{ test: "test string", value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$nin: ["test string", 42, true] },
			{ test: 42, value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$nin: ["test string", 42, true] },
			{ test: true, value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$nin: ["test string", 42, true] },
			{ test: false, value: argument }), "passed array test");
	});
	
	test("all operator", function() {
		expect(6);
		
		ok(GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: ["test string", 42, true], value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: [true, 42, "test string"], value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: [42, true, "test string"], value: argument }), "passed array test");
		ok(GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: [false, true, "test string", 42], value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: ["test string", 42, false], value: argument }), "passed array test");
		ok(!GrandCentral.Operators[""](
			{ test$all: ["test string", 42, true] },
			{ test: [42, "not test string", true], value: argument }), "passed array test");
	});
	
	test("ex operator", function() {
		expect(8);
		
		ok(GrandCentral.Operators[""](
			{ test$ex: true },
			{ test: "test string", value: argument }), "passed test");
		ok(GrandCentral.Operators[""](
			{ test$ex: true },
			{ test: null, value: argument }), "passed test");
		ok(GrandCentral.Operators[""](
			{ test$ex: true },
			{ test: undefined, value: argument }), "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ex: true },
            { value: argument }),
            "passed test");
		ok(!GrandCentral.Operators[""](
			{ test$ex: false },
			{ test: "test string", value: argument }), "passed test");
		ok(!GrandCentral.Operators[""](
			{ test$ex: false },
			{ test: null, value: argument }), "passed test");
		ok(!GrandCentral.Operators[""](
			{ test$ex: false },
			{ test: undefined, value: argument }), "passed test");
        ok(GrandCentral.Operators[""](
            { test$ex: false },
            { value: argument }),
            "passed test");
	});
	
	test("re operator", function() {
        expect(3);
        
        ok(GrandCentral.Operators[""](
            { test$re: /^A.*/ },
            { test: "A135", value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$re: /^A.*/ },
            { test: "B246", value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$re: /^A.*/ },
            { test: undefined, value: argument }),
            "passed test");
	});
	
	test("ld operator", function() {
        expect(2);
        
        ok(GrandCentral.Operators[""](
            { test$ld: function(json) { return Boolean(json); } },
            { test: true, value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ld: function(json) { return Boolean(json); } },
            { test: false, value: argument }),
            "passed test");
	});
}

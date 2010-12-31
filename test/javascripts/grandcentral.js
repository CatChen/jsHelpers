function testGrandCentral() {
	module("grand central core");
	
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
	
	test("single call single listen function", function() {
		expect(2);
		
		GrandCentral.listen(function(e) {
		    return e.command == "single-call-single-listen-function";
		}, function(e) {
			ok(true, "listener called");
			same(e, { command: "single-call-single-listen-function", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "single-call-single-listen-function", value: argument });
	});
	
	test("multiple call single listen function", function() {
		expect(4);
		
		GrandCentral.listen(function(e) {
		    return e.command == "multiple-call-single-listen-function";
		}, function(e) {
			ok(true, "listener called");
			same(e, { command: "multiple-call-single-listen-function", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "multiple-call-single-listen-function", value: argument });
		GrandCentral.call({ command: "multiple-call-single-listen-function", value: argument });
	});
	
	test("single call multiple listen function", function() {
		expect(4);
		
		GrandCentral
			.listen(function(e) {
			    return e.command == "single-call-multiple-listen-function";
			}, function(e) {
				ok(true, "first listener called");
				same(e, { command: "single-call-multiple-listen-function", value: argument }, "json");
			})
			.listen(function(e) {
			    return e.command == "single-call-multiple-listen-function";
			}, function(e) {
				ok(true, "second listener called");
				same(e, { command: "single-call-multiple-listen-function", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "single-call-multiple-listen-function", value: argument });
	});
	
	test("multiple call multiple listen function", function() {
		expect(8);
		
		GrandCentral
		    .listen(function(e) {
		        return e.command == "multiple-call-multiple-listen-function";
		    }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "multiple-call-multiple-listen-function", value: argument}, "json");
			})
		    .listen(function(e) {
		        return e.command == "multiple-call-multiple-listen-function";
		    }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "multiple-call-multiple-listen-function", value: argument}, "json");
			});
		
		GrandCentral.call({ command: "multiple-call-multiple-listen-function", value: argument});
		GrandCentral.call({ command: "multiple-call-multiple-listen-function", value: argument});
	});
	
	test("multiple command function", function() {
		expect(8);
		
		GrandCentral
	        .listen(function(e) {
	            return e.command == "command-one-function";
	        }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		GrandCentral
            .listen(function(e) {
                return e.command == "command-one-function";
            }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "command-one-function", value: argument });
		GrandCentral.call({ command: "command-two-function", value: argument });
	});
	
	test("empty listen function", function() {
		expect(0);
		
		GrandCentral
			.listen(function(e) { }, function(e) {
				ok(false, "listener called");
			})
    		GrandCentral.call({ command: "empty-listen-function", value: argument });
	});
	
	test("single call single listen object", function() {
		expect(2);
		
		GrandCentral.listen({ command: "single-call-single-listen-object" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "single-call-single-listen-object", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "single-call-single-listen-object", value: argument });
	});
	
	test("multiple call single listen object", function() {
		expect(4);
		
		GrandCentral.listen({ command: "multiple-call-single-listen-object" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "multiple-call-single-listen-object", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "multiple-call-single-listen-object", value: argument });
		GrandCentral.call({ command: "multiple-call-single-listen-object", value: argument });
	});
	
	test("single call multiple listen object", function() {
		expect(4);
		
		GrandCentral
			.listen({ command: "single-call-multiple-listen-object" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "single-call-multiple-listen-object", value: argument }, "json");
			})
			.listen({ command: "single-call-multiple-listen-object" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "single-call-multiple-listen-object", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "single-call-multiple-listen-object", value: argument });
	});
	
	test("multiple call multiple listen object", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "multiple-call-multiple-listen-object" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "multiple-call-multiple-listen-object", value: argument}, "json");
			})
			.listen({ command: "multiple-call-multiple-listen-object" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "multiple-call-multiple-listen-object", value: argument}, "json");
			});
		
		GrandCentral.call({ command: "multiple-call-multiple-listen-object", value: argument});
		GrandCentral.call({ command: "multiple-call-multiple-listen-object", value: argument});
	});
	
	test("multiple command object", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		GrandCentral
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "command-one-object", value: argument });
		GrandCentral.call({ command: "command-two-object", value: argument });
	});
	
	test("empty listen object", function() {
		expect(2);
		
		GrandCentral
			.listen({}, function(e) {
				ok(true, "listener called");
				same(e, { command: "empty-listen-object", value: argument }, "json");
			})
    		GrandCentral.call({ command: "empty-listen-object", value: argument });
	});
	
    module("grand central extension");
    
	test("grand central extension", function() {
		expect(2);
		
		var extended = GrandCentral.extend({});
		
		ok(extended.listen, "extended.listen exists");
		ok(extended.call, "extended.call exists");
	});
	
	test("extension multiple command function", function() {
		expect(8);
		
		var extended = GrandCentral.extend({});
		
		extended
	        .listen(function(e) {
	            return e.command == "command-one-function";
	        }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		extended
            .listen(function(e) {
                return e.command == "command-one-function";
            }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		extended.call({ command: "command-one-function", value: argument });
		extended.call({ command: "command-two-function", value: argument });
	});
	
	test("extension multiple command object", function() {
		expect(8);
		
		var extended = GrandCentral.extend({});
		
		extended
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		extended
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		extended.call({ command: "command-one-object", value: argument });
		extended.call({ command: "command-two-object", value: argument });
	});
	
    module("grand central operators");
    
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
	
	test("f operator", function() {
        expect(2);
        
        ok(GrandCentral.Operators[""](
            { test$f: function(json) { return Boolean(json); } },
            { test: true, value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$f: function(json) { return Boolean(json); } },
            { test: false, value: argument }),
            "passed test");
	});
}

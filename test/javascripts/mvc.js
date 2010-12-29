function testMVC() {
	module("mvc core");
	
	test("mvc existence", function() {
		expect(2);
		
		ok(MVC, "MVC exists");
		ok(MVC.Controller, "MVC.Controller exists");
	});
}

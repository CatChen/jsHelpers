function testCentral() {
    module("central");
    
    var argument = {};
    var centralArgu = {"name":"vincent", "status":"ok"}, extendArgu = {"call":"zhou", "status":"false"};
    function ClassA(){return "calssA";}
    function ClassB(){return "calssB";}
    
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
    
    test("listen commmand is empty", function() {
        expect(2);
        
        Central.listen("", function(e) {
            ok(true, "listener called");
            same(e, centralArgu, "argument:{'name':'vincent', 'status':'ok'}");
        });
        
        Central.call("", centralArgu);
    });
    
    test("listen function is empty", function() {
        expect(0);
        
        Central.listen("function empty", function() {});
        
        Central.call("function empty", centralArgu);
    });
    
    test("single call single listen", function() {
        expect(2);
        
        Central.listen("single-call-single-listen", function(e) {
            ok(true, "listener called");
            equals(e, argument, "argument empty");
        });
        
        Central.call("single-call-single-listen", argument);
    });
    
    test("multiple call single listen", function() {
        expect(4);
        
        Central.listen("multiple-call-single-listen", function(e) {
            ok(true, "listener called");
            if (e.name == undefined)
                equals(e, argument, "argument empty");
            else
                same(e, centralArgu, "argument no empty");
        });
        
        Central.call("multiple-call-single-listen", argument);
        Central.call("multiple-call-single-listen", centralArgu);
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
        expect(16);
        
        Central
            .listen("multiple-call-multiple-listen", function(e) {
                ok(true, "first listener called");
                if (e.name == undefined)
                    equals(e, argument, "argument empty");
                else
                    same(e, centralArgu, "argument no empty");
            })
            .listen("multiple-call-multiple-listen", function(e) {
                ok(true, "second listener called");
                if (e.name == undefined)
                    equals(e, argument, "argument empty");
                else
                    same(e, centralArgu, "argument no empty");
            });
        
        Central.call("multiple-call-multiple-listen", argument)
            .call("multiple-call-multiple-listen", argument)
            .call("multiple-call-multiple-listen", centralArgu)
            .call("multiple-call-multiple-listen", centralArgu);
    });
    
    test("after listen,call", function() {
        expect(8);
        
        Central
            .listen("multiple-call-multiple-listen-one", function(e) {
                ok(true, "first listener called");
                same(e, centralArgu, "argument no empty");
            })
            .call("multiple-call-multiple-listen-one", centralArgu)
            .listen("multiple-call-multiple-listen-two", function(e) {
                ok(true, "second listener called");
                same(e, centralArgu, "argument no empty");
            })
            .listen("multiple-call-multiple-listen-one", function(e) {
                ok(true, "first listener called");
                same(e, centralArgu, "argument no empty");
            })
            .call("multiple-call-multiple-listen-two", centralArgu)
            .call("multiple-call-multiple-listen-one", centralArgu);
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
    
    
    module("central.extend");
    test("central extension", function() {
        expect(2);
        
        var extended = Central.extend({});
        
        ok(extended.listen, "extended.listen exists");
        ok(extended.call, "extended.call exists");
    });
    
    test("listen only", function() {
        expect(0);
        var objectA = new ClassA();
        Central.extend(objectA);
        
        objectA.listen("listen-only", function(e) {
            ok(false, "nobody calls this");
        });
    });
    
    test("call only", function() {
        expect(0);
        var objectA = new ClassA();
        objectA = Central.extend(objectA);
        
        objectA.call("call-only", argument);
    });
    
    test("listen commmand is empty", function() {
        expect(2);
        var objectA = new ClassA();
        Central.extend(objectA);
        
        objectA.listen("", function(e) {
            ok(true, "listener called");
            same(e, centralArgu, "argument:{'name':'vincent', 'status':'ok'}");
        });
        
        objectA.call("", centralArgu);
    });
    
    test("listen function is empty", function() {
        expect(0);
        var objectA = new ClassA();
        objectA = Central.extend(objectA);
        objectA.listen("function empty", function() {});
        
        objectA.call("function empty", centralArgu);
    });
    
    test("single call single listen", function() {
        expect(2);
        var objectA = new ClassA();
        Central.extend(objectA);
        
        objectA.listen("single-call-single-listen", function(e) {
            ok(true, "listener called");
            equals(e, argument, "argument empty");
        });
        
        objectA.call("single-call-single-listen", argument);
    });
    
    test("multiple call single listen", function() {
        expect(4);
        var objectA = new ClassA();
        objectA = Central.extend(objectA);
        
        objectA.listen("multiple-call-single-listen", function(e) {
            ok(true, "listener called");
            if (e.name == undefined)
                equals(e, argument, "argument empty");
            else
                same(e, centralArgu, "argument no empty");
        });
        
        objectA.call("multiple-call-single-listen", argument);
        objectA.call("multiple-call-single-listen", centralArgu);
    });
    
    test("single call multiple listen", function() {
        expect(4);
        var objectA = new ClassA();
        objectA = Central.extend(objectA);
        objectA
            .listen("single-call-multiple-listen", function(e) {
                ok(true, "first listener called");
                equals(e, argument, "argument");
            })
            .listen("single-call-multiple-listen", function(e) {
                ok(true, "second listener called");
                equals(e, argument, "argument");
            });
        
        objectA.call("single-call-multiple-listen", argument);
    });
    
    test("multiple call multiple listen", function() {
        expect(16);
        var objectA = new ClassA();
        Central.extend(objectA);
        objectA
            .listen("multiple-call-multiple-listen", function(e) {
                ok(true, "first listener called");
                if (e.name == undefined)
                    equals(e, argument, "argument empty");
                else
                    same(e, centralArgu, "argument no empty");
            })
            .listen("multiple-call-multiple-listen", function(e) {
                ok(true, "second listener called");
                if (e.name == undefined)
                    equals(e, argument, "argument empty");
                else
                    same(e, centralArgu, "argument no empty");
            });
        
        objectA.call("multiple-call-multiple-listen", argument)
            .call("multiple-call-multiple-listen", argument)
            .call("multiple-call-multiple-listen", centralArgu)
            .call("multiple-call-multiple-listen", centralArgu);
    });
    
    test("after listen,call", function() {
        expect(8);
        var objectA = new ClassA();
        objectA = Central.extend(objectA);
        objectA
            .listen("multiple-call-multiple-listen-one", function(e) {
                ok(true, "first listener called");
                same(e, centralArgu, "argument no empty");
            })
            .call("multiple-call-multiple-listen-one", centralArgu)
            .listen("multiple-call-multiple-listen-two", function(e) {
                ok(true, "second listener called");
                same(e, centralArgu, "argument no empty");
            })
            .listen("multiple-call-multiple-listen-one", function(e) {
                ok(true, "first listener called");
                same(e, centralArgu, "argument no empty");
            })
            .call("multiple-call-multiple-listen-two", centralArgu)
            .call("multiple-call-multiple-listen-one", centralArgu);
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
    
    test("Central with Central.extend, each extend is independent", function() {
        expect(12);
        var arguA = {"name":"argument A"}, arguB = {"name":"argument B"}, centralArgu = {"name":"argument Central"}; 
        var arguA_S = {"name":"argument A same"}, arguB_S = {"name":"argument B same"}, centralArgu_S = {"name":"argument Central Same"};
        
        var objectA = new ClassA();
        Central.extend(objectA);
        objectA.listen("same", function(e) {
                ok(true, "first listener called");
                same(e, arguA_S, "comand is same one");
            })
            .listen("ClassA", function(e) {
                ok(true, "second listener called");
                same(e, arguA, "command not same one");
            });
            
        var objectB = new ClassB();
        Central.extend(objectB);
        objectB.listen("same", function(e) {
                ok(true, "first listener called");
                same(e, arguB_S, "comand is same one");
            })
            .listen("ClassB", function(e) {
                ok(true, "second listener called");
                same(e, arguB, "command not same one");
            });
        
        Central.listen("same", function(e) {
                ok(true, "first listener called");
                same(e, centralArgu_S, "comand is same one");
            })
            .listen("Central", function(e) {
                ok(true, "second listener called");
                same(e, centralArgu, "command not same one");
            });
        
        objectA.call("same", arguA_S);
        objectB.call("same", arguB_S);
        Central.call("same", centralArgu_S);
        
        objectA.call("ClassA", arguA); //call ok
        objectB.call("ClassA", arguB); //call fail, test no run
        Central.call("ClassA", centralArgu); //call fail, test no run
        
        objectA.call("ClassB", arguA); //call fail, test no run
        objectB.call("ClassB", arguB); //call ok
        Central.call("ClassB", centralArgu); //call fail, test no run
        
        objectA.call("Central", arguA); //call fail, test no run
        objectB.call("Central", arguB); //call fail, test no run
        Central.call("Central", centralArgu); //call ok
        
    });
    
    module("Exception");
    test("command is null or undefined", function() {
        expect(8);
        var commandS, callS;
        var objectA = new ClassA();
        Central.extend(objectA);
        objectA.listen(null, function(e) {//listen null,undefined should call itself
                ok(true, "should be called anyway");
                same(e, centralArgu, "argument should be equals");
            })
            .listen(commandS, function(e) {//listen null,undefined should call itself
                ok(true, "should be called anyway");
                same(e, extendArgu, "argument should be equals");
            });
        
        Central.listen(null, function(e) {//listen null,undefined should call itself
                ok(true, "should be called anyway");
                same(e, centralArgu, "argument should be equals");
            })
            .listen(commandS, function(e) {//listen null,undefined should call itself
                ok(true, "should be called anyway");
                same(e, extendArgu, "argument should be equals");
            });
        objectA.call(null, centralArgu);
        objectA.call("no exist command", centralArgu);
        objectA.call(callS, extendArgu);    
            
        Central.call(null, centralArgu);
        Central.call("no exist command", centralArgu);
        Central.call(callS, extendArgu);
    });
    
    test("handler is null or undefined", function() {
        expect(0);
        var func;
        
        var objectA = new ClassA();
        Central.extend(objectA);
        objectA.listen("exist command", null)
            .listen("undefined command", func);
        //null,undefined function should not listen, user should check
//        objectA.call("exist command", extendArgu); 
//        objectA.call("undefined command", extendArgu);
        
        Central.listen("exist command", null)
            .listen("undefined command", func);
        //null,undefined function should not listen, user should check
//        Central.call("exist command", centralArgu);
//        Central.call("undefined command", centralArgu);
    });
    /*call arugment is null or undefind should be checked by user
    test("call argument is null or undefined", function() {
        expect(8);
        var func;
        
        var objectA = new ClassA();
        Central.extend(objectA);
        objectA.listen("exist command", function(e){
                ok(true, "commnand is called");
                if (e == undefined)
                    equals(e, undefined, "argument is null");
                else
                    equals(e, null, "argument is undefined");
            });
            
        objectA.call("exist command", null);
        objectA.call("exist command", func);
        
        Central.listen("exist command", function(e){
                ok(true, "commnand is called");
                if (e == undefined)
                    equals(e, undefined, "argument is null");
                else
                    equals(e, null, "argument is undefined");
            });
        Central.call("exist command", null);
        Central.call("exist command", func);
    });*/
}

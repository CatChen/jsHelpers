function testGrandCentral() {
    var argument = {};
    var argu = {name:"vincent", call:"node"};
    
    module("grand central");
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
    
    test("filter is function,one call & one listen", function() {
        expect(2);
        
        GrandCentral.listen(function(json){
            return (json.command == "function");
        }, function(e) {
            ok(true, "listener called");
            same(e, {command: "function", value: argu}, "json");
        });
        
        GrandCentral.call({ command: "function", value: argu });
    });
    
    test("filter is function, multiple call single listen", function() {
        expect(4);
        
        GrandCentral.listen(function(json){ 
            return (json.command == "function-multiple call"); 
        }, function(e) {
            ok(true, "listener called");
            same(e, { command: "function-multiple call", value: argu }, "json");
        });
        
        GrandCentral.call({ command: "function-multiple call", value: argu });
        GrandCentral.call({ command: "function-multiple call", value: argu });
    });
    
    test("filter is function, single call multiple listen", function() {
        expect(4);
        
        GrandCentral
            .listen(function(json){ 
                return (json.command == "function-single call"); 
            }, function(e) {
                ok(true, "first listener called");
                same(e, { command: "function-single call", value: argument }, "json");
            })
            .listen(function(json){ 
                return (json.command == "function-single call"); 
            }, function(e) {
                ok(true, "second listener called");
                same(e, { command: "function-single call", value: argument }, "json");
            });
        
        GrandCentral.call({ command: "function-single call", value: argument });
    });
    
    test("filter is function,multiple call & multiple listen", function() {
        expect(4);
        
        GrandCentral.listen(function(json){
            return (json.command == "function-one");
        }, function(e) {
            ok(true, "listener one called");
            same(e, {command: "function-one", value: argu}, "json one");
        })
        .listen(function(json){
            return (json.command == "function-two");
        }, function(e) {
            ok(true, "listener two called");
            same(e, {command: "function-two", value: argu}, "json two");
        });
        
        GrandCentral.call({ command: "function-two", value: argu })
        .call({command:"function-two", value:argu});
    });
    
    test("filter is function, multiple command", function() {
        expect(8);
        
        GrandCentral
            .listen(function(json){
                return (json.command == "function-command-one");
            }, function(e) {
                ok(true, "function-command-one listener called");
                same(e, { command: "function-command-one", value: argument }, "json");
            })
            .listen(function(json){
                return (json.command == "function-command-two");
            }, function(e) {
                ok(true, "function-command-two listener called");
                same(e, { command: "function-command-two", value: argument }, "json");
            });
        
        GrandCentral
            .listen(function(json){
                return (json.command == "function-command-one");
            }, function(e) {
                ok(true, "function-command-one listener called");
                same(e, { command: "function-command-one", value: argument }, "json");
            })
            .listen(function(json){
                return (json.command == "function-command-two");
            }, function(e) {
                ok(true, "function-command-two listener called");
                same(e, { command: "function-command-two", value: argument }, "json");
            });
        
        GrandCentral.call({ command: "function-command-one", value: argument });
        GrandCentral.call({ command: "function-command-two", value: argument });
    });
    
    test("filter is object,one call & one listen", function() {
        expect(2);
        
        GrandCentral.listen({ command: "single-call-single-listen" }, function(e) {
            ok(true, "listener called");
            same(e, { command: "single-call-single-listen", value: argu }, "json");
        });
        
        GrandCentral.call({ command: "single-call-single-listen", value: argu });
    });
    
    test("filter is object, multiple call single listen", function() {
        expect(4);
        
        GrandCentral.listen({ command: "multiple-call-single-listen" }, function(e) {
            ok(true, "listener called");
            same(e, { command: "multiple-call-single-listen", value: argument }, "json");
        });
        
        GrandCentral.call({ command: "multiple-call-single-listen", value: argument });
        GrandCentral.call({ command: "multiple-call-single-listen", value: argument });
    });
    
    test("filter is object, single call multiple listen", function() {
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
    
    test("filter is object,multiple call & multiple listen", function() {
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
    
    test("filter is object, multiple command", function() {
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
    
    test("json is {}", function() {
        expect(4);
        
        GrandCentral.extend({})
            .listen({}, function(e) {
                ok(true, "command is called");
                if (e.command == undefined)
                    same(e, {}, "json");
                else
                    same(e, {command:"aaa"}, "json");
            })
            .call({})
            .call({command:"aaa"});
    });
    
    module("GrandCentral.extend");
    test("grand central extension", function() {
        expect(2);
        
        var extended = GrandCentral.extend({});
        
        ok(extended.listen, "extended.listen exists");
        ok(extended.call, "extended.call exists");
    });
    
    test("listen only", function() {
        expect(0);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj.listen({ command: "listen-only" }, function(e) {
            ok(false, "nobody calls this");
        });
    });
    
    test("call only", function() {
        expect(0);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj.call({ command: "call-only", value: argument });
    });
    
    test("filter is function,one call & one listen", function() {
        expect(2);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj.listen(function(json){
            return (json.command == "function");
        }, function(e) {
            ok(true, "listener called");
            same(e, {command: "function", value: argu}, "json");
        });
        
        extendObj.call({ command: "function", value: argu });
    });
    
    test("filter is function, multiple call single listen", function() {
        expect(4);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj.listen(function(json){ 
            return (json.command == "function-multiple call"); 
        }, function(e) {
            ok(true, "listener called");
            same(e, { command: "function-multiple call", value: argu }, "json");
        });
        
        extendObj.call({ command: "function-multiple call", value: argu });
        extendObj.call({ command: "function-multiple call", value: argu });
    });
    
    test("filter is function, single call multiple listen", function() {
        expect(4);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj
            .listen(function(json){ 
                return (json.command == "function-single call"); 
            }, function(e) {
                ok(true, "first listener called");
                same(e, { command: "function-single call", value: argument }, "json");
            })
            .listen(function(json){ 
                return (json.command == "function-single call"); 
            }, function(e) {
                ok(true, "second listener called");
                same(e, { command: "function-single call", value: argument }, "json");
            });
        
        extendObj.call({ command: "function-single call", value: argument });
    });
    
    test("filter is function,multiple call & multiple listen", function() {
        expect(4);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        
        extendObj.listen(function(json){
            return (json.command == "function-one");
        }, function(e) {
            ok(true, "listener one called");
            same(e, {command: "function-one", value: argu}, "json one");
        })
        .listen(function(json){
            return (json.command == "function-two");
        }, function(e) {
            ok(true, "listener two called");
            same(e, {command: "function-two", value: argu}, "json two");
        });
        
        extendObj.call({ command: "function-two", value: argu })
        .call({command:"function-two", value:argu});
    });
    
    test("filter is function, multiple command", function() {
        expect(8);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj
            .listen(function(json){
                return (json.command == "function-command-one");
            }, function(e) {
                ok(true, "function-command-one listener called");
                same(e, { command: "function-command-one", value: argument }, "json");
            })
            .listen(function(json){
                return (json.command == "function-command-two");
            }, function(e) {
                ok(true, "function-command-two listener called");
                same(e, { command: "function-command-two", value: argument }, "json");
            });
        
        extendObj
            .listen(function(json){
                return (json.command == "function-command-one");
            }, function(e) {
                ok(true, "function-command-one listener called");
                same(e, { command: "function-command-one", value: argument }, "json");
            })
            .listen(function(json){
                return (json.command == "function-command-two");
            }, function(e) {
                ok(true, "function-command-two listener called");
                same(e, { command: "function-command-two", value: argument }, "json");
            });
        
        extendObj.call({ command: "function-command-one", value: argument });
        extendObj.call({ command: "function-command-two", value: argument });
    });
    
    test("filter is object,one call & one listen", function() {
        expect(2);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj.listen({ command: "single-call-single-listen" }, function(e) {
            ok(true, "listener called");
            same(e, { command: "single-call-single-listen", value: argu }, "json");
        });
        
        extendObj.call({ command: "single-call-single-listen", value: argu });
    });
    
    test("filter is object, multiple call single listen", function() {
        expect(4);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj.listen({ command: "multiple-call-single-listen" }, function(e) {
            ok(true, "listener called");
            same(e, { command: "multiple-call-single-listen", value: argument }, "json");
        });
        
        extendObj.call({ command: "multiple-call-single-listen", value: argument });
        extendObj.call({ command: "multiple-call-single-listen", value: argument });
    });
    
    test("filter is object, single call multiple listen", function() {
        expect(4);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj
            .listen({ command: "single-call-multiple-listen" }, function(e) {
                ok(true, "first listener called");
                same(e, { command: "single-call-multiple-listen", value: argument }, "json");
            })
            .listen({ command: "single-call-multiple-listen" }, function(e) {
                ok(true, "second listener called");
                same(e, { command: "single-call-multiple-listen", value: argument }, "json");
            });
        
        extendObj.call({ command: "single-call-multiple-listen", value: argument });
    });
    
    test("filter is object,multiple call & multiple listen", function() {
        expect(8);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj
            .listen({ command: "multiple-call-multiple-listen" }, function(e) {
                ok(true, "first listener called");
                same(e, { command: "multiple-call-multiple-listen", value: argument}, "json");
            })
            .listen({ command: "multiple-call-multiple-listen" }, function(e) {
                ok(true, "second listener called");
                same(e, { command: "multiple-call-multiple-listen", value: argument}, "json");
            });
        
        extendObj.call({ command: "multiple-call-multiple-listen", value: argument});
        extendObj.call({ command: "multiple-call-multiple-listen", value: argument});
    });
    
    test("filter is object, multiple command", function() {
        expect(8);
        var extendObj = {name:"zzz"};
        GrandCentral.extend(extendObj);
        extendObj
            .listen({ command: "command-one" }, function(e) {
                ok(true, "command-one listener called");
                same(e, { command: "command-one", value: argument }, "json");
            })
            .listen({ command: "command-two" }, function(e) {
                ok(true, "command-two listener called");
                same(e, { command: "command-two", value: argument }, "json");
            });
        
        extendObj
            .listen({ command: "command-one" }, function(e) {
                ok(true, "command-one listener called");
                same(e, { command: "command-one", value: argument }, "json");
            })
            .listen({ command: "command-two" }, function(e) {
                ok(true, "command-two listener called");
                same(e, { command: "command-two", value: argument }, "json");
            });
        
        extendObj.call({ command: "command-one", value: argument });
        extendObj.call({ command: "command-two", value: argument });
    });
    
    module("GrandCentral Operator");
    test("default Operator: String", function() {
        expect(2);
        
        GrandCentral
            .listen({
                commandString:"string-command"
            }, function(e) {
                ok(true, "string-command is called");
                same(e, {commandString:"string-command", value: argu}, "json");
            });
        
        GrandCentral.call({commandString:"string-command", value: argu});
        GrandCentral.call({commandString:"no-command", value: argu});
    });
    
    test("default Operator: Number", function() {
        expect(2);
        
        GrandCentral
            .listen({
                commandNumber: 40
            }, function(e) {
                ok(true, "number-command is called");
                same(e, {commandNumber:40, value: argu}, "json");
            });
        
        GrandCentral.call({commandNumber:40, value: argu});
        GrandCentral.call({commandNumber:20, value: argu});
    });
    
    test("default Operator: Boolean", function() {
        expect(2);
        
        GrandCentral
            .listen({
                commandBoolean: true
            }, function(e) {
                ok(true, "boolean-command is called");
                same(e, {commandBoolean:true, value: argu}, "json");
            });
        
        GrandCentral.call({commandBoolean:true, value: argu});
        GrandCentral.call({commandBoolean:false, value:argu});
    });
    
    test("default Operator: Object", function() {
        expect(6);
        
        GrandCentral
            .listen({//without object & array
                commandObject: {
                    commandString:"command-string",
                    commandNumber:4,
                    commandBoolean:false
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    commandObject: {
                        commandString:"command-string",
                        commandNumber:4,
                        commandBoolean:false
                    }, value: argu}, "json");
            })
            .listen({//with array
                commandObject: {
                    commandString:"command-string-array",
                    commandNumber:4,
                    commandBoolean:false,
                    commandArray:[1,2,3]
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    commandObject: {
                        commandString:"command-string-array",
                        commandNumber:4,
                        commandBoolean:false,
                        commandArray:2
                    }, value: argu}, "json");
            })
            .listen({//with object
                commandObject: {
                    commandString:"command-string-object",
                    commandNumber:4,
                    commandBoolean:false,
                    commandArray:[1,2,3],
                    commandObject:{
                        commandString:"commandString"
                    }
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    commandObject: {
                        commandString:"command-string-object",
                        commandNumber:4,
                        commandBoolean:false,
                        commandArray:2,
                        commandObject:{
                            commandString:"commandString"
                        }
                    }, value: argu}, "json");
            });
        //withou array & object
        GrandCentral.call({
            commandObject: {
                commandString:"command-string",
                commandNumber:4,
                commandBoolean:false
            }, value: argu});
        GrandCentral.call({
            commandObject: {
                commandString:"command-string",
                commandNumber:4,
                commandBoolean:true
            }, value: argu});
        GrandCentral.call({
            commandObject: {
                commandString:"command-string",
                commandNumber:5,
                commandBoolean:false
            }, value: argu});
        GrandCentral.call({
            commandObject: {
                commandString:"no-command",
                commandNumber:4,
                commandBoolean:true
            }, value: argu});
            
        //with array
        GrandCentral.call({
            commandObject: {
                commandString:"command-string-array",
                commandNumber:4,
                commandBoolean:false,
                commandArray:2
            }, value: argu
        });
        GrandCentral.call({
            commandObject: {
                commandString:"command-string-array",
                commandNumber:4,
                commandBoolean:false,
                commandArray:4
            }, value: argu
        });
        //with object
        GrandCentral.call({
            commandObject: {
                commandString:"command-string-object",
                commandNumber:4,
                commandBoolean:false,
                commandArray:2,
                commandObject:{
                    commandString: "commandString"
                }
            }, value: argu
        });
        GrandCentral.call({
            commandObject: {
                commandString:"command-string-object",
                commandNumber:4,
                commandBoolean:false,
                commandArray:2,
                commandObject:{
                    commandString: "no-command"
                }
            }, value: argu
        });
    });
    
    test("default Operator: Array", function() {
        expect(6);
        
        GrandCentral
            .listen({//without object & array
                commandArray: ["command-string", 4, false]
            }, function(e) {
                ok(true, "object-command without object & array is called");
                same(e, {
                    commandArray: "command-string", value: argu}, "json");
            })
            .listen({//with array
                commandArray: [10, 11, 22, [1, 2, 3]]
            }, function(e) {
                ok(true, "object-command with array is called");
                same(e, {
                    commandArray: [1, 2, 3], value: argu}, "json");
            })
            .listen({//with object
                commandArray: [{num:"nouser"},{commandString:"commandString"}]
            }, function(e) {
                ok(true, "object-command with object is called");
                same(e, {
                    commandArray: {commandString:"commandString"}, value: argu}, "json");
            });
        //withou array & object
        GrandCentral.call({
            commandArray: "command-string", value: argu
        });
        GrandCentral.call({
            commandArray: "no-command", value: argu
            });

        //with array
        GrandCentral.call({
            commandArray: [1,2,3], value: argu
        });
        GrandCentral.call({//no call
            commandArray: 2, value: argu
        });
        GrandCentral.call({//no call
            commandArray: [2, 1, 3], value: argu
        });
        //with object
        GrandCentral.call({
            commandArray: {commandString:"commandString"}, value: argu
        });
        GrandCentral.call({//no call
            commandArray: {commandStr:"commandString"}, value: argu
        });
        GrandCentral.call({//no call
            commandArray: {commandString:"commandStr"}, value: argu
        });
    });
    
    test("eq Operator: String", function() {
        expect(2);
        
        GrandCentral
            .listen({
                eqcommandString$eq:"string-command"
            }, function(e) {
                ok(true, "string-eqcommand is called");
                same(e, {eqcommandString:"string-command", value: argu}, "json");
            });
        
        GrandCentral.call({eqcommandString:"string-command", value: argu});
        GrandCentral.call({eqcommandString:"no-command", value: argu});
    });
    
    test("eq Operator: Number", function() {
        expect(2);
        
        GrandCentral
            .listen({
                eqcommandNumber$eq: 40
            }, function(e) {
                ok(true, "number-eqcommand is called");
                same(e, {eqcommandNumber:40, value: argu}, "json");
            });
        
        GrandCentral.call({eqcommandNumber:40, value: argu});
        GrandCentral.call({eqcommandNumber:20, value: argu});
    });
    
    test("eq Operator: Boolean", function() {
        expect(2);
        
        GrandCentral
            .listen({
                eqcommandBoolean$eq: true
            }, function(e) {
                ok(true, "boolean-eqcommand is called");
                same(e, {eqcommandBoolean:true, value: argu}, "json");
            });
        
        GrandCentral.call({eqcommandBoolean:true, value: argu});
        GrandCentral.call({eqcommandBoolean:false, value:argu});
    });
    
    test("eq Operator: Object", function() {
        expect(6);
        
        GrandCentral
            .listen({//without object & array
                eqcommandObject$eq: {
                    eqcommandString:"command-string",
                    eqcommandNumber:4,
                    eqcommandBoolean:false
                }
            }, function(e) {
                ok(true, "object-eqcommand is called");
                same(e, {
                    eqcommandObject: {
                        eqcommandString:"command-string",
                        eqcommandNumber:4,
                        eqcommandBoolean:false
                    }, value: argu}, "json");
            })
            .listen({//with array
                eqcommandObject$eq: {
                    eqcommandString$eq:"command-string-array",
                    eqcommandNumber$eq:4,
                    eqcommandBoolean:false,
                    eqcommandArray$eq:[1,2,3]
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    eqcommandObject: {
                        eqcommandString:"command-string-array",
                        eqcommandNumber:4,
                        eqcommandBoolean:false,
                        eqcommandArray:[1, 2, 3]
                    }, value: argu}, "json");
            })
            .listen({//with object
                eqcommandObject$eq: {
                    eqcommandString$eq:"command-string-object",
                    eqcommandNumber$eq:4,
                    eqcommandBoolean$eq:false,
                    eqcommandArray:[1,2,3],
                    eqcommandObject:{
                        commandString:"commandString"
                    }
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    eqcommandObject: {
                        eqcommandString:"command-string-object",
                        eqcommandNumber:4,
                        eqcommandBoolean:false,
                        eqcommandArray:2,
                        eqcommandObject:{
                            commandString:"commandString"
                        }
                    }, value: argu}, "json");
            });
        //withou array & object
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string",
                eqcommandNumber:4,
                eqcommandBoolean:false
            }, value: argu});
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string",
                eqcommandNumber:4,
                eqcommandBoolean:true
            }, value: argu});
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string",
                eqcommandNumber:5,
                eqcommandBoolean:false
            }, value: argu});
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"no-command",
                eqcommandNumber:4,
                eqcommandBoolean:true
            }, value: argu});
            
        //with array
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string-array",
                eqcommandNumber:4,
                eqcommandBoolean:false,
                eqcommandArray:[1, 2, 3]
            }, value: argu
        });
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string-array",
                eqcommandNumber:4,
                eqcommandBoolean:false,
                eqcommandArray:2
            }, value: argu
        });
        //with object
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string-object",
                eqcommandNumber:4,
                eqcommandBoolean:false,
                eqcommandArray:2,
                eqcommandObject:{
                    commandString: "commandString"
                }
            }, value: argu
        });
        GrandCentral.call({
            eqcommandObject: {
                eqcommandString:"command-string-object",
                eqcommandNumber:4,
                eqcommandBoolean:false,
                eqcommandArray:2,
                eqcommandObject:{
                    commandString: "no-command"
                }
            }, value: argu
        });
    });
    
    test("eq Operator: Array", function() {
        expect(6);
        
        GrandCentral
            .listen({//without object & array
                eqcommandArray$eq: ["command-string", 4, false]
            }, function(e) {
                ok(true, "array-command without object & array is called");
                same(e, {
                    eqcommandArray: ["command-string", 4, false], value: argu}, "json");
            })
            .listen({//with array
                eqcommandArray$eq: [10, 11, 22, [1, 2, 3]]
            }, function(e) {
                ok(true, "array-command with array is called");
                same(e, {
                    eqcommandArray: [10, 11, 22, [1, 2, 3]], value: argu}, "json");
            })
            .listen({//with object
                eqcommandArray$eq: [{num:"nouser"},{commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-command with object is called");
                same(e, {
                    eqcommandArray: [{num:"nouser"},{commandString:"commandString"}], value: argu}, "json");
            });
        //withou array & object
        GrandCentral.call({
            eqcommandArray: ["command-string", 4, false], value: argu});
        GrandCentral.call({
            eqcommandArray: "command-string", value: argu});
        GrandCentral.call({
            eqcommandArray: ["command-string", false, 4], value: argu});

        //with array
        GrandCentral.call({
            eqcommandArray: [10, 11, 22, [1, 2, 3]], value: argu
        });
        GrandCentral.call({//no call
            eqcommandArray: 2, value: argu
        });
        GrandCentral.call({//no call
            eqcommandArray: [11, 10, 22, [1, 2, 3]], value: argu
        });
        GrandCentral.call({//no call
            eqcommandArray: [11, 10, 22, [2, 1, 3]], value: argu
        });
        //with object*/
        GrandCentral.call({
            eqcommandArray: [{num:"nouser"},{commandString:"commandString"}], value: argu
        });
        GrandCentral.call({//no call
            eqcommandArray: {commandString:"commandString"}, value: argu
        });
        GrandCentral.call({//no call
            eqcommandArray: [{commandString:"commandString"}, {num:"nouser"}], value: argu
        });
    });
    
    test("ne Operator: String", function() {
        expect(2);
        
        GrandCentral
            .listen({
                necommandString$ne:"string-command"
            }, function(e) {
                ok(true, "string-necommand is called");
                same(e, {necommandString:"no-command", value: argu}, "json");
            });
        
        GrandCentral.call({necommandString:"string-command", value: argu});
        GrandCentral.call({necommandString:"no-command", value: argu});
    });
    
    test("ne Operator: Number", function() {
        expect(2);
        
        GrandCentral
            .listen({
                necommandNumber$ne: 40
            }, function(e) {
                ok(true, "number-necommand is called");
                same(e, {necommandNumber:20, value: argu}, "json");
            });
        
        GrandCentral.call({necommandNumber:40, value: argu});
        GrandCentral.call({necommandNumber:20, value: argu});
    });
    
    test("ne Operator: Boolean", function() {
        expect(2);
        
        GrandCentral
            .listen({
                necommandBoolean$ne: true
            }, function(e) {
                ok(true, "boolean-necommand is called");
                same(e, {necommandBoolean:false, value: argu}, "json");
            });
        
        GrandCentral.call({necommandBoolean:true, value: argu});
        GrandCentral.call({necommandBoolean:false, value:argu});
    });
    
    test("ne Operator: Object", function() {
        expect(2);
        
        GrandCentral
            .listen({//with object & array
                necommandObject$ne: {
                    necommandString:"command-string-object",
                    necommandNumber:4,
                    necommandBoolean:false,
                    necommandArray:[1,2,3],
                    necommandObject:{
                        commandString:"commandString"
                    }
                }
            }, function(e) {
                ok(true, "object-command is called");
                same(e, {
                    necommandObject: {
                        necommandString:"command-string-object",
                        necommandNumber:4,
                        necommandBoolean:false,
                        necommandArray:2,
                        necommandObject:{
                            commandString:"no-command"
                        }
                    }, value: argu}, "json");
            });
        
        GrandCentral.call({
            necommandObject: {
                necommandString:"command-string-object",
                necommandNumber:4,
                necommandBoolean:false,
                necommandArray:2,
                necommandObject:{
                    commandString: "commandString"
                }
            }, value: argu
        });
        GrandCentral.call({
            necommandObject: {
                necommandString:"command-string-object",
                necommandNumber:4,
                necommandBoolean:false,
                necommandArray:2,
                necommandObject:{
                    commandString: "no-command"
                }
            }, value: argu
        });
    });
    
    test("ne Operator: Array", function() {
        expect(2);
        
        GrandCentral
            .listen({//with object
                necommandArray$ne: [[1, 3, 2], "noequal", {num:"nouser"},{commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-command with object is called");
                same(e, {
                    necommandArray: [{commandString:"commandString"}, {num:"nouser"}], value: argu}, "json");
            });
        //with array & object
        GrandCentral.call({
            necommandArray: [[1, 3, 2], "noequal", {num:"nouser"},{commandString:"commandString"}], value: argu});
        
        GrandCentral.call({
            necommandArray: [{commandString:"commandString"}, {num:"nouser"}], value: argu
        });
    });
    
    test("lt Operator", function() {
        expect(2);
        
        GrandCentral
            .listen({
                ltcommandNumber$lt: 0
            }, function(e) {
                ok(true, "number-ltcommand is called");
                same(e, {ltcommandNumber:-20, value: argu}, "json");
            });
        
        GrandCentral.call({ltcommandNumber:0, value: argu});
        GrandCentral.call({ltcommandNumber:-20, value: argu});
        GrandCentral.call({ltcommandNumber:50, value: argu});
    });
    
    test("lte Operator", function() {
        expect(4);
        
        GrandCentral
            .listen({
                ltecommandNumber$lte: 0
            }, function(e) {
                ok(true, "number-ltecommand is called");
                ok(e.ltecommandNumber <= 0, "json");
            });
        
        GrandCentral.call({ltecommandNumber:0, value: argu});
        GrandCentral.call({ltecommandNumber:-20, value: argu});
        GrandCentral.call({ltecommandNumber:50, value: argu});
    });
    
    test("gt Operator", function() {
        expect(2);
        
        GrandCentral
            .listen({
                gtcommandNumber$gt: 0
            }, function(e) {
                ok(true, "number-gtcommand is called");
                same(e, {gtcommandNumber:50, value: argu}, "json");
            });
        
        GrandCentral.call({gtcommandNumber:0, value: argu});
        GrandCentral.call({gtcommandNumber:-20, value: argu});
        GrandCentral.call({gtcommandNumber:50, value: argu});
    });
    
    test("gte Operator", function() {
        expect(4);
        
        GrandCentral
            .listen({
                gtecommandNumber$gte: 0
            }, function(e) {
                ok(true, "number-gtecommand is called");
                ok(e.gtecommandNumber >= 0, "json");
            });
        
        GrandCentral.call({gtecommandNumber:0, value: argu});
        GrandCentral.call({gtecommandNumber:-20, value: argu});
        GrandCentral.call({gtecommandNumber:50, value: argu});
    });
    
    test("in Operator", function() {
        expect(6);
        
        GrandCentral
            .listen({//without object & array
                incommandArray$in: ["command-string", 4, false]
            }, function(e) {
                ok(true, "array-command without object & array is called");
                same(e, {
                    incommandArray: "command-string", value: argu}, "json");
            })
            .listen({//with array
                incommandArray$in: [10, 11, 22, [1, 2, 3]]
            }, function(e) {
                ok(true, "array-command with array is called");
                same(e, {
                    incommandArray: [1, 2, 3], value: argu}, "json");
            })
            .listen({//with object
                incommandArray$in: [{num:"nouser"},{commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-command with object is called");
                same(e, {
                    incommandArray: {commandString:"commandString"}, value: argu}, "json");
            });
        //without array & object
        GrandCentral.call({
            incommandArray: ["command-string", 4, false], value: argu});
        GrandCentral.call({
            incommandArray: "command-string", value: argu});

        //with array
        GrandCentral.call({
            incommandArray: [1, 2, 3], value: argu
        });
        GrandCentral.call({//no call
            incommandArray: 2, value: argu
        });
        GrandCentral.call({//no call
            incommandArray: [10, 11, 22, [1, 2, 3]], value: argu
        });
        //with object
        GrandCentral.call({
            incommandArray: {commandString:"commandString"}, value: argu
        });
        GrandCentral.call({//no call
            incommandArray: [{num:"nouser"}, {commandString:"commandString"}], value: argu
        });
    });
    
    test("nin Operator", function() {
        expect(2);
        
        GrandCentral
            .listen({
                nincommandArray$nin: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-nin-command with array is called");
                same(e, {
                    nincommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu}, "json");
            });
        GrandCentral.call({
            nincommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu});
        GrandCentral.call({
            nincommandArray: "command-string", value: argu});
        GrandCentral.call({
            nincommandArray: 4, value: argu});
        GrandCentral.call({
            nincommandArray: false, value: argu});
        GrandCentral.call({
            nincommandArray: [1, 2, 3], value: argu
        });
        GrandCentral.call({
            nincommandArray: {commandString:"commandString"}, value: argu
        });
    });
    
    test("all Operator", function() {
        expect(4);
        
        GrandCentral
            .listen({
                allcommandArray$all: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-all-command with array is called");
                same(e, {
                    allcommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu}, "json");
            })
            .listen({
                allcommandArray$all: ["command-string", 4, false, {commandString:"commandString"}]
            }, function(e) {
                ok(true, "array-all-command with array is called");
                same(e, {
                    allcommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu}, "json");
            });
        GrandCentral.call({
            allcommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu});
        GrandCentral.call({
            allcommandArray: ["command-string", 4, [1, 2, 3], {commandString:"commandString"}], value: argu});
    });
    
    test("ex Operator", function() {
        expect(2);
        
        GrandCentral
            .listen({
                existscommand$ex: true,
                noexistscommand$ex: false
            }, function(e) {
                ok(true, "exists-command is called");
                same(e, {
                    existscommand: "command", value: argu}, "json");
            });
        GrandCentral.call({
            existscommand: "command", value: argu});
        GrandCentral.call({
            existscommandArray: ["command-string", 4, false, [1, 2, 3], {commandString:"commandString"}], value: argu});
        GrandCentral.call({
            existscommand: "command", 
            noexistscommand: "no-existcommand",value: argu});
    });
    
    module("Operators");
    
    test("default operator", function() {
        expect(4);
        
        ok(GrandCentral.Operators[""](
            { test: "test string" },
            { test: "test string", value: argument }),
            "eq selected for non-Array");
        
        ok(GrandCentral.Operators[""](
            { test: [0, 1, 2] },
            { test: 1, value: argument }),
            "in selected for Array");
        
        ok(GrandCentral.Operators[""](
            { test: /^X.*/ },
            { test: "X-11", value: argument }),
            "in selected for RegExp");
        
        ok(GrandCentral.Operators[""](
            { test: function() { return true; } },
            { test: "anything", value: argument }),
            "in selected for Function");
    });
    
    test("eq operator", function() {
        expect(10);
        
        ok(GrandCentral.Operators[""](
            { test$eq: "test string" },
            { test: "test string", value: argument }),
            "passed string test");
        ok(!GrandCentral.Operators[""](
            { test$eq: "test string" },
            { test: "not test string", value: argument }),
            "passed string test");
        ok(GrandCentral.Operators[""](
            { test$eq: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$eq: 42 },
            { test: 24, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$eq: true },
            { test: true, value: argument }),
            "passed boolean test");
        ok(!GrandCentral.Operators[""](
            { test$eq: true },
            { test: false, value: argument }),
            "passed boolean test");
        ok(GrandCentral.Operators[""](
            { test$eq: ["test string", 42, true] },
            { test: ["test string", 42, true], value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$eq: ["test string", 42, false] },
            { test: ["test string", 42, true], value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$eq: { test$eq: ["test string", 42, true] } },
            { test: { test: ["test string", 42, true] }, value: argument }),
            "passed object test");
        ok(!GrandCentral.Operators[""](
            { test$eq: { test$eq: ["test string", 42, false] } },
            { test: { test: ["test string", 42, true] }, value: argument }),
            "passed object test");
    });
    
    test("ne operator", function() {
        expect(10);
        
        ok(!GrandCentral.Operators[""](
            { test$ne: "test string" },
            { test: "test string", value: argument }),
            "passed string test");
        ok(GrandCentral.Operators[""](
            { test$ne: "test string" },
            { test: "not test string", value: argument }),
            "passed string test");
        ok(!GrandCentral.Operators[""](
            { test$ne: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$ne: 42 },
            { test: 24, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$ne: true },
            { test: true, value: argument }),
            "passed boolean test");
        ok(GrandCentral.Operators[""](
            { test$ne: true },
            { test: false, value: argument }),
            "passed boolean test");
        ok(!GrandCentral.Operators[""](
            { test$ne: ["test string", 42, true] },
            { test: ["test string", 42, true], value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$ne: ["test string", 42, false] },
            { test: ["test string", 42, true], value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$eq: { test$ne: ["test string", 42, true] } },
            { test: { test: ["test string", 42, true] }, value: argument }),
            "passed object test");
        ok(GrandCentral.Operators[""](
            { test$eq: { test$ne: ["test string", 42, false] } },
            { test: { test: ["test string", 42, true] }, value: argument }),
            "passed object test");
    });
    
    test("lt operator", function() {
        expect(3);
        
        ok(GrandCentral.Operators[""](
            { test$lt: 42 },
            { test: 9.999, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$lt: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$lt: 42 },
            { test: 99.99, value: argument }),
            "passed number test");
    });
    
    test("lte operator", function() {
        expect(3);
        
        ok(GrandCentral.Operators[""](
            { test$lte: 42 },
            { test: 9.999, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$lte: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$lte: 42 },
            { test: 99.99, value: argument }),
            "passed number test");
    });
    
    test("gt operator", function() {
        expect(3);
        
        ok(!GrandCentral.Operators[""](
            { test$gt: 42 },
            { test: 9.999, value: argument }),
            "passed number test");
        ok(!GrandCentral.Operators[""](
            { test$gt: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$gt: 42 },
            { test: 99.99, value: argument }),
            "passed number test");
    });
    
    test("gte operator", function() {
        expect(3);
        
        ok(!GrandCentral.Operators[""](
            { test$gte: 42 },
            { test: 9.999, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$gte: 42 },
            { test: 42, value: argument }),
            "passed number test");
        ok(GrandCentral.Operators[""](
            { test$gte: 42 },
            { test: 99.99, value: argument }),
            "passed number test");
    });
    
    test("in operator", function() {
        expect(4);
        
        ok(GrandCentral.Operators[""](
            { test$in: ["test string", 42, true] },
            { test: "test string", value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$in: ["test string", 42, true] },
            { test: 42, value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$in: ["test string", 42, true] },
            { test: true, value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$in: ["test string", 42, true] },
            { test: false, value: argument }),
            "passed array test");
    });
    
    test("nin operator", function() {
        expect(4);
        
        ok(!GrandCentral.Operators[""](
            { test$nin: ["test string", 42, true] },
            { test: "test string", value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$nin: ["test string", 42, true] },
            { test: 42, value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$nin: ["test string", 42, true] },
            { test: true, value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$nin: ["test string", 42, true] },
            { test: false, value: argument }),
            "passed array test");
    });
    
    test("all operator", function() {
        expect(6);
        
        ok(GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: ["test string", 42, true], value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: [true, 42, "test string"], value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: [42, true, "test string"], value: argument }),
            "passed array test");
        ok(GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: [false, true, "test string", 42], value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: ["test string", 42, false], value: argument }),
            "passed array test");
        ok(!GrandCentral.Operators[""](
            { test$all: ["test string", 42, true] },
            { test: [42, "not test string", true], value: argument }),
            "passed array test");
    });
    
    test("ex operator", function() {
        expect(8);
        
        ok(GrandCentral.Operators[""](
            { test$ex: true },
            { test: "test string", value: argument }),
            "passed test");
        ok(GrandCentral.Operators[""](
            { test$ex: true },
            { test: null, value: argument }),
            "passed test");
        ok(GrandCentral.Operators[""](
            { test$ex: true },
            { test: undefined, value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ex: true },
            { value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ex: false },
            { test: "test string", value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ex: false },
            { test: null, value: argument }),
            "passed test");
        ok(!GrandCentral.Operators[""](
            { test$ex: false },
            { test: undefined, value: argument }),
            "passed test");
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

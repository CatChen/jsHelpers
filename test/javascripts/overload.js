function testOverload() {
     module("Overload.Function");

    test("overload existence", function() {
        expect(3);
        
        ok(Overload.create, "Overload.create exists");
        
        var overloaded = Overload.create();
        ok(overloaded.add, "overloaded.add exists");
        ok(overloaded.select, "overloaded.select exists");
    });
    
    module("types_is_string");
    test("overload support for no argument", function() {
        expect(2);
        
        var testValue = "-- this is the return value --";
        var stringValue = "-- string value --";
        
        var overloaded = Overload
            .add("", function() { return testValue })
            .add("String", function(x){return stringValue});
        
        equals(overloaded(), testValue, "without argument");
        equals(overloaded("aaa"), stringValue, "string argument");
    });
    
    test("overload support for one argument", function() {
        expect(7);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("Number", function(x) { return numberValue });
        overloaded
            .add("String", function(x){return stringValue});
        overloaded
            .add("Boolean", function(x){return booleanValue})
            .add("Array", function(x){return arrayValue})
            .add("Function", function(x){return functionValue();})
            .add("Object", function(x){return objectString;})
            .add("Date", function(x){return dateValue.getDay();});
        
        equals(overloaded(numberValue), numberValue, "number argument");
        equals(overloaded(stringValue), stringValue, "string argument");
        equals(overloaded(booleanValue), booleanValue, "boolean argument");
        equals(overloaded(arrayValue), arrayValue, "array argument");
        equals(overloaded(functionValue), functionValue(), "function argument");
        equals(overloaded(objectValue), objectString, "object argument");
        equals(overloaded(dateValue), dateValue.getDay(), "date argument");
    });
    
    test("overload support for more argument with same type", function() {
        expect(7);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue =  {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("Number, Number, Number", function(x, y, z) { return numberValue });
        overloaded
            .add("String, String", function(x, y){return stringValue});
        overloaded
            .add("Boolean, Boolean, Boolean, Boolean", function(x, y, z, m){return booleanValue})
            .add("Array, Array, Array", function(x, y, z){return arrayValue})
            .add("Function, Function", function(x, y){return functionValue();})
            .add("Object", function(x){return objectString;})
            .add("Date, Date, Date", function(x, y, z){return dateValue.getDay();});
        
        equals(overloaded(numberValue, numberValue, numberValue), numberValue, "number argument");
        equals(overloaded(stringValue, stringValue), stringValue, "string argument");
        equals(overloaded(booleanValue, booleanValue, booleanValue, booleanValue), booleanValue, "boolean argument");
        equals(overloaded(arrayValue, arrayValue, arrayValue), arrayValue, "array argument");
        equals(overloaded(functionValue, functionValue), functionValue(), "function argument");
        equals(overloaded(objectValue), objectString, "object argument");
        equals(overloaded(dateValue, dateValue, dateValue), dateValue.getDay(), "date argument");
    });
    
    test("overload support for more argument with different type", function() {
        expect(5);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("Number, String, Boolean, Array, Function, Object, Date", function(a, b, c, d, e, f, g) { return numberValue })
            .add("Boolean, Number, String, Array, Function, Object, Date", function(a, b, c, d, e, f, g){return stringValue})
            .add("Number, Boolean, String, Array, Function, Object, Date", function(a, b, c, d, e, f, g){return booleanValue})
            .add("Number, String, Boolean, Array, Function, Object", function(a, b, c, d, e, f){return arrayValue})
            .add("Number, String, Boolean, Array, Function", function(a, b, c, d){return functionValue();});
        
        equals(overloaded(booleanValue, numberValue, stringValue, arrayValue, functionValue, objectValue, dateValue), 
            stringValue, "boolean argument if first");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue, objectValue, dateValue), 
            numberValue, "seven arguments");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue), 
            functionValue(), "without date & object argument");
        equals(overloaded(numberValue, booleanValue, stringValue, arrayValue, functionValue, objectValue, dateValue), 
            booleanValue, "boolean string argument changed");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue, objectValue), 
            arrayValue, "without date argument");
        
    });
    
    test("overload support for different argument counts", function() {
        expect(2);
        
        var sum = Overload
            .add("Number, Number",
                function(x, y) { return x + y; })
            .add("Number, Number, Number",
                function(x, y, z) { return x + y + z; });
        
        equals(sum(1, 2), 3, "sum(1, 2)");
        equals(sum(1, 2, 3), 6, "sum(1, 2, 3)");
    });
    
    test("overload support for different argument types", function() {
        expect(2);
        
        var list = Overload
            .add("Array",
                function(o) { return o.join(', '); })
            .add("Object",
                function(o) {
                    var array = [];
                    for (var key in o) {
                        array.push(o[key]);
                    }
                    return list(array);
                });
        
        equals(list([1, 2, 3]), "1, 2, 3", "list([1, 2, 3])");
        equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
    });
    
    test("overload support for *, one argument", function() {
        expect(7);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("*", function(x) { return numberValue });
        
        equals(overloaded(numberValue), numberValue, "number argument");
        equals(overloaded(stringValue), numberValue, "string argument");
        equals(overloaded(booleanValue), numberValue, "boolean argument");
        equals(overloaded(arrayValue), numberValue, "array argument");
        equals(overloaded(functionValue), numberValue, "function argument");
        equals(overloaded(objectValue), numberValue, "object argument");
        equals(overloaded(dateValue), numberValue, "date argument");
    });
    
    test("overload support for *, more argument", function() {
        expect(21);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue =  {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("*, Number", function(a, b) { return numberValue })
            .add("Number, String, *", function(a, b, c) { return stringValue })
            .add("Number, *, String, Boolean", function(a, b, c) { return booleanValue });
        
        equals(overloaded(numberValue, numberValue), numberValue, "* is first argument, Number");
        equals(overloaded(stringValue, numberValue), numberValue, "* is first argument, String");
        equals(overloaded(booleanValue, numberValue), numberValue, "* is first argument, Boolean");
        equals(overloaded(arrayValue, numberValue), numberValue, "* is first argument, Array");
        equals(overloaded(functionValue, numberValue), numberValue, "* is first argument, Function");
        equals(overloaded(objectValue, numberValue), numberValue, "* is first argument, Object");
        equals(overloaded(dateValue, numberValue), numberValue, "* is first argument, Date");
        
        equals(overloaded(numberValue, stringValue, numberValue), stringValue, "* is last argument, Number");
        equals(overloaded(numberValue, stringValue, stringValue), stringValue, "* is last argument, String");
        equals(overloaded(numberValue, stringValue, booleanValue), stringValue, "* is last argument, Boolean");
        equals(overloaded(numberValue, stringValue, arrayValue), stringValue, "* is last argument, Array");
        equals(overloaded(numberValue, stringValue, functionValue), stringValue, "* is last argument, Function");
        equals(overloaded(numberValue, stringValue, objectValue), stringValue, "* is last argument, Object");
        equals(overloaded(numberValue, stringValue, dateValue), stringValue, "* is last argument, Date");
        
        equals(overloaded(numberValue, numberValue, stringValue, booleanValue), booleanValue, "* is middle argument, Number");
        equals(overloaded(numberValue, stringValue, stringValue, booleanValue), booleanValue, "* is middle argument, String");
        equals(overloaded(numberValue, booleanValue, stringValue, booleanValue), booleanValue, "* is middle argument, Boolean");
        equals(overloaded(numberValue, arrayValue, stringValue, booleanValue), booleanValue, "* is middle argument, Array");
        equals(overloaded(numberValue, functionValue, stringValue, booleanValue), booleanValue, "* is middle argument, Function");
        equals(overloaded(numberValue, objectValue, stringValue, booleanValue), booleanValue, "* is middle argument, Object");
        equals(overloaded(numberValue, dateValue, stringValue, booleanValue), booleanValue, "* is middle argument, Date");
    });
    
    test("overload support for argument of any type and special type", function() {
        expect(6);
        
        var list = Overload
            .add("Array",
                function(o) { return o.join(', '); })
            .add("*",
                function(o) {
                    var array = [];
                    for (var key in o) {
                        array.push(o[key]);
                    }
                    return list(array);
                })
            .add("Array, *", function(a, b) { return a.join(', ')+", "+b; })
            .add("Array, Number",function(a,b){return a.join(', ')+", "+b;})
            .add("Number, *, String", function(a, b, c) { return a+", "+b+c; })
            .add("Number, Boolean, String",function(a, b, c){return a+", "+b+c;});
        
        equals(list([1, 2, 3]), "1, 2, 3", "list([1, 2, 3])");
        equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
        equals(list([2, 4], "abc"), "2, 4, abc", "list([2, 4], 'abc')");
        equals(list([2, 4], 6), "2, 4, 6", "list([2, 4], 6)");
        equals(list(2, 4, "cde"), "2, 4cde", "list(2, 4, 'cde')");
        equals(list(2, true, "cde"), "2, truecde", "list(2, true, 'cde')");
    });
    
    test("overload support for only ...", function() {
        expect(9);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("...", function(x) { return numberValue });
        
        equals(overloaded(), numberValue, "without argument");
        equals(overloaded(numberValue), numberValue, "one argument, number argument");
        equals(overloaded(stringValue), numberValue, "one argument, string argument");
        equals(overloaded(booleanValue), numberValue, "one argument, boolean argument");
        equals(overloaded(arrayValue), numberValue, "one argument, array argument");
        equals(overloaded(functionValue), numberValue, "one argument, function argument");
        equals(overloaded(objectValue), numberValue, "one argument, object argument");
        equals(overloaded(dateValue), numberValue, "one argument, date argument");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue, objectValue, dateValue), 
            numberValue, "more argument, every javascript types");
    });

    test("overload support for ... with more argument", function() {
        expect(3);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add("Number, String, ...", function(x, y, z) { return stringValue });
        
        equals(overloaded(numberValue, stringValue), stringValue, "n+0 argument");
        equals(overloaded(numberValue, stringValue, booleanValue), stringValue, "n+1 argument");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue, objectValue, dateValue), 
            stringValue, "n+n argument, every javascript types");
    });
    
    test("overload support for ... with different length", function() {
        expect(5);
        
        var numberValueOne = 11;
        var numberValueTwo = 12;
        var numberValueThree = 13;
        var numberValueFour = 14;
        var booleanValue = false;
        
        var overloaded = Overload
            .add("Number, Number, Number", function(x, y, z) { return numberValueOne })
            .add("Number, Number, ...", function(){return numberValueTwo})
            .add("Number, ...", function(){return numberValueThree})
            .add("...", function(){return numberValueFour});
            
        
        equals(overloaded(numberValueOne, numberValueTwo, numberValueThree, numberValueFour), 
            numberValueTwo, "four arguments, matching function two");
        equals(overloaded(numberValueOne, numberValueTwo, numberValueThree), 
            numberValueOne, "three arguments, matching function one");
        equals(overloaded(numberValueOne, numberValueTwo), numberValueTwo, "two arguments, matching function two");
        equals(overloaded(numberValueOne), numberValueThree, "one arguments, matching function three");
        equals(overloaded(booleanValue, numberValueOne), numberValueFour, "first argument not matching function one,two,three");
    });
    
    test("overload support for * and ... together", function() {
        expect(3);
        
        var join = Overload
            .add("*",
                function(x) { return [x]; })
            .add("*, *",
                function(x, y) { return [x, y]; })
            .add("*, *, ...", 
                function() {
                    var result = [];
                    for (var i = 0; i < arguments.length; i++) {
                        result.push(arguments[i]);
                    }
                    return result;
                });
        
        same(join(new Object()), [new Object()], 'join(new Object())');
        same(join("hello", "world"), ["hello", "world"], 'join("hello", "world")');
        same(join(1, 2, 3), [1, 2, 3], "join(1, 2, 3)");
    });
    
    module("type_is_array");
    test("overload support for no argument", function() {
        expect(2);
        
        var testValue = "-- this is the return value --";
        var stringValue = "-- string value --";
        
        var overloaded = Overload
            .add([], function() { return testValue })
            .add([String], function(x){return stringValue});
        
        equals(overloaded(), testValue, "without argument");
        equals(overloaded("aaa"), stringValue, "string argument");
    });
    
    test("overload support for one argument", function() {
        expect(8);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var overloadedcc = Overload
            .add([Number], function(x) { return numberValue });
        overloadedcc
            .add([String], function(x){return stringValue});
        overloadedcc
            .add([Boolean], function(x){return booleanValue})
            .add([Array], function(x){return arrayValue})
            .add([Function], function(x){return functionValue();})
            .add([Object], function(x){return objectString;})
            .add([Date], function(x){return dateValue.getDay();})
            .add([ClassA], function(x){return (new ClassA()).getName();});
        
        equals(overloadedcc(numberValue), numberValue, "number argument");
        equals(overloadedcc(stringValue), stringValue, "string argument");
        equals(overloadedcc(booleanValue), booleanValue, "boolean argument");
        equals(overloadedcc(arrayValue), arrayValue, "array argument");
        equals(overloadedcc(functionValue), functionValue(), "function argument");
        equals(overloadedcc(objectValue), objectString, "object argument");
        equals(overloadedcc(dateValue), dateValue.getDay(), "date argument");
        equals(overloadedcc(new ClassA()), (new ClassA()).getName(), "ClassA argument");
    });
        
    test("overload support for more argument with same type", function() {
        expect(8);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue =  {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var overloaded = Overload
            .add([Number, Number, Number], function(x, y, z) { return numberValue });
        overloaded
            .add([String, String], function(x, y){return stringValue});
        overloaded
            .add([Boolean, Boolean, Boolean, Boolean], function(x, y, z, m){return booleanValue})
            .add([Array, Array, Array], function(x, y, z){return arrayValue})
            .add([Function, Function], function(x, y){return functionValue();})
            .add([Object], function(x){return objectString;})
            .add([Date, Date, Date], function(x, y, z){return dateValue.getDay();})
            .add([ClassA, ClassA, ClassA], function(x, y, z){return (new ClassA()).getName();});
        
        equals(overloaded(numberValue, numberValue, numberValue), numberValue, "number argument");
        equals(overloaded(stringValue, stringValue), stringValue, "string argument");
        equals(overloaded(booleanValue, booleanValue, booleanValue, booleanValue), booleanValue, "boolean argument");
        equals(overloaded(arrayValue, arrayValue, arrayValue), arrayValue, "array argument");
        equals(overloaded(functionValue, functionValue), functionValue(), "function argument");
        equals(overloaded(objectValue), objectString, "object argument");
        equals(overloaded(dateValue, dateValue, dateValue), dateValue.getDay(), "date argument");
        equals(overloaded(new ClassA(), new ClassA(), new ClassA()), (new ClassA()).getName(), "ClassA argument");
    });

    test("overload support for more argument with different type", function() {
        expect(5);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var overloaded = Overload
            .add([Number, ClassA, String, Boolean, Array, Function, Object, Date], function(a, b, c, d, e, f, g) { return numberValue })
            .add([ClassA, Boolean, Number, String, Array, Function, Object, Date], function(a, b, c, d, e, f, g){return stringValue})
            .add([Number, Boolean, String, Array, Function, Object, Date, ClassA], function(a, b, c, d, e, f, g){return booleanValue})
            .add([Number, ClassA, String, Boolean, Array, Function, Object], function(a, b, c, d, e, f){return arrayValue})
            .add([Number, ClassA, String, Boolean, Array, Function], function(a, b, c, d, e){return functionValue();});
        
        equals(overloaded(new ClassA(), booleanValue, numberValue, stringValue, arrayValue, functionValue, objectValue, dateValue), 
            stringValue, "boolean argument if first");
        equals(overloaded(numberValue, new ClassA(), stringValue, booleanValue, arrayValue, functionValue, objectValue, dateValue), 
            numberValue, "seven arguments");
        equals(overloaded(numberValue, new ClassA(), stringValue, booleanValue, arrayValue, functionValue), 
            functionValue(), "without date & object argument");
        equals(overloaded(numberValue, booleanValue, stringValue, arrayValue, functionValue, objectValue, dateValue, new ClassA()), 
            booleanValue, "boolean string argument changed");
        equals(overloaded(numberValue, new ClassA(), stringValue, booleanValue, arrayValue, functionValue, objectValue), 
            arrayValue, "without date argument");
    });
    
    test("overload support for different argument counts", function() {
        expect(2);
        function ClassA(){this.name = 10};
        ClassA.prototype.getName = function(){return this.name};
        
        var sum = Overload
            .add([ClassA, Number],
                function(x, y) { return x.getName() + y; })
            .add([Number, ClassA, Number],
                function(x, y, z) { return x + y.getName() + z; });
        
        equals(sum(new ClassA(), 2), 12, "sum(10, 2)");
        equals(sum(1, new ClassA(), 3), 14, "sum(1, 10, 3)");
    });
    
    test("overload support for different argument types", function() {
        expect(2);
        function ClassA(){this.name = 10};
        ClassA.prototype.getName = function(){return this.name};
        
        var list = Overload
            .add([Array],
                function(o) { return o.join(', '); })
            .add([ClassA],
                function(o) { return o.getName() })
            .add([Object],
                function(o) {
                    var array = [];
                    for (var key in o) {
                        array.push(o[key]);
                    }
                    return list(array);
                });
        
        equals(list(new ClassA()), 10, "classA.getName");
        equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
    });
    
    test("overload support for Overload.Any, one argument", function() {
        expect(8);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        function ClassA(){this.name = 10};
        ClassA.prototype.getName = function(){return this.name};
        
        var overloaded = Overload
            .add([Overload.Any], function(x) { return numberValue });
        
        equals(overloaded(numberValue), numberValue, "number argument");
        equals(overloaded(stringValue), numberValue, "string argument");
        equals(overloaded(booleanValue), numberValue, "boolean argument");
        equals(overloaded(arrayValue), numberValue, "array argument");
        equals(overloaded(functionValue), numberValue, "function argument");
        equals(overloaded(objectValue), numberValue, "object argument");
        equals(overloaded(dateValue), numberValue, "date argument");
        equals(overloaded(new ClassA()), numberValue, "classA argument");
    });
    
    test("overload support for Overload.Any, more argument", function() {
        expect(24);
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue =  {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        function ClassA(){this.name = 10};
        ClassA.prototype.getName = function(){return this.name};
        
        var overloaded = Overload
            .add([Overload.Any, Number], function(a, b) { return numberValue })
            .add([Number, String, Overload.Any], function(a, b, c) { return stringValue })
            .add([Number, Overload.Any, String, Boolean], function(a, b, c) { return booleanValue });
        
        equals(overloaded(numberValue, numberValue), numberValue, "* is first argument, Number");
        equals(overloaded(stringValue, numberValue), numberValue, "* is first argument, String");
        equals(overloaded(booleanValue, numberValue), numberValue, "* is first argument, Boolean");
        equals(overloaded(arrayValue, numberValue), numberValue, "* is first argument, Array");
        equals(overloaded(functionValue, numberValue), numberValue, "* is first argument, Function");
        equals(overloaded(objectValue, numberValue), numberValue, "* is first argument, Object");
        equals(overloaded(dateValue, numberValue), numberValue, "* is first argument, Date");
        equals(overloaded(new ClassA(), numberValue), numberValue, "* is first argument, ClassA");
        
        equals(overloaded(numberValue, stringValue, numberValue), stringValue, "* is last argument, Number");
        equals(overloaded(numberValue, stringValue, stringValue), stringValue, "* is last argument, String");
        equals(overloaded(numberValue, stringValue, booleanValue), stringValue, "* is last argument, Boolean");
        equals(overloaded(numberValue, stringValue, arrayValue), stringValue, "* is last argument, Array");
        equals(overloaded(numberValue, stringValue, functionValue), stringValue, "* is last argument, Function");
        equals(overloaded(numberValue, stringValue, objectValue), stringValue, "* is last argument, Object");
        equals(overloaded(numberValue, stringValue, dateValue), stringValue, "* is last argument, Date");
        equals(overloaded(numberValue, stringValue, new ClassA()), stringValue, "* is last argument, ClassA");
        
        equals(overloaded(numberValue, numberValue, stringValue, booleanValue), booleanValue, "* is middle argument, Number");
        equals(overloaded(numberValue, stringValue, stringValue, booleanValue), booleanValue, "* is middle argument, String");
        equals(overloaded(numberValue, booleanValue, stringValue, booleanValue), booleanValue, "* is middle argument, Boolean");
        equals(overloaded(numberValue, arrayValue, stringValue, booleanValue), booleanValue, "* is middle argument, Array");
        equals(overloaded(numberValue, functionValue, stringValue, booleanValue), booleanValue, "* is middle argument, Function");
        equals(overloaded(numberValue, objectValue, stringValue, booleanValue), booleanValue, "* is middle argument, Object");
        equals(overloaded(numberValue, dateValue, stringValue, booleanValue), booleanValue, "* is middle argument, Date");
        equals(overloaded(numberValue, new ClassA(), stringValue, booleanValue), booleanValue, "* is middle argument, ClassA");
    });
    
    test("overload support for argument of any type and special type", function() {
        expect(6);
        
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var list = Overload
            .add([ClassA],
                function(o) { return o.getName(); })
            .add([Overload.Any],
                function(o) {
                    var array = [];
                    for (var key in o) {
                        array.push(o[key]);
                    }
                    return array.join(', ');
                })
            .add([ClassA, Overload.Any], function(a, b) { return a.getName()+", "+b; })
            .add([ClassA, Number],function(a,b){return a.getName()+", "+b;})
            .add([Number, Overload.Any, String], function(a, b, c) { return a+", "+b+c; })
            .add([Number, ClassA, String],function(a, b, c){return a+", "+b.getName()+c;});
        
        equals(list(new ClassA()), (new ClassA()).getName(), "classA");
        equals(list({ "1": "one", "2": "two", "3": "three" }), "one, two, three", 'list({ "1": "one", "2": "two", "3": "three" })');
        equals(list(new ClassA(), "abc"), "classA, abc", "list(new ClassA(), 'abc')");
        equals(list(new ClassA(), 6), "classA, 6", "list(new ClassA(), 6)");
        equals(list(2, 4, "cde"), "2, 4cde", "list(2, 4, 'cde')");
        equals(list(2, new ClassA(), "cde"), "2, classAcde", "list(2, new ClassA, 'cde')");
    });
    
    test("overload support for only Overload.More", function() {
        expect(10);
        
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add([Overload.More], function(x) { return numberValue });
        
        equals(overloaded(), numberValue, "without argument");
        equals(overloaded(numberValue), numberValue, "one argument, number argument");
        equals(overloaded(stringValue), numberValue, "one argument, string argument");
        equals(overloaded(booleanValue), numberValue, "one argument, boolean argument");
        equals(overloaded(arrayValue), numberValue, "one argument, array argument");
        equals(overloaded(functionValue), numberValue, "one argument, function argument");
        equals(overloaded(objectValue), numberValue, "one argument, object argument");
        equals(overloaded(dateValue), numberValue, "one argument, date argument");
        equals(overloaded(new ClassA()), numberValue, "one argument, ClassA argument");
        equals(overloaded(numberValue, stringValue, booleanValue, arrayValue, functionValue, new ClassA(), objectValue, dateValue), 
            numberValue, "more argument, every javascript types");
    });
    
    test("overload support for Overload.More with more argument", function() {
        expect(3);
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        var objectString = "object value";
        var dateValue = new Date();
        
        var overloaded = Overload
            .add([ClassA, String, Overload.More], function(x, y, z) { return stringValue });
        
        equals(overloaded(new ClassA(), stringValue), stringValue, "n+0 argument");
        equals(overloaded(new ClassA(), stringValue, new ClassA()), stringValue, "n+1 argument");
        equals(overloaded(new ClassA(), stringValue, booleanValue, arrayValue, new ClassA(), functionValue, objectValue, dateValue), 
            stringValue, "n+n argument, every javascript types");
    });
    
    test("overload support for Overload.More with different length", function() {
        expect(5);
        
        var numberValueOne = 11;
        var numberValueTwo = 12;
        var numberValueThree = 13;
        var numberValueFour = 14;
        var booleanValue = false;
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        ClassB.prototype.getName = function(){return this.name};
        function ClassC(){this.name = "classC"};
        ClassC.prototype.getName = function(){return this.name};
        function ClassD(){this.name = "classD"};
        ClassD.prototype.getName = function(){return this.name};
        
        var overloaded = Overload
            .add([ClassA, ClassA, ClassA], function(x, y, z) { return (new ClassA).getName(); })
            .add([ClassA, ClassA, Overload.More], function(){return (new ClassB).getName();})
            .add([ClassA, Overload.More], function(){return (new ClassC).getName();})
            .add([Overload.More], function(){return (new ClassD).getName();});
            
        
        equals(overloaded(new ClassA(), new ClassA(), new ClassA(), new ClassA()), 
            (new ClassB).getName(), "four arguments, matching function two");
        equals(overloaded(new ClassA(), new ClassA(), new ClassA()), 
            (new ClassA()).getName(), "three arguments, matching function one");
        equals(overloaded(new ClassA(), new ClassA()), (new ClassB).getName(), "two arguments, matching function two");
        equals(overloaded(new ClassA()), (new ClassC).getName(), "one arguments, matching function three");
        equals(overloaded(new ClassB(), new ClassA), (new ClassD).getName(), "first argument not matching function one,two,three");
    });
    
    test("overload support for Overload.Any and Overload.More together", function() {
        expect(3);
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        ClassB.prototype.getName = function(){return this.name};
        function ClassC(){this.name = "classC"};
        ClassC.prototype.getName = function(){return this.name};
        
        var join = Overload
            .add([Overload.Any],
                function(x) { return (new ClassA()).getName(); })
            .add([Overload.Any, Overload.Any],
                function(x, y) { return (new ClassB()).getName(); })
            .add([Overload.Any, Overload.Any, Overload.More], 
                function() { return (new ClassC()).getName();  });
        
        same(join(new ClassA()), "classA", 'join(new ClassA())');
        same(join(new ClassB(), new ClassC()), "classB", 'join(new ClassB(), new ClassC())');
        same(join(new ClassC(), new ClassA(), new ClassB()), "classC", "join(new ClassC(), new ClassA(), new ClassB())");
    });
    
    test("overload support for types is String and Array", function() {
        expect(7);
        
        var noArgu = "argument is null";
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var objectValue = {"a":"b", "c":"d"};
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        ClassB.prototype.getName = function(){return this.name};
        function ClassC(){this.name = "classC"};
        ClassC.prototype.getName = function(){return this.name};
        
        var together = Overload
            .add([], function(){return noArgu;})
            .add("Number", function(){return numberValue;})
            .add([ClassA], function(){return (new ClassA()).getName();})
            .add("Boolean, String, Array", function(){return stringValue;})
            .add([Function, Object, ClassB], function(){return (new ClassB()).getName();})
            .add("Number, *, String, *, ...", function(){return arrayValue;})
            .add([ClassC, Overload.Any, ClassA, Overload.Any, Number, Overload.More], function(){return (new ClassC()).getName();});
        
        equals(together(), noArgu, "function without argument");
        equals(together(numberValue), numberValue, "one argument, types is String");
        equals(together(new ClassA()), (new ClassA()).getName(), "one argument, types is Array");
        equals(together(booleanValue, stringValue, arrayValue), stringValue, "more argument, types is String");
        equals(together(functionValue, objectValue, new ClassB()), (new ClassB()).getName(), "more argument, types is Array");
        equals(together(numberValue, new ClassA(), stringValue, stringValue, new ClassB(), booleanValue), 
            arrayValue, "*,... can match user's Class and javascript's Class");
        equals(together(new ClassC(), numberValue, new ClassA(), new ClassB(), numberValue, booleanValue, new ClassB()), 
            (new ClassC()).getName(), "Overload.Any, Overload.More can match user's Class and javascript's Class");
    });
    
    module("inherits");
    test("overload support for only superClass", function() {
        expect(3);

        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        baidu.lang.inherits(ClassB, ClassA);
        function ClassC(){this.name = "classC"};
        baidu.lang.inherits(ClassC, ClassB);
        
        var inheritFun = Overload.add([ClassA], function(o){return o.getName();});
        
        equals(inheritFun(new ClassC()), (new ClassC()).getName(), "subClass ClassC, inherits ClassB");
        equals(inheritFun(new ClassB()), (new ClassB()).getName(), "subClass ClassB, inherits ClassA");
        equals(inheritFun(new ClassA()), (new ClassA()).getName(), "superClass ClassA");
    });
    
    test("overload support for superClass and subClass", function() {
        expect(6);

        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        baidu.lang.inherits(ClassB, ClassA);
        function ClassC(){this.name = "classC"};
        baidu.lang.inherits(ClassC, ClassB);
        
        var inheritFun = Overload
            .add([ClassA], function(){return (new ClassA()).getName();})
            .add([ClassB], function(){return (new ClassB()).getName();})
            .add([ClassC], function(){return (new ClassC()).getName();})
            .add([ClassA, ClassB, ClassC], function(){return (new ClassA()).getName() + (new ClassB()).getName();})
            .add([ClassA, ClassB, ClassA], function(){return (new ClassA()).getName() + (new ClassA()).getName();});
        
        equals(inheritFun(new ClassC()), (new ClassC()).getName(), "subClass ClassC, inherits ClassB");
        equals(inheritFun(new ClassB()), (new ClassB()).getName(), "subClass ClassB, inherits ClassA");
        equals(inheritFun(new ClassA()), (new ClassA()).getName(), "superClass ClassA");
        equals(inheritFun(new ClassA(), new ClassB(), new ClassC()), "classAclassB", "match itself, call itself function");
        equals(inheritFun(new ClassA(), new ClassC(), new ClassB()), "classAclassA", "without match itself, call superClass");
        equals(inheritFun(new ClassC(), new ClassC(), new ClassA()), "classAclassA", "no argument match, call superClass");
    });
    
    test("overload support for Error inherits Object", function() {
        expect(4);
        
        var obj = {"a":"1", "b":"2"};
        var err = new Error();
        
        var inheritFun = Overload
            .add([Object, Error], function(){return "subClass"})
            .add([Object, Object], function(){return "superClass"})
            .add("Object", function(){return "subClass, one argument"});
        
        equals(inheritFun(obj, err), "subClass", "function match");
        equals(inheritFun(err, obj), "superClass", "Error inherits Object");
        equals(inheritFun(err), "subClass, one argument", "subClass, one argument, Error type");
        equals(inheritFun(obj), "subClass, one argument", "subClass, one argument, Object type");
    });
    
    test("overload support for call superClass, not Overload.Any,Overload.More", function() {
        expect(4);

        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        baidu.lang.inherits(ClassB, ClassA);
        function ClassC(){this.name = "classC"};
        baidu.lang.inherits(ClassC, ClassB);
        
        var inheritFun = Overload
            .add([ClassA], function(){return (new ClassA()).getName();})
            .add([Overload.Any], function(){return "overload.any"})
            .add([Overload.More], function(){return "overload.more"})
            .add([ClassA, ClassB, ClassA], function(){return (new ClassB()).getName();})
            .add([Overload.Any, ClassB, Overload.Any], function(){return "overload.any";})
            .add([ClassA, ClassB, Overload.More], function(){return "overload.more";});
        
        equals(inheritFun(new ClassC()), "classA", "ClassC call superClass Function [ClassA]");
        equals(inheritFun(new ClassB()), "classA", "ClassB call superClass Function [ClassA]");
        equals(inheritFun(new ClassC(), new ClassC(), new ClassC()), "classB", "ClassC call superClass Function [ClassA, ClassB, ClassA]");
        equals(inheritFun(new ClassB(), new ClassC(), new ClassB()), "classB", "ClassB call superClass Function [ClassA, ClassB, ClassA]");
    });
    
    test("overload support for call superClass, not *,...", function() {
        expect(2);

        var obj = {"a":"1", "b":"2"};
        var err = new Error();
        
        var inheritFun = Overload
            .add("Object", function(){return "Object";})
            .add("*", function(){return "overload.any"})
            .add("...", function(){return "overload.more"})
            .add("Object, Object, Object", function(){return "three Object";})
            .add("*, Object, *", function(){return "overload.any";})
            .add("Object, Object, *", function(){return "overload.more";});
        
        equals(inheritFun(err), "Object", "Error call Object Function [Error]");
        equals(inheritFun(err, err, err), "three Object", "Error call Object Function [Error, Error, Error]");
    });
    
    module("Null_Undefined");
    test("match every type input in String, including *,...", function() {
        expect(6);
        var undefineValue;
        var nullValue = null;
        
        var nullFun = Overload
            .add("Number", function(x) { return "null one" })
            .add("String, Boolean", function(x){return "null two"})
            .add("Array, Function, Object, Date", function(x){return "null three"})
            .add("*, *, *, *, *, ...", function(x){return "null four"});
        
        equals(nullFun(nullValue), "null one", "one argument, null");
        equals(nullFun(undefineValue), "null one", "one argument, undefined");
        equals(nullFun(nullValue, undefineValue), "null two", "two argument, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue), "null three", "more argument, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue, undefineValue), "null four", "*, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue, undefineValue, nullValue, undefineValue), 
            "null four", "..., null & undefined");
    });
    
    test("match every type input in Array, including Overload.Any,Overload.More", function() {
        expect(6);
        var undefineValue;
        var nullValue = null;
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        
        var nullFun = Overload
            .add([Number], function(x) { return "null one" })
            .add([String, Boolean, ClassA], function(x){return "null two"})
            .add([Array, Function, Object, Date], function(x){return "null three"})
            .add([Overload.Any, Overload.Any, Overload.Any, Overload.Any, Overload.Any, Overload.More], function(x){return "null four"});
        
        equals(nullFun(nullValue), "null one", "one argument, null");
        equals(nullFun(undefineValue), "null one", "one argument, undefined");
        equals(nullFun(nullValue, undefineValue, nullValue), "null two", "three argument, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue), "null three", "more argument, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue, undefineValue), "null four", "*, null & undefined");
        equals(nullFun(nullValue, nullValue, undefineValue, undefineValue, undefineValue, nullValue, undefineValue), 
            "null four", "..., null & undefined");
    });
    
    module("Exception");
    /*type 为null情况需要用户来保证，jspatterns不做判断
    test("types is null", function() {
        expect(1);
        try {
            var exceptionFun = Overload.add(null, function(x){return "exception";});
        }
        catch(e){
            ok(true, e.toString());
        }    
    });*/
    
    test("handler is null", function() {
        expect(2);
        try {
            var exceptionFun = Overload.add("Number", null);
            exceptionFun(10);
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload.add([Number], null);
            exceptionFun(10);
        }
        catch(e){
            ok(true, e.toString());
        }    
    });
    /*对于Undefined的输入需要用户来保证
    test("type is no exist", function() {
        expect(1);
        try {
            var exceptionFun = Overload.add("NoExist", function(){return "wrong"});
        }
        catch(e){
            ok(true, e.toString());
        }    
        对于Undefined的输入需要用户来保证
        try {
            var exceptionFun = Overload.add([NoExist], function(){return "wrong"});
        }
        catch(e){
            ok(true, e.toString());
        }    
    });*/
    
    test("argument number is wrong", function() {
        expect(2);
        try {
            var exceptionFun = Overload.add("Number", function(){return "wrong"});
            exceptionFun(1, 2);
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload.add([], function(){return "wrong"});
            exceptionFun(1);
        }
        catch(e){
            ok(true, e.toString());
        }    
    });
    
    test("same overload", function() {
        expect(3);
        try {
            var exceptionFun = Overload
                .add("Number", function(){return "wrong one"})
                .add("Number", function(){return "wrong two"});
            exceptionFun(1);
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload
                .add([], function(){return "wrong one"})
                .add([], function(){return "wrong two"});
            exceptionFun();
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload
                .add([String], function(){return "wrong one"})
                .add("String", function(){return "wrong two"});
            exceptionFun("test");
        }
        catch(e){
            ok(true, e.toString());
        }    
    });
    
    test("same weight overload", function() {
        expect(3);
        try {
            var exceptionFun = Overload
                .add("Number, String", function(){return "wrong one"})
                .add("Number, Boolean", function(){return "wrong two"});
            exceptionFun(1, [1, 2]);
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload
                .add([Array, String], function(){return "wrong one"})
                .add([Boolean, String], function(){return "wrong two"});
            exceptionFun(2, "test");
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload
                .add([Object, Number], function(){return "wrong one"})
                .add("Date, Number", function(){return "wrong two"});
            exceptionFun("test", 5);
        }
        catch(e){
            ok(true, e.toString());
        }    
    });
    
    test("only subClass Function, but call by superClass", function() {
        expect(2);
        function ClassA(){this.name = "classA"};
        ClassA.prototype.getName = function(){return this.name};
        function ClassB(){this.name = "classB"};
        baidu.lang.inherits(ClassB, ClassA);
        
        try {
            var exceptionFun = Overload
                .add("Error", function(){return "wrong one"});
            exceptionFun(new Object());
        }
        catch(e){
            ok(true, e.toString());
        }    
        try {
            var exceptionFun = Overload
                .add([ClassB], function(){return "wrong one"});
            exceptionFun(new ClassA());
        }
        catch(e){
            ok(true, e.toString());
        }    
    });
    
    test("except Error, JS types can't call Object Function", function() {
        expect(6);
        var numberValue = 3;
        var stringValue = "-- string value --";
        var booleanValue = false;
        var arrayValue = [1,2,3];
        var functionValue = function(){return "function Value";};
        var dateValue = new Date();
        
        var exceptionFunString = Overload.add("Object", function(){return "wrong one"});
        var exceptionFunArray = Overload.add([Object], function(){return "wrong two"});
        
        try { exceptionFunString(numberValue); }catch(e){ ok(true, e.toString()); }    
        try { exceptionFunArray(numberValue); }catch(e){ ok(true, e.toString()); }    
        try { exceptionFunString(stringValue); }catch(e){ ok(true, e.toString()); }    
        try { exceptionFunArray(stringValue); }catch(e){ ok(true, e.toString()); }
        try { exceptionFunString(booleanValue); }catch(e){ ok(true, e.toString()); }    
        try { exceptionFunArray(booleanValue); }catch(e){ ok(true, e.toString()); }
//        try { exceptionFunString(arrayValue); }catch(e){ ok(true, e.toString()); }    
//        try { exceptionFunArray(arrayValue); }catch(e){ ok(true, e.toString()); }
//        try { exceptionFunString(functionValue); }catch(e){ ok(true, e.toString()); }    
//        try { exceptionFunArray(functionValue); }catch(e){ ok(true, e.toString()); }
//        try { exceptionFunString(dateValue); }catch(e){ ok(true, e.toString()); }    
//        try { exceptionFunArray(dateValue); }catch(e){ ok(true, e.toString()); }
    });
    
    module("Overload.select");
    test("overload resolution for arguments in the same inheritance hierarchy", function() {
        expect(2);
        
        var parent = function parent() { this.x = 1; };
        var child = function child() { this.y = 2; };
        child.prototype = new parent();
        
        var overloadForParent = function overloadForParent() {};
        var overloadForChild = function overloadForChild() {};
        
        var overloaded = Overload
            .add([parent], overloadForParent)
            .add([child], overloadForChild);
        
        equals(overloaded.select([new parent()]), overloadForParent, "overloaded.select([new parent()])");
        equals(overloaded.select([new child()]), overloadForChild, "overloaded.select([new child()])");
    });
    
    test("overload resolution for ambiguous argument types", function() {
        expect(1);
        
        var parent = function parent() { this.x = 1; };
        var child = function child() { this.y = 2; };
        child.prototype = new parent();
        
        var overloaded = Overload
            .add([parent, child], function() {})
            .add([child, parent], function() {});
        
        equals(overloaded.select([new child(), new child()]), null, "overloaded.select([new child(), new child()])");
    });
    
    test("overload resolution for no argument", function() {
        expect(3);
        
        var overloadForArgumentless = function overloadForArgumentless() {};
        var overloadForArgumentness = function overloadForArgumentness() {};
        
        var overloaded = Overload
            .add("", overloadForArgumentless)
            .add("...", overloadForArgumentness);
        
        equals(overloaded.select([]), overloadForArgumentless, "overloaded.select([])");
        equals(overloaded.select([true]), overloadForArgumentness, "overloaded.select([true])");
        equals(overloaded.select(["hello", "world"]), overloadForArgumentness, 'overloaded.select(["hello", "world"])');
    });
    
    test("overload resolution for argument of any type", function() {
        expect(3);
        
        var overloadForArray = function overloadForArray() {};
        var overloadForObject = function overloadForObject() {};
        var overloadForAny = function overloadForAny() {};
        
        var overloaded = Overload
            .add("Array", overloadForArray)
            .add("Object", overloadForObject)
            .add("*", overloadForAny);
            
        equals(overloaded.select([[]]), overloadForArray, "overloaded.select([])");
        equals(overloaded.select([{}]), overloadForObject, "overloaded.select([{}])");
        equals(overloaded.select([0]), overloadForAny, "overloaded.select([0])");
    });
    
    test("overload resolution for more arguments after argument list", function() {
        expect(3);
        
        var overloadForOneString = function overloadForOneString() {};
        var overloadForOneStringAndMore = function overloadForOneStringAndMore() {};
        var overloadForTwoString = function overloadForTwoString() {};
        var overloadForTwoStringAndMore = function overloadForTwoStringAndMore() {};
        
        var overloaded = Overload
            .add("String", overloadForOneString)
            .add("String, ...", overloadForOneStringAndMore)
            .add("String, String", overloadForTwoString)
            .add("String, String, ...", overloadForTwoStringAndMore);
        
        equals(overloaded.select(["hello"]), overloadForOneString, 'overloaded.select(["hello"])');
        equals(overloaded.select(["hello", "world"]), overloadForTwoString, 'overloaded.select(["hello", "world"])');
        equals(overloaded.select(["hello", ",", "world", "!"]), overloadForTwoStringAndMore, 'overloaded.select(["hello", ",", "world", "!"])');
    });
    
    test("overload null argument support", function() {
        expect(2);
        
        var overloadForOneArgument = function overloadForOneArgument() {};
        var overloadForOneArgumentAndMore = function overloadForOneArgumentAndMore() {};
        
        var overloaded = Overload
            .add("*", overloadForOneArgument)
            .add("*, ...", overloadForOneArgumentAndMore)
        
        equals(overloaded.select([null]), overloadForOneArgument, 'overloaded.select([null])');
        equals(overloaded.select([null, null]), overloadForOneArgumentAndMore, 'overloaded.select([null, null])');
    });
}

(function() {
	var MVC = window.MVC = {};
	
	var defaults = {
		controllersPath: "window.Application.Controllers"
	};
	var settings = $.extend({}, defaults);
	
	var controllers = {};
	var readyList = [];
	var isReady = false;
	
	MVC.startup = function(options) {
		settings = $.extend({}, defaults, options);
		
		var controllerClasses = {};
		try {
			controllerClasses = eval(settings.controllersPath);
		} catch (error) {
			if (options.controllersPath) {
				throw "settings.controllersPath doesn't exist or can't not be evaluated";
			}
		}
		for (var controllerName in controllerClasses) {
			var controllerClass = controllerClasses[controllerName];
			if (controllerClass instanceof Function && controllerClass.prototype == MVC.Controller) {
				var controller = new controllerClass();
				if (!controllers[controllerName]) {
					controllers[controllerName] = controller;
				} else {
					throw "controller already exists: " + controllerName;
				}
			}
		}
		
		for (var i = 0; i < readyList.length; i++) {
			readyList[i].call(document);
		}
		readyList = [];
	};
	
	MVC.go = function(controllerName, actionName, data) {
		if (controllers[controllerName]) {
			var controller = controllers[controllerName];
			if (controller[actionName] && controller[actionName] instanceof Function && controller[actionName] != MVC.Controller[actionName]) {
				var contextConstructor = function() {
					this.controllerName = controllerName;
					this.actionName = actionName;
				};
				contextConstructor.prototype = controller;
				var context = new contextConstructor();
				var result = controller[actionName].call(context, data);
				if (result instanceof Function) {
					return result.call(context);
				} else {
					throw "action result is not a function";
				}
			} else {
				throw "action doesn't exists: " + actionName;
			}
		} else {
			throw "controller doesn't exist: " + controllerName;
		}
	};
	
	MVC.ready = function(callback) {
		if (isReady) {
			callback.call(document);
		} else {
			readyList.push(callback);
		}
	};
	
	MVC.Controller = (function() {
		return {};
	})();
})();

MVC.View = {};

(function() {
	var renderTemplate = function(template, data) {
		/* Simple JavaScript Templating */
		/* John Resig - http://ejohn.org/blog/javascript-micro-templating/ - MIT Licensed */
		var renderFunction = new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			template
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				/* following is the original John Resign code */
				/* .replace(/((^|%>)[^\t]*)'/g, "$1\r") */
				/* it only replaces the last quotation mark */
				.replace(/'/g, "\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');");
		return renderFunction(data);
	}
	
	MVC.View.load = function(templateName) {
		var templatesFrame = document.getElementById("templates");
		if (templatesFrame
			&& templatesFrame.contentWindow
			&& templatesFrame.contentWindow.document
			&& templatesFrame.contentWindow.document.getElementById
			&& templatesFrame.contentWindow.document.getElementById(templateName)) {
				return templatesFrame.contentWindow.document.getElementById(templateName).innerHTML;
		} else if (document.getElementById(templateName)) {
			return document.getElementById(templateName).innerHTML;
		} else {
			throw "template doesn't exist: " + templateName;
		}
	};
	
	MVC.View.render = function(template, result) {
		return renderTemplate(template, result || {});
		/* default value for result is empty object */
		/* renderTemplate throws when result is undefined */
	};
})();

MVC.Controller.Result = {};

MVC.Controller.Result.object = function(data) {
	var self = this;
	this.data = data;
	
	return function() {
		return self.data;
	};
};

MVC.Controller.Result.html = function(templateName, data) {
	var self = this;
	this.data = data;
	
	return function() {
		return MVC.View.render(MVC.View.load(templateName), self);
	};
};

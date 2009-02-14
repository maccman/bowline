/**
 * Chain.js
 * jQuery Plugin for Data Binding
 * 
 * Copyright (c) 2008 Rizqi Ahmad
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/* core.js */
(function($){

/**
 * Chain Namespace
 * 
 * @alias jQuery.Chain
 * @namespace
 */ 	
$.Chain = 
{
	/**
	 * Version Number
	 * 
	 * @alias jQuery.Chain.version
	 * @property {String}
	 */ 
	version: '0.2',
	
	/**
	 * Tag for use in @jQuery.Chain.parse@ (which is used in CustomUpdater).
	 * It is can be altered.
	 * 
	 * @alias jQuery.Chain.tags
	 * 
	 * @property {Array}
	 * 
	 * @see jQuery.Chain.parse
	 */ 
	tag: ['{', '}'],
	
	/**
	 * Namespace containing all defined services.
	 * 
	 * @namespace
	 * 
	 * @alias jQuery.Chain.services
	 */ 
	services: {},
	
	/**
	 * Register a service to the service manager.
	 * 
	 * @alias jQuery.Chain.service
	 * 
	 * @param {String}	name	Service Name
	 * @param {Object}	proto 	Service Object Prototype
	 * 
	 * @example Create a Custom Service
	 * $.Chain.service('test', {
	 * 		// Default command handler
	 * 		handler: function(option)
	 * 		{
	 * 			// do something
	 * 		},
	 * 		// $(selector).test('what', somearg)
	 * 		$what: function(somearg)
	 * 		{
	 * 			// do something
	 * 		}
	 * });
	 * 
	 * $('#element').test();
	 * 
	 * @see jQuery.Chain.extend
	 */ 
	service: function(name, proto)
	{
		this.services[name] = proto;
		
		// Creating jQuery fn module with the service
		$.fn[name] = function(options)
		{
			if(!this.length)
				{return this;}
			
			// Create Chain instance
			var instance = this.data('chain-'+name);
			
			// Extract arguments
			var args = Array.prototype.slice.call(arguments, 1);
			
			// Create Instance if it doesn't already exist
			if(!instance)
			{
			  // Return immediately if destroyed is called before Instance is created
				if(options == 'destroy') 
					{return this;}
				// Create Instance
				instance = $.extend({element: this}, $.Chain.services[name]);
				this.data('chain-'+name, instance);
				// Initialize if possible
				if(instance.init)
					{instance.init();}
			}
			
			var result;
			
			// Check whether to execute a command
			if(typeof options == 'string' && instance['$'+options])
				{result = instance['$'+options].apply(instance, args);}
			
			// Otherwise try to execute default handler
			else if(instance['handler'])
				{result = instance['handler'].apply(instance, [options].concat(args));}
			
			// Otherwise do nothing
			else
				{result = this;}
			
			// Remove instance on destroy
			if(options == 'destroy')
				{this.removeData('chain-'+name);}
			
			return result;
		};
	},

	/**
	 * Extends service functionalities.
	 * 
	 * @alias jQuery.Chain.extend
	 * 
	 * @param {String}	name	Service Name
	 * @param {Object}	proto 	Service Object Prototype
	 * 
	 * @see jQuery.Chain.service
	 */ 
	extend: function(name, proto)
	{
		if(this.services[name])
			{this.services[name] = $.extend(this.services[name], proto);}
	},
	
	/**
	 * Check whether it is a jQuery Object
	 * 
	 * @alias jQuery.Chain.jobject
	 * 
	 * @param {Object} obj Object to be checked
	 * 
	 * @example Using @jobject@
	 * $.Chain.jobject($()) // returns true
	 * $.Chain.jobject("test") // returns false
	 * 
	 * @return {Boolean} True or False
	 * 
	 * @see jQuery.Chain.jindentic
	 */ 
	jobject: function(obj)
	{
		return obj && obj.init == $.fn.init;
	},
	
	/**
	 * Check whether two jQuery Collection identic
	 * 
	 * @alias jQuery.Chain.jidentic
	 * 
	 * @param {Object}	j1	jQuery Object
	 * @param {Object}	j2	jQuery Object
	 * 
	 * @example Using @jidentic@
	 * a = $('div');
	 * b = $('div');
	 * c = $('div.test');
	 * 
	 * (a == b) //returns false
	 * 
	 * $.Chain.jidentic(a, b) // returns true
	 * $.Chain.jidentic(a, c) // returns false
	 * 
	 * @return {Boolean} True or False
	 * 
	 * @see jQuery.Chain.jobject
	 */ 
	jidentic: function(j1, j2)
	{
		if(!j1 || !j2 || j1.length != j2.length)
			{return false;}
		
		var a1 = j1.get();
		var a2 = j2.get();
		
		for(var i=0; i<a1.length; i++)
		{
			if(a1[i] != a2[i])
				{return false;}
		}
		
		return true;
		
	},
	
	/**
	 * Parse string contained @{something}@ to a Function
	 * that when executed replace those with the data it refers to.
	 * You can change the @{}@ tag by modifying @jQuery.Chain.tag@
	 * 
	 * @param {String} text String
	 * 
	 * @example Using @
	 * var fn = $.Chain.parse("My name is {first} {last}");
	 * fn({first:'Rizqi', last:'Ahmad'}) // returns "My name is Rizqi Ahmad"
	 * 
	 * @return {Function} template string.
	 * 
	 * @see jQuery.Chain.tag
	 */ 
	parse: function()
	{
		var $this = {};
		// Function Closure
		$this.closure =
		[
			'function($data, $el){'
			+'var $text = [];\n'
			+'$text.print = function(text)'
			+'{this.push((typeof text == "number") ? text : ((typeof text != "undefined") ? text : ""));};\n'
			+'with($data){\n',
	
			'}\n'
			+'return $text.join("");'
			+'}'
		];
	
		// Print text template
		$this.textPrint = function(text)
		{
			return '$text.print("'
				+text.split('\\').join('\\\\').split("'").join("\\'").split('"').join('\\"')
				+'");';
		};
	
		// Print script template
		$this.scriptPrint = function(text)
		{
			return '$text.print('+text+');';
		};
		
		$this.parser = function(text){
			var tag = $.Chain.tag;
		
			var opener, closer, closer2 = null, result = [];
	
			while(text){
		
				// Check where the opener and closer tag
				// are located in the text.
				opener = text.indexOf(tag[0]);
				closer = opener + text.substring(opener).indexOf(tag[1]);
		
				// If opener tag exists, otherwise there are no tags anymore
				if(opener != -1)
				{
					// Handle escape. Tag can be escaped with '\\'.
					// If tag is escaped. it will be handled as a normal text
					// Otherwise it will be handled as a script
					if(text[opener-1] == '\\')
					{
						closer2 = opener+tag[0].length + text.substring(opener+tag[0].length).indexOf(tag[0]);
						if(closer2 != opener+tag[0].length-1 && text[closer2-1] == '\\')
							{closer2 = closer2-1;}
						else if(closer2 == opener+tag[0].length-1)
							{closer2 = text.length;}
				
						result.push($this.textPrint(text.substring(0, opener-1)));
						result.push($this.textPrint(text.substring(opener, closer2)));
					}
					else
					{
						closer2 = null;
						if(closer == opener-1)
							{closer = text.length;}
				
						result.push($this.textPrint(text.substring(0, opener)));
						result.push($this.scriptPrint(text.substring(opener+tag[0].length, closer)));
					}
					
					text = text.substring((closer2 === null) ? closer+tag[1].length : closer2);
				}
				// If there are still text, it will be pushed to array
				// So we won't stuck in an infinite loop
				else if(text)
				{
					result.push($this.textPrint(text));
					text = '';
				}
			}
	
			return result.join('\n');	
		};
	
	
		/*
		 * Real function begins here.
		 * We use closure for private variables and function.
		 */
		return function($text)
		{
			var $fn = function(){};
			try
			{
				eval('$fn = '+ $this.closure[0]+$this.parser($text)+$this.closure[1]);
			}
			catch(e)
			{
				throw "Parsing Error";
			}
			
			return $fn;
		};
	}()
};
	
})(jQuery);

/* update.js */
/**
 * Chain Update Service
 * 
 * @alias update
 * 
 * @syntax $(selector).update(parameters);
 */ 

(function($){

/**
 * Chain Update Service Object - Providing methods of @update@.
 * All method listed here can only be used internally
 * using @jQuery.Chain.service@ or @jQuery.Chain.extend@
 * 
 * @namespace
 * 
 * @alias jQuery.Chain.services.update
 * 
 * @see jQuery.Chain.service
 * @see jQuery.Chain.extend
 */ 

$.Chain.service('update', {
	/**
	 * Default Handler
	 * 
	 * @alias jQuery.Chain.services.update.handler
	 * 
	 * @see jQuery.Chain.service
	 * @see jQuery.Chain.services.update.bind
	 * @see jQuery.Chain.services.update.trigger
	 */ 
	handler: function(opt)
	{
		if(typeof opt == 'function')
			{return this.bind(opt);}
		else
			{return this.trigger(opt);}
	},
	
	/**
	 * If you pass a function to update, it will bind it to the update event.
	 * just like jQuerys @click()@ or @mouseover()@.
	 * 
	 * @alias update(fn)
	 * @alias jQuery.Chain.services.update.bind
	 * 
	 * @param {Function} fn Listener
	 * 
	 * @example
	 * // assuming #person is already chained
	 * $('#person').update(function{
	 * 		alert($(this).item().name);
	 * });
	 * 
	 * $('#person').item({name: 'Rizqi'})
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.services.update.handler
	 */ 
	bind: function(fn)
	{
		return this.element.bind('update', fn);
	},
	
	/**
	 * If no argument or "hard" is passed,
	 * it will update the element and trigger the update event.
	 * 
	 * @alias update(opt)
	 * @alias jQuery.Chain.services.update.trigger
	 * 
	 * @param {String} opt If 'hard', it will update each of items
	 * 
	 * @example
	 * $('#person').update();
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.services.update.handler
	 */ 
	trigger: function(opt)
	{
		this.element.items('update');
		this.element.item('update');
		
		this.element.triggerHandler('preupdate', this.element.item());
		
		if(opt == 'hard')
			{this.element.items(true).each(function(){$(this).update();});}
		
		this.element.triggerHandler('update', this.element.item());
		
		return this.element;
	}
});
	
})(jQuery);

/* chain.js */
/**
 * Chain Binding Service.
 * Method to activate the chaining / element rendering service.
 * 
 * @alias chain
 * 
 * @syntax $(selector).chain(parameters);
 */ 

(function($){

/**
 * Chain Binding Service Object - Providing methods of @chain@.
 * All method listed here can only be used internally
 * using @jQuery.Chain.service@ or @jQuery.Chain.extend@
 * 
 * @namespace
 * 
 * @alias jQuery.Chain.services.chain
 * 
 * @see jQuery.Chain.service
 * @see jQuery.Chain.extend
 */ 

$.Chain.service('chain', {
	/**
	 * Initializer. Executed once at the first time @chain@ invoked.
	 * 
	 * @alias jQuery.Chain.services.chain.init
	 * 
	 * @see jQuery.Chain.service
	 */ 
	init: function()
	{
		this.anchor = this.element;
		this.template = this.anchor.html();
		this.tplNumber = 0; // At Default it uses the first template.
		this.builder = this.createBuilder();
		this.plugins = {};
		this.isActive = false;
		this.destroyers = [];
		
		// Add class 'chain-element' as identifier
		this.element.addClass('chain-element');
	},
	
	/**
	 * Default handler.
	 * 
	 * @alias jQuery.Chain.services.chain.handler
	 * 
	 * @param {Object} obj Object to be handled
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.service
	 * @see jQuery.Chain.services.chain.handleUpdater
	 * @see jQuery.Chain.services.chain.handleBuilder
	 */ 
	handler: function(obj, bool)
	{
		// Backup items and item, all items will be stored in Buffer
		this.element.items('backup');
		this.element.item('backup');
		
		if(typeof obj == 'object')
			{this.handleUpdater(obj);}
		else if(typeof obj == 'function')
			{this.handleBuilder(obj, bool);}
		
		// Empty element, if @item@ it will filled again later
		this.anchor.empty();
		
		this.isActive = true;
		this.element.update();
		
		return this.element;
	},
	
	/**
	 * Updater Handler.
	 * If you pass an object to @chain@, it will treated as a updater object.
	 * The updater is a hash of selector and value string:
	 * like @chain({'my css selector': 'My Content String'})@
	 * or @chain({'my css selector': {attributes}})@
	 * 
	 * @alias chain(updater)
	 * @alias jQuery.Chain.services.chain.handleUpdater
	 * 
	 * @param {Object} rules Updater rules to be parsed
	 * 
	 * @example Usage
	 * $(selector)
	 * 		.chain({
	 * 			// Items anchor, where the Item iteration should be placed
	 * 			anchor: anchor,
	 * 			// If true, the default updater is overridden
	 * 			override: false, 
	 * 			// Use custom builder
	 * 			builder: function(){},
	 * 			// Update the element self
	 * 			self: "This is my {data}",
	 * 			// Use css selector to update child element
	 * 			'.element.selector': "Using String Updater",
	 * 			// Use Function as updater
	 * 			'.element.selector': function(data, el){},
	 * 			// Updating Attributes
	 * 			'.element.selector': {
	 * 				attribute1: "{attribute}",
	 * 				className: "{className}",
	 * 				content: "This is the {content}",
	 * 				value: "This is the {value}"
	 * 			}
	 * 		});
	 * 
	 * @example Using Default Updater
	 * $('<div><span class="name">Name</span></div>')
	 * 		.item({name: 'Steve Jobs'})
	 * 		.chain()
	 * 		.appendTo(document.body);
	 * 
	 * @example Using Custom Updater
	 * $('<div><div class="name"><span class="first">First</span> <span class="last">Last</span></div></div>')
	 * 		.item({first:'Steve', last:'Jobs'})
	 * 		.chain({
	 * 			'.name .first': {
	 * 				style: 'color: blue;',
	 * 				content: 'First Name: {first}'
	 * 			},
	 * 			'.name .last': 'Family Name: {last}'
	 * 		})
	 * 		.appendTo(document.body);
	 * 
	 * @example Attach Builder Inside Updater
	 * $('<div><div class="name">Name</div><div class="address">Address</div></div>')
	 * 		.item({name:'Steve Jobs', address:'Cupertino'})
	 * 		.chain({
	 * 			builder: function(){
	 * 				var data = this.item();
	 * 				this.find('.name').click(function(){alert(data.name)});
	 * 				this.find('.address').mouseout(function(){alert(data.address)});
	 * 			},
	 * 			'.name': '{name}',
	 * 			'.address': '{address}'
	 * 		})
	 * 		.appendTo(document.body);
	 */ 
	handleUpdater: function(rules)
	{
		// Extract Builder
		var builder = rules.builder;
		delete rules.builder;
		
		// Extract Options
		this.options = rules.options || {};
		delete rules.options;
		
		// Extract Anchor
		if(rules.anchor)
			{this.setAnchor(rules.anchor);}
		delete rules.anchor;
		
		// Extract Override
		var override = rules.override;
		delete rules.override;
	
		for(var i in rules)
		{
			// Parse String to Function
			if(typeof rules[i] == 'string')
			{
				rules[i] = $.Chain.parse(rules[i]);
			}
			// Parse Attributes Object to Functions
			else if(typeof rules[i] == 'object')
			{
				for(var j in rules[i])
				{
					if(typeof rules[i][j] == 'string')
					{
						rules[i][j] = $.Chain.parse(rules[i][j]);
					}
				}
			}
		}
	
		// Create Updater
		var fn = function(event, data)
		{
			var el, val;
			var self = $(this);
			for(var i in rules)
			{
				// If self, update the element itself
				if(i == 'self')
					{el = self;}
				// Otherwise find element inside self
				else
					{el = $(i, self);}
				
				// Executing
				// If no attributes, put the result to html (value if input)
				if (typeof rules[i] == 'function')
				{
					val = rules[i].apply(self, [data, el]);
					if(typeof val == 'string')
						{el.not(':input').html(val).end().filter(':input').val(val);}
				}
				// If attributes, then execute the function for each attr.
				else if(typeof rules[i] == 'object')
				{
					for(var j in rules[i])
					{
						if (typeof rules[i][j] == 'function')
						{
							val = rules[i][j].apply(self, [data, el]);
							if(typeof val == 'string')
							{
								// Some special attributes
								if(j == 'content')
									{el.html(val);}
								else if(j == 'text')
									{el.text(val);}
								else if(j == 'value')
									{el.val(val);}
								else if(j == 'class' || j == 'className')
									{el.addClass(val);}
								// Otherwise fill attribute as normal
								else
									{el.attr(j, val);}
							}
							
						}
					}
				}
			}
		};
		
		var defBuilder = this.defaultBuilder;
		
		// Define Builder
		this.builder = function(root)
		{
			if(builder)
				{builder.apply(this, [root]);}
			
			if(!override)
				{defBuilder.apply(this);}
			
			// Here goes the updater
			this.update(fn);
			
			// This prevent infinite recursion
			// see: jQuery.Chain.services.item.build
			return false;
		};
	},
	
	/**
	 * Builder Handler.
	 * If you pass a function to @chain@, it will be handled 
	 * as @{builder: function}@, enabling you to use the default
	 * updater while customizing the events etc.
	 * 
	 * @alias chain(fn)
	 * @alias jQuery.Chain.services.chain.handleBuilder
	 * 
	 * @param {Function} fn Builder Function
	 * @param {Boolean} bool If true, it just use the builder provided. Not creating new Builder
	 * 
	 * @example
	 * $('<div><div class="name">Name</div><div class="address">Address</div></div>')
	 * 		.item({name:'Steve Jobs', address:'Cupertino'})
	 * 		.chain(function(){
	 * 			this.bind('click', function(){
	 * 				var data = this.item();
	 * 				alert('name:'+data.name+', address:'+data.address);
	 * 			});
	 * 			
	 * 			// if you return false, default builder wont be executed
	 * 			// You don't have to return true;
	 * 			return true;
	 * 		})
	 * 		.appendTo(document.body);
	 * 
	 * @see jQuery.Chain.services.chain.handleUpdater
	 * @see jQuery.Chain.services.chain.createBuilder
	 */ 
	handleBuilder: function(fn, bool)
	{
		if(bool)
			{this.builder = fn;}
		else
			{this.builder = this.createBuilder(fn);}
	},
	
	
	/**
	 * Default Builder - Automatic Data filler
	 * 
	 * @alias jQuery.Chain.services.chain.defaultBuilder
	 * 
	 * @param {Function} 	builder 	Builder Function
	 * @param {Object}		root		Root Element Object
	 * 
	 * @see jQuery.Chain.services.chain.createBuilder
	 */ 
	defaultBuilder: function(builder, root)
	{
		// Caution:
		// @this@ is in this function @this.element@
		
		// if builder return false, res will be false
		// Otherwise true
		// Using this, the default updater can be disabled
		var res = builder ? (builder.apply(this, [root]) !== false) : true;
		
		// Default Updater
		if(res)
		{
			this.bind('update', function(event, data){
				var self = $(this);
				// Iterate through data
				// Find element with the same class as data property
				// Insert data depending of elemen type
				for(var i in data)
				{	
					if(typeof data[i] != 'object' && typeof data[i] != 'function')
					{
						// This prevents selector to select inside nested chain-element
						// Important to support recursion & nested element
						// NEED OPTIMIZATION
						self.find('> .'+i+', *:not(.chain-element) .'+i)
							.each(function(){
								var match = $(this);
								if(match.filter(':input').length)
									{match.val(data[i]);}
								else if(match.filter('img').length)
									{match.attr('src', data[i]);}
								else
									{match.html(data[i]);}
							});
					}
				}
			});
		}
	},
	
	/**
	 * Builder Generator (Wrapper).
	 * 
	 * @alias jQuery.Chain.services.chain.createBuilder
	 * 
	 * @param {Function} builder Builder
	 * 
	 * @return {Function} Wrapped Builder
	 * 
	 * @see jQuery.Chain.services.chain.defaultBuilder;
	 */ 
	createBuilder: function(builder)
	{
		var defBuilder = this.defaultBuilder;
		return function(root){
			defBuilder.apply(this, [builder, root]);
			return false;
		};
	},
	
	/**
	 * Set Anchor (Container for @items@ to be populated, default: @this.element@)
	 * 
	 * @alias jQuery.Chain.services.chain.setAnchor
	 * 
	 * @param {Object} anchor Anchor element
	 * 
	 * @see jQuery.Chain.services.chain.$anchor
	 */ 
	setAnchor: function(anchor)
	{
		this.anchor.html(this.template);
		this.anchor = anchor == this.element ? anchor : this.element.find(anchor).eq(0);
		this.template = this.anchor.html();
		this.anchor.empty();
	},
	
	/**
	 * Set new Anchor and rerender if new anchor passed.
	 * Otherwise return current anchor.
	 * 
	 * If you use @items()@ with @chain()@,
	 * you can use @chain('anchor', selector)@ to move the element,
	 * where the items will be generated.
	 * 
	 * @alias chain('anchor')
	 * @alias jQuery.Chain.services.chain.$anchor
	 * 
	 * @param {Object} anchor Anchor element or selector
	 * 
	 * @return {Object} current element (if new Anchor passed), otherwise current anchor
	 * 
	 * @example
	 * $('#persons').chain('anchor', '.wrapper');
	 * 
	 * // Define Anchor directly while building
	 * $('#persons').items([...]).chain({anchor:'.wrapper', builder: ...});
	 */ 
	$anchor: function(anchor)
	{
		if(anchor)
		{
			this.element.items('backup');
			this.element.item('backup');
			
			this.setAnchor(anchor);
			this.element.update();
			
			return this.element;
		}
		else
		{
			return this.anchor;
		}
	},
	
	/**
	 * Getting/Switching Template.
	 * 
	 * @alias chain('template')
	 * @alias jQuery.Chain.services.chain.$template
	 * 
	 * @param {Number, String} arg Argument
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @example
	 * $(selector).chain('template') // Returns current Template (jQuery Object)
	 * $(selector).chain('template', 'raw') // Returns raw HTML Templates (all)
	 * $(selector).chain('template', nr) // Switch to template nr (read: Number)
	 * $(selector).chain('template', '.tree-column') // Switch by selector
	 */ 
	$template: function(arg)
	{
		// Returns current Template (jQuery Object)
		if(!arguments.length)
			{return $('<div>').html(this.template).children().eq(this.tplNumber);}
		
		// Returns raw HTML Template
		if(arg == 'raw')
			{return this.template;}
		
		// Switch template by Number
		if(typeof arg == 'number')
		{
			this.tplNumber = arg;
		}
		// Switch template by selector
		else
		{
			var tpl = $('<div>').html(this.template).children();
			var node = tpl.filter(arg).eq(0);
			
			if(node.length)
				{this.tplNumber = tpl.index(node);}
			else
				{return this.element;} // If not found do nothing
		}
		
		this.element.items('backup');
		this.element.item('backup');
		this.element.update();
		
		return this.element;
	},
	
	/**
	 * Get/Change Builder.
	 * If you don't pass any argument, it will return the created builder.
	 * 
	 * @alias chain('builder')
	 * @alias jQuery.Chain.services.chain.$builder
	 * 
	 * @param {Function, Object} builder (Optional)
	 * 
	 * @return {Function, Object} returns builder function, or jQuery Object depends on arg
	 * 
	 * @example
	 * $('#el').chain('builder') // returns builder function
	 * $('#el').chain('builder', newBuilder) // Replace Builder
	 */ 
	$builder: function(builder)
	{
		if(builder)
			{return this.handler(builder);}
		else
			{return this.builder;}
	},
	
	/**
	 * Check status
	 * 
	 * @alias chain('active')
	 * @alias jQuery.Chain.services.chain.$active
	 * 
	 * @return {Boolean} true if active
	 */ 
	$active: function()
	{
		return this.isActive;
	},
	
	/**
	 * Set/Get options
	 * 
	 * @alias chain('options')
	 * @alias jQuery.Chain.services.chain.$options
	 * 
	 * @param {String} opt Option name
	 * @param {Anything} val Option value
	 * 
	 * @return {Object} if no value given, it returns the value, otherwise the element itself
	 */ 
	
	$options: function(opt, val)
	{
		this.options = this.options || {};
		
		if(arguments.length == 2)
		{
			this.options[opt] = val;
			return this.element;
		}
		
		else
		{
			return this.options[opt];
		}
	},
	
	/**
	 * Add/Remove Plugins that extend builder
	 * 
	 * @alias chain('plugin')
	 * @alias jQuery.Chain.services.chain.$plugin
	 * 
	 * @param {String} 				name 	Plugin Name
	 * @param {Function, Boolean} 	fn 		Plugin Function / False to remove
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$plugin: function(name, fn)
	{
		if(fn === null)
			{delete this.plugins[name];}
		else if(typeof fn == 'function')
			{this.plugins[name] = fn;}
		else if(name && !fn)
			{return this.plugins[name];}
		else
			{return this.plugins;}
		
		if(typeof fn == 'function')
		{
			this.element.items(true).each(function(){
				var self = $(this);
				fn.call(self, self.item('root'));
			});
		}
		
		this.element.update();
		
		return this.element;
	},
	
	/**
	 * Clone Element unchained, with ID removed.
	 * 
	 * @alias chain('clone')
	 * @alias jQuery.Chain.services.chain.$clone
	 * 
	 * @return {Object} jQuery Object containing cloned Element
	 */ 
	$clone: function()
	{
		var id = this.element.attr('id');
		this.element.attr('id', '');
		
		var clone = this.element.clone().empty().html(this.template);
		this.element.attr('id', id);
		
		return clone;
	},
	
	/**
	 * Destroy Chain, restore Element to previous condition.
	 * 
	 * @alias chain('destroy')
	 * @alias jQuery.Chain.services.chain.$destroy
	 * 
	 * @param {Boolean} nofollow If true, it won't destroy nested chain elements
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$destroy: function(nofollow)
	{
		this.element.removeClass('chain-element');
		
		if(!nofollow)
		{
			// Backup to buffer
			this.element.items('backup');
			this.element.item('backup');
			
			// Destroy nested elements
			this.element.find('.chain-element').each(function(){
				$(this).chain('destroy', true);
			});
		}
		
		// Trigger destroy event
		this.element.triggerHandler('destroy');
	
		this.isActive = false;
	
		// Restore HTML
		this.anchor.html(this.template);
		
		return this.element;
	}
});
	
})(jQuery);

/* item.js */
/**
 * Chain Item Service.
 * Method to bind item to object.
 * 
 * @alias item
 * 
 * @syntax $(selector).item(parameters);
 */ 

(function($){

/**
 * Chain Item Manager - Providing methods of @item@.
 * All method listed here can only be used internally
 * using @jQuery.Chain.service@ or @jQuery.Chain.extend@
 * 
 * @namespace
 * 
 * @alias jQuery.Chain.services.item
 * 
 * @see jQuery.Chain.service
 * @see jQuery.Chain.extend
 */ 

$.Chain.service('item', {
	/**
	 * Initializer. Executed once at the first time @item@ invoked.
	 * 
	 * @alias jQuery.Chain.services.item.init
	 * 
	 * @see jQuery.Chain.service
	 */ 
	init: function()
	{
		this.isActive = false;
		this.isBuilt = false;
		this.root = this.element;
		this.data = false;
		this.datafn = this.dataHandler;
	},
	
	/**
	 * Default handler.
	 * 
	 * @alias jQuery.Chain.services.item.handler
	 * 
	 * @param {Object} obj Object to be handled
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.service
	 * @see jQuery.Chain.services.item.handleObject
	 * @see jQuery.Chain.services.item.handleFunction
	 * @see jQuery.Chain.services.item.handleDefault
	 */ 
	handler: function(obj)
	{
		if(typeof obj == 'object')
			{return this.handleObject(obj);}
		else if(typeof obj == 'function')
			{return this.handleFunction(obj);}
		else
			{return this.handleDefault();}
	},
	
	/**
	 * Edit/Bind Item.
	 * If no Object defined, it will bind the object to the Item, otherwise
	 * it will alter the object using the provided object.
	 * 
	 * @alias item(object)
	 * @alias jQuery.Chain.services.item.handleObject
	 * 
	 * @param {Object} obj Object to be inserted
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @example
	 * $('#element').item({name:'Rizqi', country:'Germany'});
	 * $('#element').item({country:'Indonesia'});
	 * $('#element').item(); // Returns {name:'Rizqi', country:'Indonesia'}
	 * 
	 * @see jQuery.Chain.services.item.handler
	 */ 
	handleObject: function(obj)
	{
		this.setData(obj);
		this.isActive = true;
		this.update();
		
		return this.element;
	},
	
	/**
	 * Add setter and getter to item.
	 * This function will change the way @item(object)@ and @item()@ works.
	 * 
	 * @alias item(fn)
	 * @alias jQuery.Chain.services.item.handleFunction
	 * 
	 * @param {Function} fn Getter&Setter Function
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @example
	 * $(element).item(function(oldval, newval){
	 * 		//setter
	 * 		if(newval)
	 * 			return $.extend(oldval, newval);
	 * 		//getter
	 *		else
	 * 			return oldval;
	 * })
	 */ 
	handleFunction: function(fn)
	{
		// datafn stores the getter/setter function
		this.datafn = fn;
		
		return this.element;
	},
	
	/**
	 * Get Data if no argument passed.
	 * 
	 * @alias item()
	 * @alias jQuery.Chain.services.item.handleDefault
	 * 
	 * @return {Object, Boolean} Returns Data Object if exist, otherwise false
	 */ 
	handleDefault: function()
	{
		if(this.isActive)
			{return this.getData();}
		else
			{return false;}
	},
	
	/**
	 * Data Getter Wrapper Function
	 * 
	 * @alias jQuery.Chain.services.item.getData
	 * 
	 * @return {Object} data
	 */ 
	getData: function()
	{
		// Call Getter
		this.data = this.datafn.call(this.element, this.data);
		
		return this.data;
	},
	
	/**
	 * Data Setter Wrapper Function
	 * 
	 * @alias jQuery.Chain.services.item.setData
	 */ 
	setData: function(obj)
	{
		var data;
		
		// Determine whether object is a jQuery object or a data object
		if($.Chain.jobject(obj) && obj.item())
			{data = $.extend({}, obj.item());}
		else if($.Chain.jobject(obj))
			{data = {};}
		else
			{data = obj;}
		
		// Call Setter
		this.data = this.datafn.call(this.element, this.data || data, data);
		
		// Handle Linked Element
		if(this.linkElement && this.linkElement[0] != obj[0])
		{
			var el = this.linkFunction();
			if($.Chain.jobject(el) && el.length && el.item())
				{el.item(this.data);}
		}
	},
	
	/**
	 * Default Getter/Setter
	 * 
	 * @alias jQuery.Chain.services.item.dataHandler
	 * 
	 * @param {Object} oldval Old value
	 * @param {Object} newval New Value
	 * 
	 * @return {Object} returns data value
	 */ 
	dataHandler: function(oldval, newval)
	{
		if(arguments.length == 2)
			{return $.extend(oldval, newval);}
		else
			{return oldval;}
	},
	
	/**
	 * Update element. Wrapper for @jQuery.Chain.services.item.element.update@
	 * 
	 * @alias jQuery.Chain.services.item.update
	 * 
	 * @return {Object} jQuery Object
	 */ 
	update: function()
	{
		return this.element.update();
	},
	
	/**
	 * Build item, apply builder and plugins
	 * 
	 * @alias jQuery.Chain.services.item.build
	 * 
	 * @see jQuery.Chain.services.item.$update
	 */ 
	build: function()
	{
		// IE Fix
		var fix = this.element.chain('template', 'raw').replace(/jQuery\d+\=\"null\"/gi, "");
		this.element.chain('anchor').html(fix);
		
		// If item has root (items)
		if(!$.Chain.jidentic(this.root, this.element))
		{
			// Get plugin from root and apply them
			var plugins = this.root.chain('plugin');
			for(var i in plugins)
			{
				plugins[i].apply(this.element, [this.root]);
			}
			
		}
		
		// Apply builder
		this.element.chain('builder').apply(this.element, [this.root]);
		this.isBuilt = true;
	},
	
	/**
	 * Item Updater, called within @$(element).update()@
	 * 
	 * @alias item('update')
	 * @alias jQuery.Chain.services.item.$update
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$update: function()
	{
		if(this.element.chain('active') && this.isActive && !this.isBuilt && this.getData())
			{this.build();}
		
		return this.element;
	},
	
	/**
	 * Replace Data with new data
	 * 
	 * @alias item('replace')
	 * @alias jQuery.Chain.services.item.$replace
	 * 
	 * @param {Object} obj Data Object
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @example
	 * $(element).item('replace', data);
	 */ 
	$replace: function(obj)
	{
		this.data = {};
		this.setData(obj);
		this.isActive = true;
		this.update();
		return this.element;
	},
	
	/**
	 * Remove Item And destroy it.
	 * 
	 * @alias item('remove')
	 * @alias jQuery.Chain.services.item.$remove
	 * 
	 * @param {Boolean} noupdate If true it won't update the root element
	 */ 
	$remove: function(noupdate)
	{
		// Destroy And Remove
		this.element.chain('destroy');
		this.element.remove();
		this.element.item('link', null);
		this.element.item('destroy');
		
		// Update root under certain circumtances
		if(!$.Chain.jidentic(this.root, this.element) && !noupdate)
			{this.root.update();}
	},
	
	/**
	 * Check Status of @item@
	 * 
	 * @alias item('active')
	 * @alias jQuery.Chain.services.item.$active
	 * 
	 * @return {Boolean} Status
	 */ 
	$active: function()
	{
		return this.isActive;
	},
	
	/**
	 * Get/Set Root element.
	 * 
	 * @alias item('root');
	 * @alias jQuery.Chain.services.item.$root
	 * 
	 * @param {Object} root New Root element
	 * 
	 * @return {Object} If a new root passed, it will be item Element. Otherwise current root.
	 */ 
	$root: function(root)
	{
		if(arguments.length)
		{
			this.root = root;
			this.update();
			return this.element;
		}
		else
		{
			return this.root;
		}
	},
	
	/**
	 * Backup Item to the state before being built.
	 * 
	 * @alias item('backup')
	 * @alias jQuery.Chain.services.item.$backup
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$backup: function()
	{
		this.isBuilt = false;
		
		return this.element;
	},
	
	/**
	 * Bind Item to other (chained) element. If one of them is updated,
	 * the linked element will be updated.
	 * 
	 * @alias item('link')
	 * @alias jQuery.Chain.services.item.$link
	 * 
	 * @param {Object} element element/selector to be linked with
	 * @param {String} collection Collection to be linked with (has to be @"self"@ if linked to item)
	 * 
	 * @return {Object} jQuery Element
	 * 
	 * @see jQuery.Chain.services.items.collection
	 */ 
	$link: function(element, collection)
	{
		// If there are previous linkElement
		if(this.linkElement)
		{
			this.linkElement.unbind('update', this.linkUpdater);
			this.linkElement = null;
		}
		
		element = $(element);
		if(element.length)
		{
			var self = this;
			this.isActive = true;
			this.linkElement = element;
			// Function that get the linked item.
			this.linkFunction = function()
			{
				if(typeof collection == 'function')
				{
					try{
						return collection.call(self.element, self.linkElement);
					}catch(e){
						return $().eq(-1);
					}
				}
				else if(typeof collection == 'string')
				{
					return self.linkElement.items('collection', collection);
				}
				else
				{
					return $().eq(-1);
				}
			};
			
			// Watch linked element for update, and trigger update in self
			this.linkUpdater = function()
			{
				var res = self.linkFunction();
				if(res && res.length)
					{self.element.item(res);}
			};
			
			this.linkElement.bind('update', this.linkUpdater);
			this.linkUpdater();
		}
		
		return this.element;
	},
	
	/**
	 * Destroy item service.
	 * 
	 * @alias item('destroy')
	 * @alias jQuery.Chain.services.item.$destroy
	 * 
	 * @return {Object} jQuery Element
	 */ 
	$destroy: function()
	{
		return this.element;
	}
});

})(jQuery);

/* items.js */
/**
 * Chain Items Service.
 * Method to bind items to object.
 * 
 * @alias items
 * 
 * @syntax $(selector).items(parameters);
 */ 

(function($){

/**
 * Chain Items Manager - Providing methods of @items@.
 * All method listed here can only be used internally
 * using @jQuery.Chain.service@ or @jQuery.Chain.extend@
 * 
 * @namespace
 * 
 * @alias jQuery.Chain.services.items
 * 
 * @see jQuery.Chain.service
 * @see jQuery.Chain.extend
 */ 

$.Chain.service('items', {
	/**
	 * Collection of Function for getting items
	 * 
	 * @namespace
	 * @alias jQuery.Chain.services.items.collections
	 * 
	 * @see jQuery.Chain.services.items.collection
	 */ 
	collections: 
	{
		/**
		 * Get all items, including hidden
		 * 
		 * @alias jQuery.Chain.services.items.collections.all
		 * 
		 * @return {Object} jQuery Object containing items
		 */ 
		all: function()
		{
			return this.element.chain('anchor').children('.chain-item');
		},
		
		/**
		 * Get all visible items
		 * 
		 * @alias jQuery.Chain.services.items.collections.visible
		 * 
		 * @return {Object} jQuery Object containing items
		 */ 
		visible: function()
		{
			return this.element.chain('anchor').children('.chain-item:visible');
		},
		
		/**
		 * Get all hidden items
		 * 
		 * @alias jQuery.Chain.services.items.collections.hidden
		 * 
		 * @return {Object} jQuery Object containing items
		 */ 
		hidden: function()
		{
			return this.element.chain('anchor').children('.chain-item:hidden');
		},
		
		/**
		 * Get self
		 * 
		 * @alias jQuery.Chain.services.items.collections.self
		 * 
		 * @return {Object} jQuery Object of the element
		 */ 
		self: function()
		{
			return this.element;
		}
	},
	
	/**
	 * Initializer. Executed once at the first time @items@ invoked.
	 * 
	 * @alias jQuery.Chain.services.items.init
	 * 
	 * @see jQuery.Chain.service
	 */ 
	init: function()
	{
		this.isActive = false;
		this.pushBuffer = [];
		this.shiftBuffer = [];
		this.collections = $.extend({}, this.collections);
	},
	
	/**
	 * Default handler.
	 * 
	 * @alias jQuery.Chain.services.items.handler
	 * 
	 * @param {Object} obj Object to be handled
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.service
	 * @see jQuery.Chain.services.items.handleObject
	 * @see jQuery.Chain.services.items.handleElement
	 * @see jQuery.Chain.services.items.handleArray
	 * @see jQuery.Chain.services.items.handleNumber
	 * @see jQuery.Chain.services.items.handleTrue
	 * @see jQuery.Chain.services.items.handleDefault
	 */ 
	handler: function(obj)
	{
		// Array
		if(obj instanceof Array)
			{return this.handleArray(obj);}
		// Inactive
		else if(!this.isActive)
			{return $().eq(-1);}
		// jQuery Object
		else if($.Chain.jobject(obj))
			{return this.handleElement(obj);}
		// Normal Object
		else if(typeof obj == 'object')
			{return this.handleObject(obj);}
		// Number
		else if(typeof obj == 'number')
			{return this.handleNumber(obj);}
		// True
		else if(obj === true)
			{return this.handleTrue();}
		// Default
		else
			{return this.handleDefault();}
	},
	
	/**
	 * If a Data Object is given, it will return the item element
	 * containing the object if it exists, otherwise empty.
	 * 
	 * @alias items(object)
	 * @alias jQuery.Chain.services.items.handleObject
	 * 
	 * @param {Object} obj Data Object
	 * 
	 * @return {Object} jQuery Object
	 */ 
	handleObject: function(obj)
	{
		// Get Element By Data
		return this.collection('all').filter(function(){return $(this).item() == obj;});
	},
	
	/**
	 * If a jQuery Element is given, it will return itself if it is part of the items,
	 * otherwise empty jQuery object.
	 * 
	 * @alias items(element)
	 * @alias jQuery.Chain.services.items.handleElement
	 * 
	 * @param {Object} obj jQuery Object
	 * 
	 * @return {Object} jQuery Object
	 */ 
	handleElement: function(obj)
	{
		// Check element whether it is part of items or not.
		if(!$.Chain.jidentic(obj, obj.item('root')) && $.Chain.jidentic(this.element, obj.item('root')))
			{return obj;}
		else
			{return $().eq(-1);}
	},
	
	/**
	 * If array is given, it will merge it to current items
	 * 
	 * @alias items(array)
	 * @alias jQuery.Chain.services.items.handleArray
	 * 
	 * @param {Array} array Array of Data
	 * 
	 * @return {Object} jQuery Object
	 */ 
	handleArray: function(array)
	{
		// Array will be merged in
		return this.$merge(array);
	},
	
	/**
	 * If number is given, it will get the object with the current number. Use -1 to get the last number.
	 * 
	 * @alias items(number)
	 * @alias jQuery.Chain.services.items.handleNumber
	 * 
	 * @param {Number} number Index
	 * 
	 * @return {Object} jQuery Object
	 */ 
	handleNumber: function(number)
	{
		// if -1, it will get the last.
		if(number == -1)
			{return this.collection('visible').filter(':last');}
		else
			{return this.collection('visible').eq(number);}
	},
	
	/**
	 * If @true@ is given, it will get all items including the hidden one.
	 * 
	 * @alias items(true)
	 * @alias jQuery.Chain.services.items.handleTrue
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.services.items.collections.all
	 */ 
	handleTrue: function()
	{
		return this.collection('all');
	},
	
	/**
	 * If nothing is given, it will get all visible items.
	 * 
	 * @alias items(true)
	 * @alias jQuery.Chain.services.items.handleTrue
	 * 
	 * @return {Object} jQuery Object
	 * 
	 * @see jQuery.Chain.services.items.collections.visible
	 */ 
	handleDefault: function()
	{
		return this.collection('visible');
	},
	
	/**
	 * Update element
	 * 
	 * @alias jQuery.Chain.services.items.update
	 */ 
	update: function()
	{
		this.element.update();
	},
	
	/**
	 * Clear all items
	 * 
	 * @alias jQuery.Chain.services.items.empty
	 */ 
	empty: function()
	{
		var all = this.collection('all');
		
		// Remove items
		// Make it run in the background. for responsiveness.
		setTimeout(function(){all.each(function(){$(this).item('remove', true);});}, 1);
		
		// Empty anchor container
		this.element.chain('anchor').empty();
	},
	
	/**
	 * Get collection of items. Define a collection by adding a function argument
	 * 
	 * @alias jQuery.Chain.services.items.collection
	 * 
	 * @param {String} col Collection name
	 * @param {Function} fn Create a collection function
	 * 
	 * @return {Object} jQuery Object
	 */ 
	collection: function(col, fn)
	{
		if(arguments.length > 1)
		{
			if(typeof fn == 'function')
				{this.collections[col] = fn;}
			
			return this.element;
		}
		else
		{
			if(this.collections[col])
				{return this.collections[col].apply(this);}
			else
				{return $().eq(-1);}
		}
		
	},
	
	/**
	 * Items Updater, called by @$(element).update()@
	 * 
	 * @alias items('update')
	 * @alias jQuery.Chain.services.items.$update
	 * 
	 * @return {Object} jQuery Element
	 */ 
	$update: function()
	{
		if(!this.element.chain('active') || !this.isActive)
			{return this.element;}
		
		var self = this;
		var builder = this.element.chain('builder');
		var template = this.element.chain('template');
		var push;
		
		var iterator = function(){
			var clone = template
				.clone()[push ? 'appendTo' :'prependTo'](self.element.chain('anchor'))
				.addClass('chain-item')
				.item('root', self.element);
			
			if(self.linkElement && $.Chain.jobject(this) && this.item())
				{clone.item('link', this, 'self');}
			else
				{clone.item(this);}
			
			clone.chain(builder, true);
		};
		
		push = false;
		$.each(this.shiftBuffer, iterator);
		push = true;
		$.each(this.pushBuffer, iterator);
		
		
		this.shiftBuffer = [];
		this.pushBuffer = [];
		
		return this.element;
	},
	
	/**
	 * Add item(s). use @items('add', 'shift', item)@ to add item at the top
	 * 
	 * @alias items('add')
	 * @alias jQuery.Chain.services.items.$add
	 * 
	 * @param {Object} item
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$add: function()
	{
		if(this.linkElement)
			{return this.element;}
		
		var cmd;
		var args = Array.prototype.slice.call(arguments);
		// Extract command
		if(typeof args[0] == 'string')
			{cmd = args.shift();}
		
		var buffer = (cmd == 'shift') ? 'shiftBuffer' : 'pushBuffer';
		
		this.isActive = true;
		this[buffer] = this[buffer].concat(args);
		this.update();
		
		return this.element;
	},
	
	/**
	 * Merge items with array of item data
	 * 
	 * @alias items('merge')
	 * @alias jQuery.Chain.services.items.$merge
	 * 
	 * @param {String} cmd Switch for push/shift
	 * @param {Array} items Item Data
	 * 
	 * @return {Object} jQuery Element
	 */ 
	$merge: function(cmd, items)
	{
		if(this.linkElement)
			{return this.element;}
		
		if(typeof cmd != 'string')
			{items = cmd;}
		var buffer = (cmd == 'shift') ? 'shiftBuffer' : 'pushBuffer';
		
		this.isActive = true;
		if($.Chain.jobject(items))
			{this[buffer] = this[buffer].concat(items.map(function(){return $(this);}).get());}
		else if(items instanceof Array)
			{this[buffer] = this[buffer].concat(items);}
		this.update();
		
		return this.element;
	},
	
	/**
	 * Replace items with new items array
	 * 
	 * @alias items('replace')
	 * @alias jQuery.Chain.services.items.$replace
	 * 
	 * @param {String} cmd Switch for push/shift
	 * @param {Array} items Item Data
	 * 
	 * @return {Object} jQuery Element
	 */ 
	$replace: function(cmd, items)
	{
		if(this.linkElement && arguments.callee.caller != this.linkUpdater)
			{return this.element;}
		
		if(typeof cmd != 'string')
			{items = cmd;}
		var buffer = (cmd == 'shift') ? 'shiftBuffer' : 'pushBuffer';
		
		this.isActive = true;
		this.empty();
		
		if($.Chain.jobject(items))
			{this[buffer] = items.map(function(){return $(this);}).get();}
		else if(items instanceof Array)
			{this[buffer] = items;}
		
		this.update();
		
		return this.element;
	},
	
	/**
	 * Remove item
	 * 
	 * @alias items('remove')
	 * @alias jQuery.Chain.services.items.$remove
	 * 
	 * @param {Object, Number} item
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$remove: function()
	{
		if(this.linkElement)
			{return this.element;}
		
		for(var i=0; i<arguments.length; i++)
			{this.handler(arguments[i]).item('remove', true);}
		this.update();
		
		return this.element;
	},
	
	/**
	 * Reorder Item
	 * 
	 * @alias items('reorder')
	 * @alias jQuery.Chain.services.items.$reorder
	 * 
	 * @param {Object} item1 Item 1
	 * @param {Object} item2 Item 2
	 * 
	 * @return {Object} jQuery object
	 */ 
	$reorder: function(item1, item2)
	{
		if(item2)
			{this.handler(item1).before(this.handler(item2));}
		else
			{this.handler(item1).appendTo(this.element.chain('anchor'));}
		this.update();
		
		return this.element;
	},
	
	/**
	 * Clear all items
	 * 
	 * @alias items('empty')
	 * @alias jQuery.Chain.services.items.$empty
	 * 
	 * @return {Object} jQuery object
	 */ 
	$empty: function()
	{
		if(this.linkElement)
			{return this.element;}
		
		this.empty();
		this.shiftBuffer = [];
		this.pushBuffer = [];
		this.update();
		
		return this.element;
	},
	
	/**
	 * Like @items()@ but returns array of data instead of the jQuery object.
	 * 
	 * @alias items('data')
	 * @alias jQuery.Chain.services.items.$data
	 * 
	 * @return {Array} list of data
	 */ 
	$data: function(x)
	{
		return this.handler(x).map(function(){return $(this).item();}).get();
	},
	
	/**
	 * Bind Items to other (chained) element. If one of them is updated,
	 * the linked element will be updated.
	 * 
	 * @alias items('link')
	 * @alias jQuery.Chain.services.items.$link
	 * 
	 * @param {Object} element element/selector to be linked with
	 * @param {String} collection Collection to be linked with (has to be @"self"@ if linked to item)
	 * 
	 * @return {Object} jQuery Element
	 * 
	 * @see jQuery.Chain.services.items.collection
	 */ 
	$link: function(element, collection)
	{
		// Remove linked element if it already exist
		if(this.linkElement)
		{
			this.linkElement.unbind('update', this.linkUpdater);
			this.linkElement = null;
		}
		
		element = $(element);
		// If element exists
		if(element.length)
		{
			var self = this;
			this.linkElement = element;
			// Create Collector Function
			this.linkFunction = function()
			{
				if(typeof collection == 'function')
				{
					try{
						return collection.call(self.element, self.linkElement);
					}catch(e){
						return $().eq(-1);
					}
				}
				else if(typeof collection == 'string')
				{
					return self.linkElement.items('collection', collection);
				}
				else
				{
					return $().eq(-1);
				}
			};
			
			// Create Updater Function
			this.linkUpdater = function()
			{
				self.$replace(self.linkFunction());
			};
			
			// Bind updater to linked element
			this.linkElement.bind('update', this.linkUpdater);
			this.linkUpdater();
		}
		
		return this.element;
	},
	
	/**
	 * Get index of an Item
	 * 
	 * @alias items('index')
	 * @alias jQuery.Chain.services.items.$index
	 * 
	 * @param {Object} item
	 * 
	 * @return {Number} index
	 */ 
	$index: function(item)
	{
		return this.collection('all').index(this.handler(item));
	},
	
	/**
	 * Get collection of items. Define a collection by adding a function argument
	 * 
	 * @alias items('collection')
	 * @alias jQuery.Chain.services.items.$collection
	 * 
	 * @param {String} col Collection name
	 * @param {Function} fn Create a collection function
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$collection: function()
	{
		return this.collection.apply(this, Array.prototype.slice.call(arguments));
	},
	
	/**
	 * Check Status of @items@
	 * 
	 * @alias items('active')
	 * @alias jQuery.Chain.services.items.$active
	 * 
	 * @return {Boolean} Status
	 */ 
	$active: function()
	{
		return this.isActive;
	},
	
	/**
	 * Backup Item to the state before being built.
	 * 
	 * @alias items('backup')
	 * @alias jQuery.Chain.services.items.$backup
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$backup: function()
	{
		if(!this.element.chain('active') || !this.isActive)
			{return this.element;}
		
		var buffer = [];
		this.collection('all').each(function(){
			var item = $(this).item();
			if(item)
				{buffer.push(item);}
		});
		
		this.pushBuffer = buffer.concat(this.pushBuffer);
		
		this.empty();
		
		return this.element;
	},
	
	/**
	 * Destroy items service.
	 * 
	 * @alias items('destroy')
	 * @alias jQuery.Chain.services.items.$destroy
	 * 
	 * @return {Object} jQuery Element
	 */ 
	$destroy: function()
	{
		this.empty();
		return this.element;
	}
});

// Filtering extension
$.Chain.extend('items', {
	/**
	 * Filtering subroutine
	 * 
	 * @alias jQuery.Chain.services.items.doFilter
	 */ 
	doFilter: function()
	{
		var props = this.searchProperties;
		var text = this.searchText;
		
		if(text)
		{
			// Make text lowerCase if it is a string
			if(typeof text == 'string')
				{text = text.toLowerCase();}
			
			// Filter items
			var items = this.element.items(true).filter(function(){
				var data = $(this).item();
				// If search properties is defined, search for text in those properties
				if(props)
				{
					for(var i=0; i<props.length; i++)
					{
						if(typeof data[props[i]] == 'string'
							&& !!(typeof text == 'string' ? data[props[i]].toLowerCase() : data[props[i]]).match(text))
							{return true;}
					}
				}
				// Otherwise search in all properties
				else
				{
					for(var prop in data)
					{
						if(typeof data[prop] == 'string'
							&& !!(typeof text == 'string' ? data[prop].toLowerCase() : data[prop]).match(text))
							{return true;}
					}
				}
			});
			this.element.items(true).not(items).hide();
			items.show();
		}
		else
		{
			this.element.items(true).show();
			this.element.unbind('preupdate', this.searchBinding);
			this.searchBinding = null;
		}
	},
	
	/**
	 * Filter items by criteria. Filtered items will be hidden.
	 * 
	 * @alias items('filter')
	 * @alias jQuery.Chain.services.items.$filter
	 * 
	 * @param {String, RegExp} text Search keyword
	 * @param {String, Array} properties Search properties
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$filter: function(text, properties)
	{
		// If no argument, just refilter
		if(!arguments.length)
			{return this.update();}
		
		this.searchText = text;
		
		if(typeof properties == 'string')
			{this.searchProperties = [properties];}
		else if(properties instanceof Array)
			{this.searchProperties = properties;}
		else
			{this.searchProperties = null;}
		
		// Bind to preupdate
		if(!this.searchBinding)
		{
			var self = this;
			this.searchBinding = function(event, item){self.doFilter();};
			this.element.bind('preupdate', this.searchBinding);
		}
		
		return this.update();
	}
});

// Sorting extension
$.Chain.extend('items', {
	/**
	 * Sorting subroutine
	 * 
	 * @alias jQuery.Chain.services.items.doSort
	 */ 
	doSort: function()
	{
		var name = this.sortName;
		var opt = this.sortOpt;
		
		var sorter = 
		{
			'number': function(a, b){
				return parseFloat(($(a).item()[name]+'').match(/\d+/gi)[0])
					- parseFloat(($(b).item()[name]+'').match(/\d+/gi)[0]);
			},
		
			'default': function(a, b){
				return $(a).item()[name] > $(b).item()[name] ? 1 : -1;
			}
		};
		
		if(name)
		{
			var sortfn = opt.fn || sorter[opt.type] || sorter['default'];
				
			var array = this.element.items(true).get().sort(sortfn);
			
			array = opt.desc ? array.reverse() : array;
			
			for(var i=0; i<array.length; i++)
				{this.element.chain('anchor').append(array[i]);}
			
			opt.desc = opt.toggle ? !opt.desc : opt.desc;
		}
		else
		{
			this.element.unbind('preupdate', this.sortBinding);
			this.sortBinding = null;
		}
	},
	
	/**
	 * Sort items by property.
	 * 
	 * @alias items('sort')
	 * @alias jQuery.Chain.services.items.$sort
	 * 
	 * @param {String} name sorting property
	 * @param {Object} opt {toggle:true/false, desc:true/false, type:'number/default'}
	 * 
	 * @return {Object} jQuery Object
	 */ 
	$sort: function(name, opt)
	{
		if(!name && name !== null && name !== false)
			{return this.update();}
		
		if(this.sortName != name)
			{this.sortOpt = $.extend({desc:false, type:'default', toggle:false}, opt);}
		else
			{$.extend(this.sortOpt, opt);}
		
		this.sortName = name;
		
		if(!this.sortBinding)
		{
			var self = this;
			this.sortBinding = function(event, item){self.doSort();};
			this.element.bind('preupdate', this.sortBinding);
		}
		
		return this.update();
	}
});
	
})(jQuery);
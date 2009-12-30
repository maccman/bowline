/*
  Bowline JavaScript API
  
  This library lets you call Ruby methods, and bind up elements.
  It requires jQuery, Chain.js and json2:
    http://jquery.com
    http://github.com/raid-ox/chain.js
    http://www.JSON.org/json2.js
  
  = Functions
  
  invoke(klass, method, *args)
    Invoke a class method on a particular class. Usually
    used to invoke methods on a binder. The class needs to
    be exposed to JS (using the Bowline::Desktop::Bridge#js_expose).
    Usage: 
      Bowline.invoke('MyClass', 'my_method');
  
  instanceInvoke(klass, id, method, *args)
    Invoke an instance method an a binder.
    Usually called via the jQuery helper functions.
    Usage: 
      Bowline.instanceInvoke('UsersBinder', 1, 'charge!');
    
  windowInvoke(method, *args)
    Invoke class method on this window's class.
    Usage:
      Bowline.windowInvoke('close');
    
  helper(method, *args)
    Invoke a method defined in any helper.
    
  bind(element, klass, options = {})
    Bind a element to a Bowline binder. 
    Usually called via the jQuery helper functions.
    Usage:
      Bowline.bind('#users', 'UsersBinder');
    
    The options can either be a template hash:
        {
      		'.name .first': {
      			style: 'color: blue;',
      			content: 'First Name: {first}'
      		},
      		'.name .last': 'Family Name: {last}',
      		'.address': function(data, el){
      			if(!data.address)
      				el.hide();
      			return data.address;
      		},
      		builder: function(){
      			var data = this.item();
      			this.find('.name').click(function(){alert(data.name)});
      		}
      	}
      	
    Or the options can be a builder function:    	
      	(function(){
          this.bind('click', function(){
        	var data = this.item();
        	alert(data);
        })
        
    For more documentation, look at the Chain.js library:
      http://wiki.github.com/raid-ox/chain.js/elementchain
      
  = Filtering items
  
    $('#users').items('filter', 'value');
  
  = Sorting items
    
    $('#users').items('sort', 'first_name');
  
  = Update events
  
    $('#users').update(function(){
      //...
    });
  
  = JQuery functions
  
  These are how you usually bind elements, or invoke a binders class/instance methods.
  
  $.fn.bowlineBind(klass, options)
    Associate an an element with a Bowline binder.
    Example:
      $("#users").bowlineBind('UsersBinder');

  $.fn.bowlineUnbind(klass)
    Opposite of bowlineBind.
    Example:
      $("#users").bowlineUnbind('UsersBinder');
          
  $.fn.invoke(method, *args)
    Invoke a class/instance method on a Bowline binder. 
    
    If called on the bound element, in this example the #users div, then a class method 
    will be called on the binder.
    Example:
      $("#users").invoke("my_class_method", "arg1");
            
    If called on a item inside a bound element, an instance method will be called.
    Example:
      $("#users").items(10).invoke("my_instance_method");
      
  = Debugging
  
  Turn on Bowline.trace to show debugging information:
    Bowline.trace = true
  
  = Using other libraries (e.g. Prototype)
  
  Although this library requires jQuery, its API is not jQuery
  specific. It's perfectly feasible to rewrite to use Prototype instead.
  Additionally, jQuery plays nicely with other libraries using it's noConflict() method. 
  So you're still free to use other JavaScript libraries without fear of conflicts.

*/

var Bowline = {
  callbacks: {},
  uuid: 0,
  bounds: {},
  trace: false,
  
  id: function(){
    return ++Bowline.uuid;
  },
  
  // Usage: invoke(klass, method, *args)
  invoke: function(){
    var args    = jQuery.makeArray(arguments);
    var klass   = args.shift();
    var method  = args.shift();
    var id      = -1;
    
    var callback  = args.pop();
    if(typeof(callback) == "function"){
      id = Bowline.id();
      Bowline.callbacks[id] = callback;
    } else if(callback) {
      args.push(callback);
    }
    
    var msg = {
      klass:  klass, 
      method: method, 
      args:   args, 
      id:     id,
    };

    Bowline.log("New message:", msg)
    
    // wx is a function defined in Objective C
    if(typeof(wx) != undefined){
      try {
        wx.call(JSON.stringify(msg));
      } catch(e) {} // Quash ReferenceErrors
    }
  },
  
  // Usage: instanceInvoke(klass, id, method, *args)
  instanceInvoke: function(){
    var args = jQuery.makeArray(arguments);
    args.splice(1, 0, "instance_invoke");
    Bowline.invoke.apply(this, args);
  },
  
  // Usage: windowInvoke(method, *args)
  windowInvoke: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("_window");
    Bowline.invoke.apply(this, args);    
  },
  
  helper: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("Helper");
    Bowline.invoke.apply(this, args);
  },
  
  bind: function(el, klass, options){
    el = jQuery(el);
    el.chain(options);
    el.data('bowline', klass);
    if(!Bowline.bounds[klass]) 
      Bowline.bounds[klass] = [];
    Bowline.bounds[klass].push(el);
    jQuery(function(){
      Bowline.invoke(klass, "setup", function(res){
        Bowline.populate(klass, res);
      });
    });
  },
  
  unbind: function(el, klass){
    var array = Bowline.bounds[klass]
    if(!array) return;
    array = jQuery.grep(array, 
      function(n){ return n != el }
    );
    Bowline.bounds[klass] = array;
  },
  
  // Bowline functions
  
  invokeJS: function(str){
    Bowline.log("Invoking:", str);
    return JSON.stringify(eval(str));
  },
  
  invokeCallback: function(id, res){
    Bowline.log("Callback:", id, res);
    if(!Bowline.callbacks[id]) return true;
    try {
      Bowline.callbacks[id](JSON.parse(res));
      delete Bowline.callbacks[id];
    } catch(e) { 
      Bowline.log(e) 
    }
    return true;
  },
  
  populate: function(klass, items){
    if(!Bowline.bounds[klass]) return true;
    jQuery.each(Bowline.bounds[klass], function(){
      this.items('replace', items);
    });
    return true;
  },
  
  created: function(klass, id, item){
    if(!Bowline.bounds[klass]) return true;
    if(!item.id) item.id = id;
    jQuery.each(Bowline.bounds[klass], function(){
      this.items('add', item);
    });
    return true;
  },
  
  updated: function(klass, id, item){
    if(!Bowline.bounds[klass]) return true;
    if(!item.id) item.id = id;
    jQuery.each(Bowline.bounds[klass], function(){
      Bowline.findItem(this, id).item('replace', item);
    });
    return true;
  },
  
  removed: function(klass, id){
    if(!Bowline.bounds[klass]) return true;
    jQuery.each(Bowline.bounds[klass], function(){
      Bowline.findItem(this, id).item('remove');
    });
    return true;
  },
  
  trigger: function(klass, event, data){
    if(!Bowline.bounds[klass]) return true;
    jQuery.each(Bowline.bounds[klass], function(){
      this.trigger(event, data);
    });
    return true;
  },
  
  element: function(klass, id){
    var el = jQuery();
    jQuery.each(Bowline.bounds[klass], function(){
      el = el.add(findItem(this, id));
    });
    return el;
  },
  
  // System functions
  
  loaded: function(){    
    Bowline.windowInvoke("loaded!");
  },
  
  findItem: function(el, id){
    var items = jQuery.grep(el.items(true), function(n, i){
      return jQuery(n).item().id == id;
    });
    return(jQuery(items[0]));
  },
  
  log: function(){
    if( !Bowline.trace ) return;
    var args = jQuery.makeArray(arguments);
    args.unshift("(Bowline)");
    console.log.apply(console, args);
  },
  
  warn: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("(Bowline)");
    console.warn.apply(console, args);
  }
};

(function($){
  $.fn.invoke = function(){
    if($(this).chain('active')){
      var args = $.makeArray(arguments);
      if($(this).data('bowline')){
        // Class method
        var klass = $(this).data('bowline');
        args.unshift(klass);
        Bowline.invoke.apply(Bowline, args);
      } else {
        // Instance method
        var klass = $(this).item('root').data('bowline');
        var id = $(this).item().id;
        args.unshift(id);
        args.unshift(klass);
        Bowline.instanceInvoke.apply(Bowline, args);
      }
    } else {
      throw 'Chain not active';
    }
  };
    
  $.fn.bowlineBind = function(){
    var args = $.makeArray(arguments);
    args.unshift(this);
    Bowline.bind.apply(Bowline, args);
  };
  
  $.fn.bowlineUnbind = function(){
    var args = $.makeArray(arguments);
    args.unshift(this);
    Bowline.unbind.apply(Bowline, args);
  }  
})(jQuery);

jQuery(function($){
  Bowline.loaded();
})
var Bowline = new SuperClass();

Bowline.extend({
  callbacks: {},
  uuid: 0,
  bounds: {},
  trace: false,
  updating: false,
  // _app is a function defined in bowline-desktop
  enabled: typeof(_app) != "undefined",
  
  id: function(){
    return ++this.uuid;
  },
  
  // Usage: invoke(klass, method, *args)
  invoke: function(){
    if( this.updating ) return;
    var args    = jQuery.makeArray(arguments);
    var klass   = args.shift();
    var method  = args.shift();
    var id      = -1;
          
    var callback  = args.pop();
    if(typeof(callback) == "function"){
      id = this.id();
      this.callbacks[id] = callback;
    } else if(callback) {
      args.push(callback);
    }    
    
    var msg = {
      klass:  klass, 
      method: method, 
      args:   args, 
      id:     id,
    };    

    this.log("New message:", msg);
    
    // Support for SuperModel instances
    var serializer = function(key, value){
      if (value == null) return value;
      if (typeof value == "object" && 
          typeof value.attributes == "function"){
        return value.attributes();
      } else {
        return value;
      }
    };
    
    if(this.enabled)
      _app.call(JSON.stringify(msg, serializer));
  },
  
  // Usage: instanceInvoke(klass, id, method, *args)
  instanceInvoke: function(){
    var args = jQuery.makeArray(arguments);
    args.splice(1, 0, "instance_invoke");
    this.invoke.apply(this, args);
  },
  
  // Usage: windowInvoke(method, *args)
  windowInvoke: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("_window");
    this.invoke.apply(this, args);    
  },
  
  helper: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("Bowline::Helpers");
    this.invoke.apply(this, args);
  },
  
  openInspector: function(){
    if(this.enabled)
      _app.openInspector();
  },
  
  bind: function(klass, object, options){
    if ( !this.bounds[klass] ) {
      this.bounds[klass] = [];
      this.bounds[klass].push(object);
      this.invoke(klass, "setup");
    } else {
      this.bounds[klass].push(object);
    }
    if (object.isModel) 
      this.extendModel(klass, object, options);
  },
  
  // Bowline functions
  
  invokeJS: function(str){
    this.log("Invoking:", str);
    this.updating = true;
    var value;
    try {
      value = JSON.stringify(eval(str));
    } catch(e) {
      this.warn("Error at: " + e.sourceURL + ":" + e.line);
      this.warn(str);
      this.error(e);
    }
    this.updating = false;
    return value;
  },
  
  invokeCallback: function(id, res){
    this.log("Callback:", id, res);
    if(!this.callbacks[id]) return;
    try {
      this.callbacks[id](JSON.parse(res));
      delete this.callbacks[id];
    } catch(e) { 
      this.warn("Error at: " + e.sourceURL + ":" + e.line);
      this.error(e);
    }
  },
  
  replace: function(klass, items){
    if(!this.bounds[klass]) return;
    this.eachBound(klass, function(object){
      object.replace(items);
    });
  },
  
  created: function(klass, id, item){
    if(!this.bounds[klass]) return;
    this.eachBound(klass, function(object){
      object.create(item);
    });
  },
  
  updated: function(klass, id, item){
    if(!this.bounds[klass]) return;
    this.eachBound(klass, function(object){
      object.update(id, item);
    });
  },
  
  destroyed: function(klass, id){
    if(!this.bounds[klass]) return;
    this.eachBound(klass, function(object){
      object.destroy(id);
    });
  },
  
  // System functions
  
  eachBound: function(klass, callback){
    for(var i in this.bounds[klass]){
      callback(this.bounds[klass][i]);
    }
  },
  
  loaded: function(){    
    this.windowInvoke("loaded!");
  },
  
  extendModel: function(klass, object, options){
    var self = this;
    if ( !options ) options = {};
    
    if (options.duplex) {
      object.afterCreate(function(item){
        object.invoke("create", item);
      });
      
      object.afterUpdate(function(item){
        item.invoke("update", item);
      });
      
      object.afterDestroy(function(item){
        item.invoke("destroy");
      });
    }
  },
  
  log: function(){
    if( !this.trace ) return;
    var args = jQuery.makeArray(arguments);
    args.unshift("(Bowline)");
    console.log.apply(console, args);
  },
  
  warn: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("(Bowline)");
    console.warn.apply(console, args);
  },
  
  error: function(){
    var args = jQuery.makeArray(arguments);
    args.unshift("(Bowline)");
    console.error.apply(console, args);
  }
});

(function($){
  if (typeof SuperModel != "undefined") {
    SuperModel.extend({
      bind: function(klass, options){
        this.boundKlass = klass;
        Bowline.bind(this.boundKlass, this, options);
      },
      
      delegateInvoke: function(){
        var calls = jQuery.makeArray(arguments);
        var self  = this;
        jQuery.each(calls, function(i, item){
          self[item] = function(){
            var args = jQuery.makeArray(arguments);
            args.unshift(item);
            this.invoke.apply(this, args);
          }
        });
      },
      
      invoke: function(){
        var args = jQuery.makeArray(arguments);
        args.unshift(this.boundKlass);
        Bowline.invoke.apply(Bowline, args);
      }
    });
    
    SuperModel.fn.delegateInvoke = SuperModel.delegateInvoke;
    SuperModel.include({
      invoke: function(){
        var args = jQuery.makeArray(arguments);
        args.unshift(this.id);
        args.unshift(this._class.boundKlass);
        Bowline.instanceInvoke.apply(Bowline, args);
      }
    });
  }
  
  $.fn.bowlineSerialize = function(){
    var array  = $(this).serializeArray();
    var object = {};
    $.each(array, function(){
      object[this.name] = this.value;
    });
    return object;
  };
  
  $(function(){
    Bowline.loaded();
  });
})(jQuery);
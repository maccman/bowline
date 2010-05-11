var SuperClass = function(parent){  
  var result = function(){
    this.init.apply(this, arguments);
  };
  
  result.prototype.init  = function(){};
  
  if (parent){
    for(var i in parent){
      result[i] = SuperClass.clone(parent[i]);
    }
        
    for(var i in parent.prototype){
      result.prototype[i] = SuperClass.clone(parent.prototype[i]);
    }
    
    result.parent = parent;
    result.prototype.parent = parent.prototype;
    
    result._super = function(){
      var parent  = this.parent;
      
      var key     = this.findProperty(arguments.callee.caller);
      var method  = parent[key];
                  
      if (!method) return;
      
      var oldParent       = parent;
      var oldFindProperty = this.findProperty;
      
      // In case parent method calls super
      this.findProperty = $.proxy(this.findProperty, parent);
      this.parent       = parent.parent;
      var value         = method.apply(this, arguments);
      
      // Reset functions refs
      this.findProperty = oldFindProperty;
      this.parent       = oldParent;
      
      return value;
    };
    result.prototype._super = result._super;
  }

  result.fn = result.prototype;
  result.fn._class      = result;
    
  result.findProperty = function(val){
    for(var key in this)
      if(this[key] == val) return key;
  };
  result.fn.findProperty = result.findProperty;

  result.extend = function(obj){
    var extended = obj.extended;
    delete obj.extended;
    for(var i in obj){
      result[i] = obj[i];
    }
    
    if (extended) extended(result)
  };

  result.include = function(obj){
    var included = obj.included;
    delete obj.included;    
    for(var i in obj){
      result.fn[i] = obj[i];
    }
    
    if (included) included(result)
  };
  
  result.aliasMethod = function(newName, oldName){
    this[newName] = this[oldName];
  };
  result.fn.aliasMethod = result.aliasMethod;
  
  result.aliasMethodChain = function(method, name){
    this.aliasMethod(method + "Without" + name, method);
    this.aliasMethod(method, method + "With" + name);
  };
  result.fn.aliasMethodChain = result.aliasMethodChain;

  return result;
};

SuperClass.clone = function(obj){
  if (typeof obj == "function") return obj;
  if (typeof obj != "object") return obj;  
  if (jQuery.isArray(obj)) return jQuery.extend([], obj);
  return jQuery.extend({}, obj);
};
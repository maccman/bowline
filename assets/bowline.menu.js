var BowlineMenu = function(element, options){
  var defaults = {childSelector: "li", trace: false};
  this.options = jQuery.extend({}, defaults, options);
  
  this.element = jQuery(element);
  
  if(this.options.current) this.change(this.options.current);
    
  var self = this;
  this.elements().click(function(){
    var view = self.viewName(this);
    self.change(view);
  });
};

BowlineMenu.fn = BowlineMenu.prototype;

BowlineMenu.fn.log = function(){
  if( !this.options.trace ) return;
  var args = jQuery.makeArray(arguments);
  args.unshift("(BowlineMenu)");
  console.log.apply(console, args);
};

BowlineMenu.fn.onChange = function(func){
  this.element.bind("change.bowline", func);
};

BowlineMenu.fn.triggerChange = function(data){
  this.element.trigger("change.bowline", data);
};

BowlineMenu.fn.viewName = function(element){
  return jQuery(element).dataset("view");
};

BowlineMenu.fn.currentName = function(){
  return this.viewName(this.current);
};

BowlineMenu.fn.elements = function(){
  return this.element.find(this.options.childSelector);
};

BowlineMenu.fn.elementFor = function(name){
  return this.element.find(
    "[data-view='" + name + "']:first"
  );
};

BowlineMenu.fn.items = function(){
  var self = this;
  return jQuery.map(this.elements(), function(n){
    return self.viewName(n);
  });
};

BowlineMenu.fn.change = function(name){
  if(jQuery.inArray(name, this.items()) == -1) return false;
  
  if(name == this.currentName()) return;
    
  var fromView      = this.current;
  var fromViewName  = this.viewName(fromView);
  
  var toView        = this.elementFor(name);
  var toViewName    = name;
  
  this.log("changing:", fromViewName, toViewName);
  
  this.elements().removeClass("current");
  this.current = toView;
  toView.addClass("current");
  
  this.triggerChange({
    toView:       toView, 
    toViewName:   toViewName,
    fromView:     fromView,
    fromViewName: fromViewName
  });
};
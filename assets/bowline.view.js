// #view > *:not(.current) {
//   display: none;
// }

jQuery.support.WebKitAnimationEvent = (typeof WebKitTransitionEvent == "object");

var BowlineView = function(element, options){
  var defaults = {trace:false};
  this.options = jQuery.extend({}, defaults, options);
  
  if (this.options.preloadImages) {
    jQuery.each(this.options.preloadImages, function(e){
      (new Image()).src = e;
    });
  }
  
  this.element = jQuery(element);

  if(this.options.current){
    this.current = jQuery(this.options.current);
    this.current.addClass("current");
  }
};

BowlineView.fn = BowlineView.prototype;

BowlineView.fn.log = function(){
  if( !this.options.trace ) return;
  var args = jQuery.makeArray(arguments);
  args.unshift("(BowlineView)");
  console.log.apply(console, args);
};

BowlineView.fn.onChange = function(func){
  this.element.bind("change.bowline", func);
};

BowlineView.fn.triggerChange = function(data){
  this.element.trigger("change.bowline", data);
};

BowlineView.fn.elements = function(){
  return this.element.find(">*");
}

BowlineView.fn.findView = function(name){
  return this.element.find("[data-view='" + name + "']:first");
};

BowlineView.fn.viewName = function(element){
  return jQuery(element).dataset("view");
};

BowlineView.fn.change = function(name){
  var fromView      = this.current;
  var fromViewName  = this.viewName(fromView);
  var toView        = this.findView(name);
  var toViewName    = name;
  
  this.log("changing:", fromViewName, toViewName);
  
  if(toView.length == 0) throw 'Unknown view: ' + toViewName;
  
  if(fromViewName == toViewName) return;
  
  var animation = null;
  if(this.options.animationCallback){
    animation = this.options.animationCallback(
      fromViewName, toViewName
    );
  } else {
    // Could be blank - doesn't matter.
    animation = this.current.dataset("animation");
  }
    
  if(!fromView) {
    animation = null;
  }  
    
  var self = this;
  var callback = function(){
    if (animation){
      toView.removeClass("in " + animation);
      if(fromView) {
        fromView.removeClass("current out " + animation);
      }      
    } else {
      if(fromView) fromView.removeClass("current");
    }
    self.current = toView;
    self.triggerChange({
      fromView:     fromView,
      fromViewName: fromViewName,
      toView:       toView,
      toViewName:   toViewName
    });
  }
    
  if(jQuery.support.WebKitAnimationEvent && animation){
    toView.one("webkitAnimationEnd", callback);
    this.log("using animation:", animation, toViewName);
    toView.addClass(animation + " in current");
    if(fromView) fromView.addClass(animation + " out");    
  } else {
    toView.addClass("current");
    callback();
  }
};
if (typeof Bowline == "undefined") throw 'Bowline required';

// Usage:
// var chain = new Bowline.Chain(element);
// chain.bind("AssetBinder");

(function($){
  
Bowline.Chain = new SuperClass();
Bowline.Chain.include({
  init: function(element, options){
    this.options   = options || {};
    this.singleton = this.options.singleton || false;
    
    this.element = $(element);
    this.select  = function(){ return true };
    
    this.element.chain(options);
  },
  
  bind: function(binderName, options){
    return Bowline.bind(binderName, this, options);
  },
    
  replace: function(value){
    if (this.singleton) {
      this.element.item("replace", value);
    } else {
      this.element.items("replace", value);
    }
  },
  
  create: function(item){
    if ( !item.id ) return;
    if (this.singleton) {
      var data = this.element.item();
      // Different item has been created
      if ( !data || data.id != item.id ) return;
      this.element.item(item);
    } else {
      if ( !this.select(item) ) return;
      this.element.items("add", item);
    }
  },
  
  update: function(id, item){
    if (this.singleton) {
      var data = this.element.item();
      if ( !data || data.id != item.id ) return;
      this.element.item(item);
    } else {
      if ( !this.select(item) ) return;
      var element = this.element.findItem({id:id});
      if ( element ) element.item(item);
      this.element.update();
    }
  },
  
  destroy: function(id){
    if (this.singleton) {
      this.element.item("replace", {});
    } else {
      if ( !this.select(item) ) return;
      var element = this.element.findItem({id:id});
      if ( element ) element.item("remove");
      this.element.update();
    }
  }
});

$.fn.findItem = function(item){
  var result = $.grep(
    this.items(true), 
    function(el){
      return($(el).item().id == item.id);
    }
  );
  return $(result);
};

$.fn.bowlineChain = function(){
  var chain = new Bowline.Chain(this);
  chain.bind.apply(chain, arguments);
  return this;
};

})(jQuery);
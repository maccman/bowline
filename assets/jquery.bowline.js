(function($){
  var init = false;
  
  $.bowline = {
    setup: function(name, el){
      var rb = eval("bowline_" + name + "_setup");
      if(!rb) throw 'Unknown class';
      rb(el);
    },
    
    klass: function(name){
      var rb = eval("bowline_" + name);
      if(!rb) throw 'Unknown class';
      return rb;
    },
    
    instance: function(name, el){
      var rb = eval("bowline_" + name + "_instance");
      if(!rb) throw 'Unknown class';
      return rb(el);
    },
    
    helper: function(){
      return(
        bowline_helper.apply(
          bowline_helper, 
          arguments
        )
      );
    },
    
    ready: function(func){
      if(init) return func();
      $(document).bind('loaded.bowline', func);
    },
    
    setupForms: function(){
      // $('form').bind('submit', function(e){
      //   var src = $(this).attr('src').split('.');
      //   var rb = $.bowline.klass[src[0]];
      //   rb.params = $(this).serialize();
      //   rb.send(src[1]);
      //   return false;
      // });
    },
    
    // A lot of JS libs require hashes
    // without any functions in them
    _rubyHash: function( hsh ) {
      res = {};
      var key;
      for(key in hsh){
        var value = hsh[key];
        if(typeof(value) != 'function'){
          res[key] = value;
        }        
      }
      return res;
    }
  },
  
  window.bowline_loaded = function(){
    init = true;
    $(document.body).trigger('loaded.bowline');
  }
  
  $.fn.bowline = function(name, options){
    var self = $(this);
    $.bowline.ready(function(){
      self.chain(options);
      $.bowline.setup(name, self);
      self.data('bowline', name);
      self.trigger('setup.bowline');
    });
    return self;
  };
  
  $.fn.invoke = function(){
    if($(this).chain('active')){
      if($(this).data('bowline')){
        // Class method
        var name = $(this).data('bowline');
        var func = $.bowline.klass(name);
      } else {
        // Instance method
        var name = $(this).item('root').data('bowline');
        var func = $.bowline.instance(name, $(this));
      }
      return func.apply(func, arguments);
    } else {
      throw 'Chain not active';
    }
  };
  
  $.fn.updateCollection = function( items ){
    items = $.map(items, function(n){
      return $.bowline._rubyHash(n);
    });
    $(this).items('replace', items);
    $(this).trigger('update.bowline');
	};
	
	$.fn.updateSingleton = function( item ){
    item = $.bowline._rubyHash(item);
    $(this).item('replace', item);
    $(this).trigger('update.bowline');
	};
	
	$(function(){
	  setTimeout(function(){
  	  $(document.body).trigger('loading.bowline');
      var script = $("<script />");
      script.attr('type', 'text/ruby');
      script.attr('src',  '../script/init');
      $('head').append(script);
    }, 100);
	})
})(jQuery)
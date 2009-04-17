(function($){
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
    
    setupForms: function(){
      // $('form').bind('submit', function(e){
      //   var src = $(this).attr('src').split('.');
      //   var rb = $.bowline.klass[src[0]];
      //   rb.params = $(this).serialize();
      //   rb.send(src[1]);
      //   return false;
      // });
    }
  }
  
  $.fn.bowline = function(name, options){
    $(this).chain(options);
    $.bowline.setup(name, $(this));
    $(this).data('bowline', name);
    return this;
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
  }
})(jQuery)
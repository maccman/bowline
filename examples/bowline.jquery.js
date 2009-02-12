(function($){
  $.bowline = {
    init: function(name){
      var rb = $.bowline[name];
      if(!rb) throw 'Unknown class';
      return rb;
    },
    
    flash: function(key, value){
      if($.Chain.jobject(key)){
        $(document.body).bind("bowline:flash", function(key, value){
          key.removeClass("notice warning error");
          key.addClass(key);
          key.html(value);
        })
      } else {
        $(document.body).trigger("bowline:flash", key, value);
      }
    },
    
    setupForms: function(){
      // $('form').bind('click', function(e){
      //   var src = $(this).src.split('.')
      //   binder[src[0]][src[1]]();
      // });
    }
  }
  
  $.fn.bowline = function(arg){
    
    var init = function(name, options){
      var rb = $.bowline.init(name);
      $(this).rb = rb;
      $(this).invoke = function(){
        rb.send.apply(rb, arguments)
      };
      $(this).chain(options);

      rb.setup($(this));
      return this;
    };
    
    var instance = function(){
      if(!$(this).chain('active')) return;
      return $(this).item('root').rb.new($(this))
    };
    
    var invoke = function(){
      if($(this).chain('active')){
        var rb = instance();
        return rb.send.apply(rb, arguments);
      } else {
        throw 'Not chain active';
      }
    };
    
    // Helper methods
    
    var update = function(args){
      return invoke('update', args);
    };
    
    var destroy = function(){
      return invoke('destroy');
    };
  };
  
  // Shortcut
  $.fn.invoke = function(){
    $(this).bowline('invoke', arguments) 
  }
})(jQuery)
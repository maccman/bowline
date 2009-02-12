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
  
  $.fn.bowline = function(name){
    var rb = $.bowline.init(name);
    $(this).invoke = rb;
    $(this).instance = function(){ return rb.new($(this)) }
    $(this).chain();
    
    // invoke on the item - major todo
    $(this).items.invoke = function(name, args){
      $(this).instance().send(name, args);
    };
    
    $(this).items.instance_invoke = function(name, args){
      $(this).instance().send(name, args);
    }
    
    // Helper methods
    $(this).items.update = function(args){
      $(this).instance_invoke('update', args);
    }
    $(this).items.destroy = function(args){
      $(this).instance_invoke('destroy');
    }
    $(this).items.save = function(args){
      $(this).instance_invoke('save');
    }
  
    // // need a callback when items is updated - todo
    // $(this).update(function(event, data){
    //   rb.getItem(data)
    // });
    
    rb.setup($(this));
    
    return this;
  };
})(jQuery)
(function($){
  $.bowline = {
    klass: function(name){
      var rb = $.bowline[name];
      if(!rb) throw 'Unknown class';
      return rb;
    },
    
    test: {
      setup: function(){
        console.log('bowline:test', 'setup');
      },
      
      send: function(){
        console.log('bowline:test', arguments);
        return({})
      }
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
  
  $.fn.bowline = function(name, options){
    var rb = $.bowline.klass(name);
    this.data('bowline', rb);
    this.chain(options);
    rb.setup(this);
    return this;
  };
  
  $.fn.invoke = function(){
    if(this.chain('active')){
      if(this.data('bowline')){
        var rb = this.data('bowline');
      } else {
        var rb = this.item('root').invoke('new', this);
      }
      return rb.send.apply(rb, arguments);
    } else {
      throw 'Not chain active';
    }
  }
})(jQuery)
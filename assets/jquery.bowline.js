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
    
    setupForms: function(){
      $('form').bind('submit', function(e){
        var src = $(this).attr('src').split('.');
        var rb = $.bowline.klass[src[0]];
        rb.params = $(this).serialize();
        rb.send(src[1]);
        return false;
      });
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
(function($){
  $.fn.bowline = function(name){
    var rb = binder[name];
    if(!rb) throw 'Unknown class';
    $(this).invoke = rb;
    $(this).chain();
    
    // invoke on the item - major todo
    $(this).items.invoke = function(name, args){
      rb.new($(this)).send(name, args)
    };
  
    // // need a callback when items is updated - todo
    // $(this).update(function(event, data){
    //   rb.getItem(data)
    // });
    
    rb.setup($(this));
    
    return this;
  };
  
  $.bowline = {
    flash: function(key, value){
      alert(value); // todo
    }
  }
  
  // $(function(){
  //   $('form').bind('click', function(e){
  //     var src = $(this).src.split('.')
  //     binder[src[0]][src[1]]();
  //   });
  // });
})(jQuery)
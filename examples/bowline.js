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
    
    $(this).update(function(event, data){
      rb.getItem(data)
    });
    
    rb.setup($(this));
  };
  
  // $(function(){
  //   $('form').click(function(e){
  //     var src = $(this).src.split('.')
  //     binder[src[0]][src[1]]();
  //   });
  // });
})(jQuery)
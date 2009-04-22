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
    },
    
    // A lot of JS libs require hashes
    // without any functions in them
    rubyHash: function( hsh ) {
      res = {};
      $.each(hsh, function(key, value){
        if(typeof(value) != 'function'){
          res[key] = value;
        }
      });
      return res;
    },

    // Length on a Ruby array is a function    
    rubyMap: function( elems, callback ) {
  		var ret = [];

  		for ( var i = 0, length = elems.length(); i < length; i++ ) {
  			var value = callback( elems[ i ], i );

  			if ( value != null )
  				ret[ ret.length ] = value;
  		}

  		return ret.concat.apply( [], ret );
  	}
  },
  
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
  };
  
  $.fn.updateCollection = function( items ){
    items = $.bowline.rubyMap(items, function(n){
      return $.bowline.rubyHash(n);
    });
    $(this).items('replace', items);
	};
	
	$.fn.updateSingleton = function( item ){
    item = $.bowline.rubyHash(item);
    $(this).item('replace', item);
	};
})(jQuery)
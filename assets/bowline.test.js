// Emulates a Bowline backend

BowlineTest = {};
BowlineTest.trace = true;
BowlineTest.setup = function(){
  window._app = {}
  window._app.call = function(json){    
    var msg = JSON.parse(json);
        
    if(msg.klass == "_window") return;

    var klass = BowlineTest.klasses[msg.klass];
    if(klass)
      var method = klass[msg.method];
      
    if(!method && msg.method == "setup"){
      return;
    }
    
    if(!klass || !method) {
      BowlineTest.log("Missing method:", msg.klass + "#" + msg.method);
      return;
    }
    
    BowlineTest.log("Handling method:", msg.klass + "#" + msg.method);
    
    var replace = function(val){
      Bowline.replace(msg.klass, val);
    }
    
    var created = function(id, val){
      Bowline.created(msg.klass, id, val);
    }
   
    var updated = function(id, val){
      Bowline.updated(msg.klass, id, val);
    }
    
    var removed = function(id){
      Bowline.removed(msg.klass, id);
    }
    
    var context = {
      replace: replace,
      created: created,
      updated: updated,
      removed: removed
    };
   
    var result;
    try {
      result = method.apply(context, msg.args);
    } catch(e) {
      console.error("Error in method:", klass + "#" + method);
      throw(e);
    }
       
    if(msg.id != -1) {
      Bowline.invokeCallback(
        msg.id, JSON.stringify(result)
      )
    }
 }
 Bowline.enabled = true;
};

BowlineTest.log = function(){
  if( !BowlineTest.trace ) return;
  var args = jQuery.makeArray(arguments);
  args.unshift("(BowlineTest)");
  console.log.apply(console, args);
};

BowlineTest.klasses = {};
BowlineTest.register = function(className, object) {
  BowlineTest.klasses[className] = object;
  var bound = Bowline.bounds[className];
  if(bound) bound.singleton = object.singleton;
}

BowlineTest.enabled = !Bowline.enabled;

if(BowlineTest.enabled){
  BowlineTest.log("Enabled");
  BowlineTest.setup();
}
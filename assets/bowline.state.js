function BowlineState(opts){
  this.options = opts || {};
  this.states  = {}
  this.events  = {}
  this.current = this.options.initial;
}

BowlineState.fn = BowlineState.prototype;

BowlineState.fn.log = function(){
  if( !this.options.trace ) return;
  var args = jQuery.makeArray(arguments);
  args.unshift("(BowlineState)");
  console.log.apply(console, args);
};

BowlineState.fn.newEvent = function(name, opts){
  if(!name) throw "Must supply name";
  // Defaults to the same named state
  if(!opts) opts = {};
  if(!opts.to) opts.to = name;
  this.events[name] = opts;
}

BowlineState.fn.newState = function(name, callbacks){
  if(!name) throw "Must supply name";
  this.states[name] = callbacks || {};
}

BowlineState.fn.change = function(){
  var args = $.makeArray(arguments);  
  var name = args.shift();
  
  var event = this.events[name]
  if(!event) throw "Unknown event: " + name;
  // TODO support arrays in event.from
  if(event.from && 
      event.from != "all" && 
        this.current &&
          event.from != this.current) {
    this.log("Not changing state to:", event.to);
    return;
  }
  
  if(!this.states.hasOwnProperty(event.to)) {
    throw "Unknown state: " + event.to;
  }
  
  // Already at state
  if(event.to == this.current) return;
  
  var oldState   = this.current;
  var oldStateCB = this.states[oldState];
  var newState   = event.to;
  var newStateCB = this.states[newState];
  
  this.log("changing:", oldState, newState);
  
  if(oldStateCB && oldStateCB.beforeExit) oldStateCB.beforeExit();
  if(newStateCB.beforeEnter) newStateCB.beforeEnter.apply(this, args);
    
  this.current = newState;
  
  if(oldStateCB && oldStateCB.afterExit) oldStateCB.afterExit();
  if(newStateCB.afterEnter) newStateCB.afterEnter();
}
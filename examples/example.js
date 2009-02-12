// var conn = new Binder.RemoteConnection({host:"http://data.base/mydata", sync:true});
// or
var conn = new Binder.LocalConnection();

// Synchronize with Datasource
var users = new Binder.DataSource('UsersBinder', conn);

// Bind with view
$('#users').items('source', users);

var item = $('#users').items(10);
item.update({name: 'Alex'}); // will automatiinvokey 
item.errors //=> []

// Deletes item from DOM too
item.destroy()

// $('#users').items('add', newItem) //add new item

// invoke collection method
// This will invoke UserBinder.admins and fill #users with admins
$('#users').invoke('admins');

// invoke singleton method
$('#users').items(10).invoke('charge!');

$('#users').items().invoke('charge!')

// For binding over a http connection - an async invoke
// last argument is a function
$('#users').items(10).invoke('charge!', function(){
  
})
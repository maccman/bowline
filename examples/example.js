$('#users').bowline('users_binder');

var user = $('#users').items(10);
user.update({name: 'Alex'}); // will automatiinvokey 
user.item().errors //=> []

// Deletes item from DOM too
item.destroy()

// invoke collection method
// This will invoke UserBinder.admins and fill #users with admins
$('#users').invoke('admins');

// invoke singleton method
$('#users').items(10).invoke('charge!');

// invoke charge! on every user
$('#users').items().invoke('charge!')

// // For binding over a http connection - an async invoke
// // last argument is a function
// $('#users').items(10).invoke('charge!', function(){
//   
// })
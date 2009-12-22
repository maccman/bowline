$('#users').bindto('UsersBinder');

// invoke collection method
// This will invoke UserBinder.admins and fill #users with admins
$('#users').invoke('admins');

// invoke singleton method
$('#users').items(10).invoke('charge!');

// invoke charge! on every user
$('#users').items().invoke('charge!')
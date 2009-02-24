var notification_windows = 1;

function TitaniumNotification(window)
{
  var width = 300, height = 80, notificationDelay = 3000;
  if (Titanium.platform == "win32") {
    height = 80;  
  }
  var showing = false;
  var myid = 'notification_'+(notification_windows++);
  var transparency = .99;
  
  var mywindow = Titanium.UI.mainWindow.createWindow({
      width:width,
      height:height,
      transparency:transparency,
      usingChrome:false,
      id:myid,
      visible:false,
	  topMost:true,
      url:'app://blank'
  });
  var self = this;
  var title = '', message = '', icon = '';
  var callback = null;
  var hideTimer = null;
  
  mywindow.open();
  this.setTitle = function(value)
  {
    title = value;
  };
  this.setMessage = function(value)
  {
    message = value;
  };
  this.setIcon = function(value)
  {
    icon = value;
  };
  this.setDelay = function(value)
  {
    notificationDelay = value;
  };
  this.setCallback = function(value)
  {
	  callback = value;
  };
  this.show = function(animate,autohide)
  {
	if ('Growl' in Titanium && Titanium.Growl.isRunning()) {
		Titanium.Growl.showNotification(title, message, icon, notificationDelay/1000, callback);
		return;
	}
	
    showing = true;
    if (hideTimer)
    {
      window.clearTimeout(hideTimer);
    }
    animate = (animate==null) ? true : animate;
    autohide = (autohide==null) ? true : autohide;
    mywindow.setX(window.screen.availWidth-width-20);
    if (Titanium.platform == "osx" || Titanium.platform == 'linux') {
      mywindow.setY(25);
    } else if (Titanium.platform == "win32") {
      mywindow.setY(window.screen.availHeight-height-10);  
    }
    
    var notificationClicked = function ()
    {
    	if (callback)
    		callback();
    	self.hide();
    };
    
    mywindow.setTransparency(.99);
    mywindow.callback = notificationClicked;
    mywindow.setURL('app://tinotification.html?title='+encodeURIComponent(title)+'&message='+encodeURIComponent(message)+'&icon='+encodeURIComponent(icon));
    mywindow.show();
    if (autohide)
    {
      hideTimer = window.setTimeout(function()
      {
        self.hide();
      },notificationDelay + (animate ? 1000 : 0));
    }
  };
  this.hide = function(animate)
  {
    animate = (animate==null) ? true : animate;
    showing = false;
    if (hideTimer)
    {
      window.clearTimeout(hideTimer);
      hideTimer=null;
    }
    mywindow.hide(animate);
	mywindow.getParent().focus();
  };
};

Titanium.Notification = {
	createNotification : function(window) {
		return new TitaniumNotification(window);
	}
};
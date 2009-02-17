//
// load projects when manage projects is clicked
//
var TFS = Titanium.Filesystem;
var TiDeveloper  = {};
TiDeveloper.currentPage = 1;
TiDeveloper.init = false;
TiDeveloper.ytAuthToken = null;

TiDeveloper.convertDate = function(str)
{
	var parts = str.split(':');
	var hour = parseInt(parts[0]);
	var minutes = parts[1];
	var ampm = 'am';
	if (hour > 12)
	{
		hour = hour - 12
		ampm = 'pm';
	}
	else if (hour == 0)
	{
		hour = 12;
	}
	return hour + ":" + minutes + ampm;
}



TiDeveloper.twitterUsername = null;
TiDeveloper.twitterPassword = null;
TiDeveloper.saveTwitterCreds = function(username,password)
{
	// only update if different
	// we only store one twitter account
	if (username != TiDeveloper.twitterUsername || 
		password  != TiDeveloper.twitterPassword)
	{
		$('#twitter_username').val(username);
		$('#twitter_password').val(password);
		swiss('#twitter_username').fire('revalidate')
		swiss('#twitter_password').fire('revalidate')

		//add
		if (TiDeveloper.twitterUsername == null)
		{
			// update database
		    db.transaction(function (tx) 
		    {
		        tx.executeSql("INSERT into Twitter (id,username,password) values(?,?,?)", 
				[1,username,password]);
		    });

		}
		//update
		else
		{
			// update database
		    db.transaction(function (tx) 
		    {
		        tx.executeSql("UPDATE Twitter set username = ?, password = ? WHERE id = ?", 
				[1,username,password]);
		    });
		}
	}
}
TiDeveloper.loadTwitter = function()
{
	// clear
	$('#twitter_content').empty();
	
	// set page size
	var rpp = $('#twitter_page_size').val();
	if (!rpp)rpp=50;
	// get data
	$('#twitter_content').append('<img src="images/information.png" style="position:relative;top:3px"/> Loading twitter data... One moment.')
	$('#twitter_content').attr('loading','true');
	$.ajax({
		type:"GET",
		url: 'http://search.twitter.com/search.rss?q=+%22Appcelerator+Titanium%22+OR+%23titanium+OR+%23appcelerator&rpp=' +rpp ,		
		success: function(data)
		{
			$('#twitter_content').attr('loading','false');
			$('#twitter_content').empty();
			
			var root = data.getElementsByTagName('rss')[0];
			var channels = root.getElementsByTagName("channel");
			var items = channels[0].getElementsByTagName("item");
			for (var i=0;i<items.length;i++)
			{
				var children = items[i].childNodes;
				var date = null;
				var desc = null;
				var image = null;
				var author = null;
				var html = [];


				for(var j=0;j<children.length;j++)
				{
					if (children[j].nodeType==1)
					{
						switch(children[j].nodeName.toLowerCase())
						{
							case 'author':
							{
								author = children[j].textContent;
								var parts = author.split('(');
								author = parts[1].substring(0,parts[1].length-1)
								break;
							}
							case 'google:image_link':
							{
								image = children[j].textContent.trim();							
								break;
							}

							case 'description':
							{
								desc = children[j].textContent
								desc = desc.replace(/href/g,'target="ti:systembrowser" href');
								desc = desc.replace(/href="\/search/g,'href="http://search.twitter.com/search');
								break;
							}
							case 'pubdate':
							{
								date = children[j].textContent
								var parts = date.split(' ');
								date = parts[2] + ' ' + parts[1] + ' ' + parts[3] + ' ' + TiDeveloper.convertDate(parts[4].substring(0,5));

							}
						}
					}
				}
				html.push('<div style="height:80px;margin-bottom:10px">');
				html.push('		<div style="float:left;text-align:center;min-width:60px;max-width:60px;"><img style="border:2px solid #4b4b4b;background-color:#4b4b4b;position:relative;top:14px" height="48px" width="48px" src="'+image+'"/></div>');
				html.push('		<div style="float:right;min-width:86%;max-width:86%;height:80px;position:relative;-webkit-border-radius:6px;background-color:#414141">');
				html.push('			<img style="position:absolute;left:-24px;top:25px" src="images/triangle.png"/>');
				html.push('			<div style="color:#42C0FB;position:absolute;left:10px;top:8px;">' + author + ' <span style="color:#a4a4a4">says:</span></div>');
				html.push('			<div style="color:#a4a4a4;font-size:11px;position:absolute;right:10px;top:10px">' + date + '</div>');
				html.push('			<div style="position:absolute;left:10px;top:30px;color:#fff;">'+desc +'</div>')
				html.push('		</div>');
				html.push('</div>');
				$('#twitter_content').append(html.join(''));
				var d = new Date();	
				$('#twitter_last_update').html(d.toLocaleString())
				
			}
		}
	});
	if ($('#twitter_content').attr('loading') == 'true')
	{
		$('#twitter_content').html('<img src="images/information.png" style="position:relative;top:3px"/> You (or Twitter) is offline...  Try again later.')
	}
}

// auto update twitter feed
// 5 minutes
setInterval(function()
{
	TiDeveloper.loadTwitter();
	
},300000)

//
// Twitter messages
//
$MQL('l:send.tweet.request',function(msg)
{
	var tweet = String(msg.payload['twitter_message']);
	var username = String(msg.payload['twitter_username']);
	var password = String(msg.payload['twitter_password']);
	var notification = Titanium.Notification.createNotification(window)
	if (tweet.charAt(0)!='D') //D is direct message if first position
	{
		$.ajax(
		{
			'username':username,
			'password':password,
			'type':'POST', 
			'url':'https://twitter.com/statuses/update.json',
			'data':{'status':tweet, 'source':'titanium developer'},
			success:function(resp,textStatus)
			{
				TiDeveloper.saveTwitterCreds(username,password)
				notification.setTitle('Success');
				notification.setMessage('Your message was sent!');
				notification.setIcon('app://images/information.png');
				notification.show();
				$MQ('l:send.tweet.response',{result:'success'})
			},
			error:function(XMLHttpRequest, textStatus, errorThrown)
			{
				alert('textStatus='+textStatus+',error='+errorThrown);
				notification.setTitle('Error');
				notification.setMessage('Sorry there was an error from Twitter!');
				notification.setIcon('app://images/error.png');
				notification.show();
				$MQ('l:send.tweet.response',{result:'error'})

			}
		});
	}
	// DIRECT MESSAGE
	else
	{
		var user = tweet.split(' ')[1]
		$.ajax(
		{
			'username':username,
			'password':password,
			'type':'POST', 
			'url':'http://twitter.com/direct_messages/new.json',
			'data':{'text':tweet, 'user':user, 'source': 'titanium developer'},
			success:function(resp,textStatus)
			{
				TiDeveloper.saveTwitterCreds(username,password)
				notification.setTitle('Direct Message');
				notification.setMessage('Your message has been sent');
				notification.setIcon('app://images/information.png');
				notification.show();
				$MQ('l:send.tweet.response',{result:'success'})
				
				
			},
			error:function(XMLHttpRequest, textStatus, errorThrown)
			{
				notification.setTitle('Direct Message');
				notification.setMessage('Sorry there was an error from Twitter!');
				notification.setIcon('app://images/error.png');
				notification.show();
				$MQ('l:send.tweet.response',{result:'error'})
				
			}
		});
	}
	
});


		
// holder var for all projects
TiDeveloper.ProjectArray = [];
var db = openDatabase("TiDeveloper","1.0");

var highestId = 0;

// generic count format function
function formatCountMessage(count,things)
{
	return (count == 0) ? 'You have no '+things+'s' : count == 1 ? 'You have 1 '+things : 'You have ' + count + ' '+things+'s';
}

// State Machine for UI tab state
TiDeveloper.stateMachine = new App.StateMachine('ui_state');
TiDeveloper.stateMachine.addState('manage','l:menu[val=manage]',false);
TiDeveloper.stateMachine.addState('create','l:menu[val=create]',false);
TiDeveloper.stateMachine.addState('api','l:menu[val=api]',false);
TiDeveloper.stateMachine.addState('interact','l:menu[val=interact]',true);
TiDeveloper.currentState = null;
TiDeveloper.stateMachine.addListener(function()
{
	TiDeveloper.currentState = this.getActiveState();
	if (TiDeveloper.currentState != 'interact')
	{
		TiDeveloper.startIRCTrack();
	}
	else
	{
		TiDeveloper.stopIRCTrack();
		
	}
});
TiDeveloper.ircMessageCount = 0;
TiDeveloper.startIRCTrack = function()
{
	TiDeveloper.ircMessageCount = 0;
//	$('#irc_message_count').html('');
//	$('#irc_message_count').css('display','inline');
	
};
TiDeveloper.stopIRCTrack = function()
{
	TiDeveloper.ircMessageCount = 0;
//	$('#irc_message_count').css('display','none');
//	$('#irc_message_count').html('');
	Titanium.UI.setBadge('');
	
};

// track focus events for when to send notifications
TiDeveloper.windowFocused = false
Titanium.UI.currentWindow.addEventListener(function(event)
{
	if (event == "unfocused")
	{
		TiDeveloper.ircMessageCount = 0;
		TiDeveloper.windowFocused = false;
	}
	else if (event == "focused")
	{
		TiDeveloper.ircMessageCount = 0;
		TiDeveloper.windowFocused = true;
		Titanium.UI.setBadge('');
	}
});

TiDeveloper.updateAppData = function()
{
	// write manifest
	var values = {};
	values.name = $('#project_name_value').html();
	values.publisher = $('#project_pub_value').html();
	values.dir = $('#project_dir_value').html();
	values.image = $('#project_pub_image_value').html();
	values.url = $('#project_pub_url_value').html();
	Titanium.Project.updateManifest(values)

	var id = $('#project_id_value').get(0).value;

	// update database
    db.transaction(function (tx) 
    {
        tx.executeSql("UPDATE Projects set name = ?, directory = ?, publisher = ?, url = ?, image = ? WHERE id = ?", 
		[values.name,values.dir,values.publisher,values.url,values.image, id]);
    });
	
	var project = findProjectById(id)
	project.name = values.name
	project.dir = values.dir
	project.publisher = values.publisher
	project.url = values.url
	project.image = values.image
	
};

$MQL('l:row.selected',function(msg)
{
	var msgObj = {}
	var project = findProjectById(msg.payload.project_id);
	msgObj.date = project.date;
	msgObj.name = project.name;
	msgObj.location = TiDeveloper.formatDirectory(project.dir);
	msgObj.fullLocation = project.dir;
	msgObj.pub = project.publisher
	msgObj.url = project.url;
	msgObj.image = project.image;
	$MQ('l:project.detail.data',msgObj)
	
	// setup editable fields
	$('.edit').click(function()
	{
		if ($(this).attr('edit_mode') != 'true')
		{
			// only one active edit field at a time
			var activeFiles = $('div[edit_mode=true]');
			if (activeFiles)
			{
				for (var i=0;i<activeFiles.length;i++)
				{
					var id = $(activeFiles[i]).attr('id');
					$(activeFiles[i]).html($('#'+id+'_input').val())
					TiDeveloper.updateAppData();
					$(activeFiles[i]).get(0).removeAttribute('edit_mode');
				}
			}
			
			// process click
			var el = $(this).get(0);
			var value = el.innerHTML;
			el.setAttribute('edit_mode','true');
			
			// create input and focus
			$(this).html('<input id="'+el.id+'_input" value="'+value+'" type="text" style="width:350px"/>');
			$('#'+el.id+'_input').focus();
			
			// listen for enter
			$('#'+el.id+'_input').keyup(function(e)
			{
				if (e.keyCode==13)
				{
					el.innerHTML = $('#'+el.id+'_input').val() 
					el.removeAttribute('edit_mode');
					TiDeveloper.updateAppData();
				}
				else if (e.keyCode==27)
				{
					el.innerHTML = value; 
					el.removeAttribute('edit_mode');
				}
			});

		}
	})
	
})

function createRecord(options,callback)
{
	var date = new Date();
	var dateStr = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
	var record = {
		name: options.name,
		dir: String(options.dir),
		id: ++highestId,
		appid: options.appid,
		date: dateStr,
		publisher:options.publisher,
		url:options.url,
		image:options.image
	};
    db.transaction(function (tx) 
    {
        tx.executeSql("INSERT INTO Projects (id, timestamp, name, directory, appid, publisher, url, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [record.id,date.getTime(),record.name,record.dir,record.appid,record.publisher,record.url,record.image]);
    },
	function(error)
	{
		callback({code:1,id:error.id,msg:error.message})
	},
	function()
	{
		TiDeveloper.ProjectArray.push(record);
		callback({code:0})
	});
}

function loadProjects()
{

	db.transaction(function(tx) 
	{
        tx.executeSql("SELECT id, timestamp, name, directory, appid, publisher, url, image FROM Projects order by timestamp", [], function(tx, result) 
		{
			TiDeveloper.ProjectArray = [];
            for (var i = 0; i < result.rows.length; ++i) {
                var row = result.rows.item(i);
				// check to see if the user has deleted it and if
				// so remove it
				var cd = TFS.getFile(row['directory']);
				if (!cd.exists())
				{
					tx.executeSql('DELETE FROM Projects where id = ?',[row['id']]);
				}
				else
				{
					var date = new Date();
					date.setTime(row['timestamp'])
					
					TiDeveloper.ProjectArray.push({
						id: row['id'],
						date: (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(),
						name: row['name'],
						dir: row['directory'],
						appid: row['appid'],
						publisher: row['publisher'],
						url: row['url'],
						image: row['image']
					});
					if (highestId < row['id'])
					{
						highestId = row['id'];
					}
				}
            }
			TiDeveloper.currentPage = 1;
			var data = TiDeveloper.getProjectPage(10,TiDeveloper.currentPage);
			var count = formatCountMessage(TiDeveloper.ProjectArray.length,'project');
			
			// show create project if none
			if (TiDeveloper.ProjectArray.length == 0)
			{
				$MQ('l:menu',{val:'manage'})
			}
			
			$('#project_count_hidden').val(TiDeveloper.ProjectArray.length)
			$MQ('l:project.list.response',{count:count,page:TiDeveloper.currentPage,totalRecords:TiDeveloper.ProjectArray.length,'rows':data})
        }, function(tx, error) {
            alert('Failed to retrieve projects from database - ' + error.message);
            return;
        });
	});	
}


//
//  Initial project load
//
$MQL('l:app.compiled',function()
{
	db.transaction(function(tx) 
	{
	   tx.executeSql("SELECT COUNT(*) FROM Projects", [], function(result) 
	   {
	       loadProjects();
	   }, function(tx, error) 
	   {
	       tx.executeSql("CREATE TABLE Projects (id REAL UNIQUE, timestamp REAL, name TEXT, directory TEXT, appid TEXT, publisher TEXT, url TEXT, image TEXT)", [], function(result) 
		   { 
	          loadProjects(); 
	       });
	   });
	});
	
	db.transaction(function(tx) 
	{
	   tx.executeSql("SELECT username,password FROM Twitter", [], function(tx,result) 
	   {
		   for (var i = 0; i < result.rows.length; ++i) 
		   {
                var row = result.rows.item(i);
				TiDeveloper.twitterUsername = row['username'];
				TiDeveloper.twitterPassword = row['password'];
				$('#twitter_username').val(TiDeveloper.twitterUsername);
				$('#twitter_password').val(TiDeveloper.twitterPassword);
				swiss('#twitter_username').fire('revalidate')
				swiss('#twitter_password').fire('revalidate')

				break;
			}
	   }, function(tx, error) 
	   {
	       tx.executeSql("CREATE TABLE Twitter (id REAL UNIQUE, username TEXT, password TEXT)")
	   });
	});
	
	TiDeveloper.loadTwitter();
});


//
//  create.project service
//
$MQL('l:create.project.request',function(msg)
{
	try
	{
		var result = Titanium.Project.create(msg.payload.project_name,msg.payload.project_location,msg.payload.publisher,msg.payload.url,msg.payload.image);
		if (result.success)
		{
			var options = {name:result.name, dir:result.basedir,appid:result.id,publisher:msg.payload.publisher,url:msg.payload.url,image:msg.payload.image}
			var r = createRecord(options,function(obj)
			{
				if (obj.code == 0)
				{
					$MQ('l:create.project.response',{result:'success'});
					var count = formatCountMessage(TiDeveloper.ProjectArray.length,'project');
					$MQ('l:project.list.response',{count:count,page:1,totalRecords:TiDeveloper.ProjectArray.length,'rows':TiDeveloper.ProjectArray})
				}
				else
				{
					$MQ('l:create.project.response',{result:'error',msg:obj.msg});
				}
			});		
		}
		else
		{
			$MQ('l:create.project.response',{result:'error',msg:result.message});
		}
	}
	catch(E)
	{
		$MQ('l:create.project.response',{result:'error',msg:E});
	}
});

//
// Handling paging requests
//
$MQL('l:page.data.request',function(msg)
{
	// paging gets called in both search and list
	// cases - if search yields 0 results, do nothing
	if (TiDeveloper.ProjectArray.length == 0)return;
	
	var state =msg.payload
	var rowsPerPage = state.rowsPerPage
	var page = state.page
	TiDeveloper.currentPage = page;
	var data = TiDeveloper.getProjectPage(rowsPerPage,page);
	var count = formatCountMessage(TiDeveloper.ProjectArray.length,'project');
	
	$MQ('l:project.list.response',{count:count,page:page,totalRecords:TiDeveloper.ProjectArray.length,'rows':data})
});


TiDeveloper.formatDirectory =function(dir,truncate)
{
	// return whole dir
	if (truncate == false)return dir;
	
	if (dir != null)
	{
		var dirStr = dir
		if (dir.length > 40)
		{
			dirStr = dir.substring(0,40) + '...';
			$('#project_detail_dir_a').css('display','block');
			$('#project_detail_dir_span').css('display','none');
		}
		else
		{
			$('#project_detail_dir_span').css('display','block');
			$('#project_detail_dir_a').css('display','none');
		}
	}
	return dirStr;
}
//
// Get a page of data
//
TiDeveloper.getProjectPage = function(pageSize,page)
{
	var pageData = [];
	var start = (page==0)?0:(pageSize * page) - pageSize;
	var end = ((pageSize * page) > TiDeveloper.ProjectArray.length)?TiDeveloper.ProjectArray.length:(pageSize * page);
	for (var i=start;i<end;i++)
	{
		pageData.push(TiDeveloper.ProjectArray[i])
	}
	return pageData
};

var modules = [];
var module_map = {};

setTimeout(function()
{
	var result = Titanium.Project.getModulesAndRuntime();
	modules.push({name:'Titanium Runtime',versions:result.runtime.versions,dir:result.runtime.dir});
	for (var c=0;c<result.modules.length;c++)
	{
		var name = result.modules[c].name;
		module_map[name]=result.modules[c];
		modules.push({name:name,versions:result.modules[c].versions,dir:result.modules[c].dir});
	
	}
},500);

//
//  Project Package Request - get details about modules, etc
//
$MQL('l:package.project.request',function(msg)
{
	try
	{
		$MQ('l:package.project.data',{rows:modules});
	 	$MQ('l:package.all',{val:'network'});
	}
	catch (E)
	{
		alert("Exception = "+E);
	}
});

function findProject(name)
{
	for (var i=0;i<TiDeveloper.ProjectArray.length;i++)
	{
		if (TiDeveloper.ProjectArray[i].name == name)
		{
			return TiDeveloper.ProjectArray[i];
		}
	}
	return null;
}

function findProjectById(id)
{
	for (var i=0;i<TiDeveloper.ProjectArray.length;i++)
	{
		if (TiDeveloper.ProjectArray[i].id == id)
		{
			return TiDeveloper.ProjectArray[i];
		}
	}
	return null;
}
//
// Create Package Request
//
$MQL('l:create.package.request',function(msg)
{
	try
	{
		var launch = (msg.payload.launch == 'no')?false:true;
		var install = typeof(msg.payload.install)=='undefined' ? false : msg.payload.install;
		var pkg = (msg.payload.launch == true)?true:false;
		
		
		// elements that are included for network bundle
		var networkEl = $("div[state='network']");

		// elements that are included (bundled)
		var bundledEl = $("div[state='bundled']");

		// elements that are excluded
		var excludedEl = $("div[state='exclude']");
		
		var excluded = {};
		
		var buildMac = ($('#platform_mac').hasClass('selected_os'))?true:false;
		var buildWin = ($('#platform_windows').hasClass('selected_os'))?true:false;
		var buildLinux = ($('#platform_linux').hasClass('selected_os'))?true:false;
		
		$.each(excludedEl,function()
		{
			var key = $.trim($(this).html());
			excluded[key]=true;
		});
		
		// project name
		var project_name = $('#package_project_name').html();


		var project = findProject(project_name);
		var resources = TFS.getFile(project.dir,'resources');

		// build the manifest
		var manifest = '#appname:'+project_name+'\n';
		manifest+='#appid:'+project.appid+'\n';
		manifest+='#publisher:'+project.publisher+'\n';

		if (project.image)
		{
			var image = TFS.getFile(project.image);
			var image_dest = TFS.getFile(resources,image.name());
			image.copy(image_dest);
			manifest+='#image:'+image.name()+'\n';
		}
		
		manifest+='#url:'+project.url+'\n';
		manifest+='runtime:'+modules[0].versions[0]+'\n';
		
		// 0 is always runtime, skip it
		for (var c=1;c<modules.length;c++)
		{
			if (!excluded[modules[c].name])
			{
				manifest+=modules[c].name+':'+modules[c].versions[0]+'\n';
			}
		}
		
		var mf = TFS.getFile(project.dir,'manifest');
		mf.write(manifest);
		
		var dist = TFS.getFile(project.dir,'dist',Titanium.platform);
		dist.createDirectory(true);
		
		var runtime = TFS.getFile(modules[0].dir,modules[0].versions[0]);
		
		var app = Titanium.createApp(runtime,dist,project_name,project.appid,install);
		var app_manifest = TFS.getFile(app.base,'manifest');
		app_manifest.write(manifest);
		var resources = TFS.getFile(project.dir,'resources');
		var tiapp = TFS.getFile(project.dir,'tiapp.xml');
		tiapp.copy(app.base);
		var launch_fn = function()
		{
			if (launch)
			{
				Titanium.Desktop.openApplication(app.executable.nativePath());
			}
		};
		TFS.asyncCopy(resources,app.resources,function()
		{
			var module_dir = TFS.getFile(app.base,'modules');
			var runtime_dir = TFS.getFile(app.base,'runtime');
			var modules_to_bundle = [];
			$.each(bundledEl,function()
			{
				var key = $.trim($(this).html());
				var target, dest;
				if (key == 'Titanium Runtime') //TODO: we need to make this defined
				{
					runtime_dir.createDirectory();
					target = TFS.getFile(modules[0].dir,modules[0].versions[0]);
					dest = runtime_dir;
				}
				else
				{
					module_dir.createDirectory();
					var module = module_map[key];
					target = TFS.getFile(module.dir,module.versions[0]);
					dest = TFS.getFile(module_dir,module.dir.name());
				}
				modules_to_bundle.push({target:target,dest:dest});
			});
			
			if (modules_to_bundle.length > 0)
			{
				var count = 0;
				for (var c=0;c<modules_to_bundle.length;c++)
				{
					var e = modules_to_bundle[c];
					TFS.asyncCopy(e.target,e.dest,function(filename,c,total)
					{
						if (++count==modules_to_bundle.length)
						{
							// link libraries if runtime included
							if (e.dest == runtime_dir)
							{
								Titanium.linkLibraries(e.dest);
							}
							launch_fn();
						}
					});
				}
			}
			else
			{
				// no modules to bundle, installer the net installer
				var net_installer_src = TFS.getFile(runtime,'installer');
				var net_installer_dest = TFS.getFile(app.base,'installer');
				TFS.asyncCopy(net_installer_src,net_installer_dest,function(filename,c,total)
				{
					launch_fn();
				});
			}
			
		});
	}
	catch(E)
	{
		alert("Exception = "+E);
	}
})

//
//  Delete a project
//	
$MQL('l:delete.project.request',function(msg)
{
	var name = msg.payload.name;
	var id = msg.payload.project_id
	var project = findProjectById(id);
	var file = Titanium.Filesystem.getFile(project.dir);
	alert(id + ' ' + project + ' ' + file)

	file.deleteDirectory(true);
	
	db.transaction(function (tx) 
    {
        tx.executeSql("DELETE FROM Projects where id = ?", [id]);
		loadProjects();
    });
});

//
// project search request
//
$MQL('l:project.search.request',function(msg)
{
	var q = msg.payload.search_value;
	db.transaction(function(tx) 
	{
		try
		{
	        tx.executeSql("SELECT id, timestamp, appid, publisher, url, image, name, directory FROM Projects where name LIKE '%' || ? || '%'", [q], function(tx, result) 
			{
				try
				{
					TiDeveloper.ProjectArray = [];
		            for (var i = 0; i < result.rows.length; ++i) 
					{
		                var row = result.rows.item(i);
						var date = new Date();
						date.setTime(row['timestamp'])
						TiDeveloper.ProjectArray.push({
							id: row['id'],
							date: (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(),
							name: row['name'],
							dir: row['directory'],
							appid: row['appid'],
							publisher: row['publisher'],
							url: row['url'],
							image: row['image']
						});
					}
					$MQ('l:project.search.response',{count:TiDeveloper.ProjectArray.length,page:1,totalRecords:TiDeveloper.ProjectArray.length,'rows':TiDeveloper.ProjectArray});
				}
				catch (EX)
				{
					alert("EXCEPTION = "+EX);
				}
			});
		}
		catch (E)
		{
			alert("E="+e);
		}
	});
});

//
// Show file dialog and send value
//
$MQL('l:show.filedialog',function(msg)
{
	var el = msg.payload['for'];
	var props = {multiple:false};
	if (el == 'project_image')
	{
		props.directories = false;
		props.files = true;
		props.types = ['gif','png','jpg'];
	}
	else
	{
		props.directories = true;
		props.files = false;
	}
	
	Titanium.UI.openFiles(function(f)
	{
		if (f.length)
		{
			$MQ('l:file.selected',{'for':el,'value':f[0]});
		}
	},
	props);
});

TiDeveloper.getCurrentTime = function()
{
	var curDateTime = new Date()
  	var curHour = curDateTime.getHours()
  	var curMin = curDateTime.getMinutes()
  	var curAMPM = "am"
  	var curTime = ""
  	if (curHour >= 12){
    	curHour -= 12
    	curAMPM = "pm"
    }
  	if (curHour == 0) curHour = 12
  	curTime = curHour + ":" + ((curMin < 10) ? "0" : "") + curMin + curAMPM;
  	return curTime;
	
};
var irc_count = 0;

function format_nickname(name)
{
	return name.replace(' ','_');
}
TiDeveloper.online = false;
Titanium.Network.addConnectivityListener(function(online)
{
	if (online == false)
	{
		TiDeveloper.online = false;
		$MQ('l:online.count',{count:'offline'});
	}
	else
	{
		TiDeveloper.online = true;
		
	}
});
setTimeout(function()
{
	try
	{
		var username = format_nickname(Titanium.Platform.username + 1);
		var nick_counter = 1;

		$('#irc').append('<div style="color:#aaa">you are joining the <span style="color:#42C0FB">Titanium Developer</span> chat room. one moment...</div>');
		
		var irc = Titanium.Network.createIRCClient();
		irc.connect("irc.freenode.net",6667,username,username,username,String(new Date().getTime()),function(cmd,channel,data,nick)
		{
			var time = TiDeveloper.getCurrentTime();

			// switch on command
			switch(cmd)
			{	
				case '433':
				{
					// try again with a new nick
					username = format_nickname(Titanium.Platform.username + (++nick_counter));
					irc.setNick(username);
					break;
				}
				case 'NOTICE':
				case 'PRIVMSG':
				{
					if (nick && nick!='NickServ')
					{
						if ((TiDeveloper.currentState != 'interact') ||
						    (TiDeveloper.windowFocused == false))
						{
							TiDeveloper.ircMessageCount ++;
							Titanium.UI.setBadge(String(TiDeveloper.ircMessageCount));
						}
						$('#irc_message_count').html(TiDeveloper.ircMessageCount);						
						var rawMsg = String(channel.substring(1,channel.length));
						var urlMsg = TiDeveloper.formatURIs(rawMsg);
						var str = username + ":";
						var msg = urlMsg.replace(username +":","<span style='color:#42C0FB'>" + username + ": </span>");
						if (TiDeveloper.windowFocused == false && msg.indexOf(str) != -1)
						{
							var notification = Titanium.Notification.createNotification(window);
							notification.setTitle("New Message");
							notification.setMessage(msg);
							notification.setIcon("app://images/information.png");
							notification.show();
							
						}
						$('#irc').append('<div style="color:yellow;float:left;margin-bottom:3px;width:90%">' + nick + ': <span style="color:white">' + msg + '</span></div><div style="float:right;color:#ccc;font-size:11px;width:10%;text-align:right">'+time+'</div><div style="clear:both"></div>');
					}
					break;
				}
				case '366':
				{					
					var users = irc.getUsers('#titanium_dev');
					$MQ('l:online.count',{count:users.length});
					irc_count = users.length;
					for (var i=0;i<users.length;i++)
					{
						if (users[i].operator == true)
						{
							$('#irc_users').append('<div class="'+users[i].name+'" style="color:#42C0FB">'+users[i].name+'(op)</div>');
						}
						else if (users[i].voice==true)
						{
							$('#irc_users').append('<div class="'+users[i].name+'" style="color:#42C0FB">'+users[i].name+'(v)</div>');
						}
						else
						{
							$('#irc_users').append('<div class="'+users[i].name+'">'+users[i].name+'</div>');
						}
					}
				}
				case 'JOIN':
				{
					if (nick.indexOf('freenode.net') != -1)
					{
						continue;
					}
					
					if (nick == username)
					{
						$('#irc').append('<div style="color:#aaa;margin-bottom:20px"> you are now in the room. your handle is: <span style="color:#42C0FB">'+username+'</span> </div>');
						break
					}
					else
					{
						irc_count++;
					}
					$('#irc').append('<div style="color:#aaa">' + nick + ' has joined the room </div>');
					$('#irc_users').append('<div class="'+nick+'" style="color:#457db3">'+nick+'</div>');
					$MQ('l:online.count',{count:irc_count});
					break;
					
				}
				case 'QUIT':
				case 'PART':
				{
					$('#irc').append('<div style="color:#aaa">' + nick + ' has left the room </div>');
					$('.'+nick).html('');
					irc_count--;
					$MQ('l:online.count',{count:irc_count});
					break;
				}
			}
			$('#irc').get(0).scrollTop = $('#irc').get(0).scrollHeight;
		});

		irc.join("#titanium_dev");
		$MQL('l:send.irc.msg',function()
		{
			if (TiDeveloper.online == true)
			{
				var time = TiDeveloper.getCurrentTime();
				irc.send('#titanium_dev',$('#irc_msg').val());
				$('#irc').append('<div style="color:yellow;float:left;margin-bottom:3px;width:90%">' + username + ': <span style="color:white">' + $('#irc_msg').val() + '</span></div><div style="float:right;color:#ccc;font-size:11px;width:10%;text-align:right">'+time+'</div><div style="clear:both"></div>');
				$('#irc_msg').val('');
				$('#irc').get(0).scrollTop = $('#irc').get(0).scrollHeight;
			}
		});
	}
	catch(E)
	{
		alert("Exception: "+E);
	}
},1000);

TiDeveloper.formatURIs = function(str)
{
	var URI_REGEX = /((([hH][tT][tT][pP][sS]?|[fF][tT][pP])\:\/\/)?([\w\.\-]+(\:[\w\.\&%\$\-]+)*@)?((([^\s\(\)\<\>\\\"\.\[\]\,@;:]+)(\.[^\s\(\)\<\>\\\"\.\[\]\,@;:]+)*(\.[a-zA-Z]{2,4}))|((([01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}([01]?\d{1,2}|2[0-4]\d|25[0-5])))(\b\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)\b)?((\/[^\/][\w\.\,\?\'\\\/\+&%\$#\=~_\-@]*)*[^\.\,\?\"\'\(\)\[\]!;<>{}\s\x7F-\xFF])?)/;
	
	return $.gsub(str,URI_REGEX,function(m)
	{
		var x = m[0]
		if (x.indexOf('http://') == -1)
		{
			x = "http://" + x;
		}
		return '<a target="ti:systembrowser" href="' + x + '">' +x + '</a>';
	})
	
};

$.extend(
{
	gsub:function(source,pattern,replacement)
	{
		if (typeof(replacement)=='string')
		{
			var r = String(replacement);
			replacement = function()
			{
				return r;
			}
		}
	 	var result = '', match;
	    while (source.length > 0) {
	      if (match = source.match(pattern)) {
			result += source.slice(0, match.index);
	        result += String(replacement(match));
	        source  = source.slice(match.index + match[0].length);
	      } else {
	        result += source, source = '';
	      }
	    }
		return result;
	}
});
= Bowline

http://github.com/maccman/bowline
  
= DESCRIPTION

Ruby, HTML and JS desktop application framework.

= FEATURES

* MVC
* Uses Webkit
* View in HTML/JavaScript
* Binding between HTML & Ruby
* Cross platform (only osx atm ;)

= INTRODUCTION

If you've ever wished creating a desktop application was as simple
as creating a Rails website you'll be interested in Bowline.
Bowline is a Ruby GUI framework. You can design and build your 
applications in an agile way, deploying them cross platform.

Bowline lets you take your existing skills and apply them to the desktop.
You can write apps in HTML/JavaScript/Ruby without having to worry about
different platforms or a complex GUI API.

Compared to existing Ruby desktop frameworks, such as Shoes, Bowline's strengths
are its adherence to MVC and use of HTML/JavaScript. We think that, although Ruby is 
a great language for the backend, the view should be written in languages designed 
for that purpose, HTML and JavaScript.

Bowline also takes inspiration from Flex through its binders. Bowline will bind 
up Ruby and HTML - letting you concentrate on the more interesting things.

= CONTACT

info@eribium.org
http://eribium.org
http://twitter.com/maccman

= COMMUNITY

http://groups.google.com/group/bowline-dev

= REQUIREMENTS

- Mac OSX >=10.5 or Ubuntu
- Ruby 1.9
- Bowline gem

If you're on Ubuntu, you'll need to run:
  apt-get install libwebkit-dev

The other required libraries, such as bowline-desktop, are downloaded later by Bowline - you don't need to worry about these.

= INSTALLATION

Install the gem:
>> sudo gem install bowline

= USAGE

See the Twitter example at the end of this document, 
or browse the completed version here:
  http://github.com/maccman/bowline-twitter

= GENERATING

Using the bowline-gen binary (installed with Bowline) you can generate the following things:
  app       
  binder    
  helper    
  migration 
  model     
  window
  
Run 'bowline-gen --help' for more information.

= COMMANDS

App console:
>> script/console

Run application:
>> script/run

Build package for distribution:
>> script/build

= BINDERS

Binders are the core of Bowline. They're a model abstraction for the view which you can bind HTML to.
Binders in turn are associated with a Model. When the model gets changed, the binder makes sure that the HTML stays in sync.

You can create a binder like this:
>> bowline-gen binder users

Which will generate code a bit like this:
  class UsersBinder < Bowline::Binders::Base
  end

Now, in the view you can bind HTML to this collection, by
using the following javascript:
  $('#users').bowlineBind('UsersBinder');
  
You should probably become familiar with Chain.js (which bowline uses for binding): http://wiki.github.com/raid-ox/chain.js/

Suffice to say, the HTML looks a bit like this:
  <div id="users">
    <div class="item">
      <span class="name"></span>
      <span class="email"></span>
      <a href="#" class="destroy">Delete</a>
    </div>
  </div>

Now, were you to have a user object, you could do something like
this to update the HTML.

# TODO

= METHODS IN BINDERS

You can call both class and instance methods of the binders.
Following on from the above example with 'users', you could call a class
method called 'admins' on the users binder like so:

$('#users').invoke('admins')

It's the same syntax for invoking instance methods, just called
on one of the individual users:

$('#users div:first').invoke('instance_meth', 'arg1')

= HELPERS

Helpers are similar to helpers in Rails - they're helper methods for the view which
don't need a full blown binder to cater for.

You can call helpers with JavaScript like so:
$.bowline.helper('name', 'arg1', ['arg2'])

= MODELS

Bowline supports ActiveRecord and the Sqlite3 database. 
The packaging for distributing databases is still in development though.
You can use the SuperModel gem (http://github.com/maccman/supermodel) for models held in memory.

= WINDOWS

Bowline lets you control your application's windows. The API is under Bowline::Desktop::Window. 
There's a generator for creating new windows; they live under app/windows. 
Every window lives under the MainWindow class. If the MainWindow is closed, the app exits.
  
= BOWLINE-DESKTOP

Bowline-desktop is an abstraction upon wxWidgets for Bowline. It gives your app access to numerous APIs & system features, such as the Clipboard, Dock, Speakers and Windows.

The binary is built in C++, and statically linked with Ruby 1.9 and wxWidgets so it has no local dependencies. Compiling it isn't a requirement to use Bowline, but if you want to extend or contribute to Bowline-desktop, you can find it here:
http://github.com/maccman/bowline-desktop

= DISTRIBUTING

Once your app is ready for a release, you should run the following command to make sure all the gems required have been vendorised:
  gem bundle

Then, run:
  ./script/build

You can only build distributions for your local platform at the moment, but we're planning to extend this.

= THEMES

The Cappuccino Aristo theme has been specially customized for Bowline, you can see
examples of it in the Twitter client, and find it here:
  http://github.com/maccman/aristo

= EXAMPLES

Usage for a collection (of users):

    class Users < Bowline::Binders::Base
      bind User
      # These are class methods
      # i.e. methods that appear on
      # users, rather an user
      class << self
        def admins
          # This just replaces all the listed
          # users with just admins
          # TODO
          self.items = User.admins.all
        end
      end
  
      # Singleton methods, get added
      # to individual users.
      # 
      # self.element is the jQuery element
      # for that user, so calling highlight
      # on it is equivalent to:
      #  $(user).highlight()
      # 
      # self.item is the user object, in this case
      # an ActiveRecord instance
      # 
      # self.page gives you access to the dom, e.g:
      #  self.page.alert('hello world').call
  
      def destroy
        self.item.destroy
        self.element.remove
      end
    end
  end

  <html>
  <head>
  	<script src="javascripts/jquery.js" type="text/javascript"></script>
  	<script src="javascripts/jquery.chain.js" type="text/javascript"></script>
    <script src="javascripts/jquery.bowline.js" type="text/javascript"></script>
    <script src="javascripts/application.js" type="text/javascript"></script>
  	<script type="text/javascript" charset="utf-8">
  		jQuery(function($){
  		  $.bowline.ready(function(){
          // Bind the element users to UserBinder
      	  var users = $('#users').bowlineBind('UsersBinder', function(){
      	    var self = $(this);
      	    self.find('.destroy').click(function(){
      	      self.invoke('destroy');
      	      return false;
      	    })
      	  });
    	
        	$('#showAdmins').click(function(){
        	  users.invoke('admins');
        	  return false;
        	});
    	
          // Populate with all the users
        	users.invoke('index');
        	
          // Invoke a helper
        	var time = $.bowline.helper('current_time');
      	});
  	  });
  	</script>
  </head>
  <body>
    <div id="users">
      <div class="item">
        <span class="name"></span>
        <span class="email"></span>
        <a href="#" class="destroy">Delete</a>
      </div>
    </div>
  
    <a href="#" id="showAdmins">Show admins</a>
  </body>
  </html>

= Building a basic Twitter client

  Install the gem:
  >> sudo gem install bowline

  Run the app/binder generators:
  >> bowline-gen app bowline_twitter
  >> cd bowline_twitter
  >> bowline-gen binder tweets

  Copy tweets_binder.rb from examples to app/binders/tweets_binder.rb
  Copy tweet.rb from examples to app/models/tweet.rb
  Add your Twitter credentials to config/application.yml - in this simple example they're not dynamic.

  Copy twitter.html from examples to public/index.html

  Install the Twitter gem:
  >> sudo gem install twitter

  Add the Twitter gem to config/environment.rb: 
     config.gem "twitter"

  run:
  >> script/run

  That's it. You can see a snazzed up version here:
  http://github.com/maccman/bowline-twitter
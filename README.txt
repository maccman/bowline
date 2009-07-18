= Bowline

http://github.com/maccman/bowline
  
= DESCRIPTION

Ruby desktop application framework

= FEATURES

* MVC
* Uses Webkit
* View in HTML/JavaScript
* Binding between HTML & Ruby
* Cross platform (osx/linux/windows)

= INTRODUCTION

If you've ever wished creating a desktop application was as simple
as creating a Rails website you'll be interested in Bowline.

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

= INSTALLATION

Install the Titanium SDK:
  http://www.appcelerator.com/products/download-titanium/download/

Install the gem:
>> sudo gem install maccman-bowline --source http://gems.github.com

= USAGE

See the Twitter example at the end of this document, 
or browse the completed version here:
  http://github.com/maccman/bowline-twitter

= GENERATING

Using the bowline-gen binary (installed with Bowline) you can generate the following things:
  app                              Generates a new application.
  binder                           Generates a new binder, either a collection one, or a singleton one.
  helper                           Generates a new helper.
  migration                        Generates a new database migration.
  model                            Generates a new model.
  
Run 'bowline-gen --help' for more information.

= COMMANDS

App console:
>> script/console

Run application:
>> script/run

= BINDERS

Binders are the core of Bowline, they're classes that you can bind HTML to.
This means, if you can data in the class, the HTML also automatically changes.
It's a one way relationship though.

You can think of binders as similar to controllers in Rails.

There are two types of binders, singleton and collection.
Singleton binders are for a single data entity, such as the current logged in user.
And it goes without saying that collection binders are for an array of data.

You can create a collection binder like this:
>> bowline-gen binder users --type collection

Which will generate code a bit like this:
  module Binders
    class Users < Bowline::Collection
    end
  end

Now, in the view you can bind HTML to this collection, by
using the following javascript:
  $('#users').bowline('users');
  
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

Binders::Users.items = [User.first]

= METHODS IN BINDERS

You can call both class and instance methods of the binders.
Following on from the above example with 'users', you could call a class
method called 'admins' on the users binder like so:

$('#users').invoke('admins')

It's the same syntax for invoking instance methods, just called
on one of the individual users:

$('#users div:first').invoke('instance_method', 'arg1')

= HELPERS

Helpers are similar to helpers in Rails - they're helper methods for the view which
don't need a full blown binder to cater for.

You can call helpers with JavaScript like so:
$.bowline.helper('name', 'arg1', ['arg2'])

= MODELS

Bowline plans to fully support ActiveRecord and the Sqlite3 database.
This is still in development though.

= THEMES

The Cappuccino Aristo theme has been specially customized for Bowline, you can see
examples of it in the Twitter client, and find it here:
  http://github.com/maccman/aristo
  
= TITANIUM

Bowline is built on top of Titanium, an open source cross platform framework for desktop apps.
You can use any of the Titanium api methods in Ruby and JavaScript, like this:
  Titanium.UI.currentWindow.close

Site: http://www.appcelerator.com/products/titanium-desktop/
API Docs: http://www.codestrong.com/titanium/api/

= BUILDING

Once your app is complete, you should run the following command
to make sure all the gems required (including Bowline) have been vendorised:
  rake gems:sync

Then, run:
  rake app

You can only build distributions for your local platform, but
using the Titanium Developer app you can build on all three platforms.

= EXAMPLES

Usage for a collection (of users):

  module Binders
    class Users < Bowline::Collection
      # These are class methods
      # i.e. methods that appear on
      # users, rather an user
      class << self
        def index
          # self.items is a magic variable - 
          # it'll update the html binders
          self.items = User.all
        end
    
        def admins
          # This just replaces all the listed
          # users with just admins
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
      #  self.page.alert('hello world')
  
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
      	  var users = $('#users').bowline('users', function(){
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

  Install the Titanium SDK:
  http://www.appcelerator.com/products/download-titanium/download/

  Install the gem:
  >> sudo gem install maccman-bowline --source http://gems.github.com

  Run the app/binder generators:
  >> bowline-gen app bowline_twitter
  >> cd bowline_twitter
  >> bowline-gen binder tweets

  Copy tweets.rb from examples to app/binders/tweets.rb
  Add your Twitter credentials to tweets.rb - in this simple example they're not dynamic.

  Copy twitter.html from examples to public/index.html

  Install the Twitter gem:
  >> sudo gem install twitter

  Add the Twitter gem to config/environment.rb: 
     config.gem "twitter"

  run:
  >> script/run

  That's it. You can see a snazzed up version here:
  http://github.com/maccman/bowline-twitter
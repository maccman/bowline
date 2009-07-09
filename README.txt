= Bowline

http://github.com/maccman/bowline
  
= DESCRIPTION

Ruby desktop application framework

= FEATURES

* MVC
* Uses Webkit
* View in HTML/JavaScript
* Binding between HTML & Ruby
* Will be cross platform (though only OSX atm)

= CONTACT

info@eribium.org
http://eribium.org
http://twitter.com/maccman

= Usage - Building a basic Twitter client

Build Titanium by following the instructions here:
http://wiki.github.com/marshall/titanium/build-instructions

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
>> rake app:bundle
>> rake app:build

That's it

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
  	<script src="jquery.js"   type="text/javascript" charset="utf-8"></script>
  	<script src="chain.js"    type="text/javascript" charset="utf-8"></script>
  	<script src="bowline.js"  type="text/javascript" charset="utf-8"></script>
  	<script type="text/javascript" charset="utf-8">
  		jQuery(function($){
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

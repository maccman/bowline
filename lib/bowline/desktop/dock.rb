module Bowline
  module Desktop
    # The Dock module gives you a few methods to control
    # the Mac OSX dock. It's platform specific, and on platforms  
    # other than OSX calling the methods won't do anything.
    module Dock
      # Set the badge number. This is the little numbered red star above
      # the App's Dock icon. A good example of this is Mail.app incrementing
      # its icon's star whenever a new mail is received.
      def badge=(number)
        self._badge = number.to_s
      end
      module_function :badge=
      
      ##
      # :singleton-method: clear_badge
      # Clear the Icon's badge number
    end
  end
end
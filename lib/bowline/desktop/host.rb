module Bowline
  module Desktop
    module Host
      ##
      # :singleton-method: ip
      # Returns the computer's local IP address

      ##
      # :singleton-method: public_ip
      # Returns the computer's network IP address.
      # This method doesn't return the computer's Internet IP, 
      # for that you need a remote server.

      ##
      # :singleton-method: host_name
      # Returns the computer's host name
    end
  end
end
module Bowline
  module Desktop
    # The Clipboard module gives you cross-platform access to 
    # the systems native clipboard. At the moment, you can only
    # read/write strings. We're planning to extend this to images.
    module Clipboard
      ##
      # :singleton-method: write(str)
      # Write a string to the Clipboard.
      #   write("some text")
      
      ##
      # :singleton-method: write(str)
      # Read a string from the Clipboard.
      #   read #=> str
    end
  end
end
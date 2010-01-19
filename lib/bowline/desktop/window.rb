module Bowline
  module Desktop
    # Use the Window class to create new windows that your
    # users can interact with.
    # 
    # Usually, this class isn't instantiated directly, but rather
    # used in conjunction with the WindowManager class.
    # We recommend this approach, otherwise your window won't be
    # able to call out to Ruby, or use Bowline's binding API.
    # 
    # At the moment, these methods need to be called in the main thread.
    # This is a restriction we're hoping to remove soon.
    class Window
      include WindowMethods
      ##
      # :singleton-method: center(direction = :both)
      # Center the window in a given direction.
      # Supports the following directions:
      #   :both       - both horizontal and vertical to the app
      #   :horizontal - horizontal to the app
      #   :vertical   - vertical to the app
      #   :center     - center of the screen
      #
      # :call-seq:
      #   my_method(Range)
      #   my_method(offset, length)
      
      ##
      # :singleton-method: close
      # Close the window.
      
      ##
      # :singleton-method: disable
      # Disable user input to the window.
      
      ##
      # :singleton-method: enable
      # Enable user input to the window.
      
      ##
      # :singleton-method: chome=(bool)
      # Enable/disable window's chrome, 
      # i.e. the buttons & frame
      
      ##
      # :singleton-method: file=(path)
      # Load HTML file. You can pass an absolute path, a path
      # relative to the apps root, or a symbol, like so:
      #   window.file = :about
      # Passing a symbol will load the corrosponding HTML file
      # in the public directory. In this case, it'll load about.html

      ##
      # :singleton-method: url=(address)
      # Navigate to a HTTP address.
            
      ##
      # :singleton-method: id
      # Internal ID for the window. 
      
      ##
      # :singleton-method: dealocated?
      # Returns true if the window has been dealocated. 
      # Calling methods on dealocated windows has no effect. 
      # Instead, you'll need to create a new instance.
      
      ##
      # :singleton-method: modal(flag = true)
      # Disable/Enable user interaction with other windows.

      ##
      # :singleton-method: name=(str)
      # Set windows name (shown in the window's title bar)
      
      ##
      # :singleton-method: run_script(str)
      # Run JavaScript in this window.
      #
      # The return result types are very limited, 
      # only the following are supported:
      #   - Booleans
      #   - Integers
      #   - Strings
      # These all then get converted into strings.
      #
      # This API is very low level. We recommend you use the abstractions
      # provided by the WindowManager class, such as the 'page' method.

      ##
      # :singleton-method: raise
      # Raise this window above all other ones.
      
      ##
      # :singleton-method: show
      # Show this window. By default, windows are hidden.
      
      ##
      # :singleton-method: hide
      # Hide this window.
      
      ##
      # :singleton-method: close
      # Close this window. Once a window is closed, either by a user or 
      # by calling this method, it has been deallocated and may not be opened again. 
      #
      # You'll need to create a new instance of this class for a new window.
      # Calling any methods on a dealocated window won't have any effect.
      
      ##
      # :singleton-method: set_size(width, weight)
      # Set the window's width & height in pixels.
      
      ##
      # :singleton-method: height=(int)
      # Helper to set the window's height.

      ##
      # :singleton-method: width=(int)
      # Helper to set the window's width.
      
      ##
      # :singleton-method: set_position(x, y)
      # Set the window's position on the screen.
      
      ##
      # :singleton-method: select_dir(options = {})
      # Prompt the user to select a folder.
      #
      # Supported options are:
      #   :message
      #   :default_path
      
      ##
      # :singleton-method: select_file(options = {})
      # Prompt the user to select a file.
      #
      # Supported options are:
      #   :message
      #   :default_path
      #   :default_filename
      #   :default_extension
      #   :wildcard           - defaults to *.*
      #   :open               - show open button
      #   :save               - show save button
      #   :overwrite_prompt   - prompt if file already exists
      #   :file_must_exist
      # 
      # The :wildcard options may be a specification for multiple 
      # types of file with a description for each, such as:
      #   "BMP files (*.bmp)|*.bmp|GIF files (*.gif)|*.gif"
      
      ##
      # :singleton-method: shown?
      # Is this window currently shown?
      
      ##
      # :singleton-method: show_inspector(console = false)
      # Show WebInspector
    end
    
    class MainWindow #:nodoc:
      include WindowMethods
    end
  end
end
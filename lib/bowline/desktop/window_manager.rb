module Bowline
  module Desktop
    # This class provides a useful abstraction on the Window class.
    # It's the usual way of interfacing with your application's windows, 
    # and all of Bowline's windows normally inherit from it.
    # 
    # You'll need to call the setup! method, before calling using this class.
    # If the window is deallocated (i.e. closed), you'll need to call it again.
    # It's worth not calling the setup method before you need it, since it'll
    # increase the amount of CPU your application uses.
    # 
    # By default, windows are hidden. You'll need to show your custom windows explicitly 
    # before any user interaction using the show method. You can still load HTML/JavaScript
    # while the window is hidden.
    # 
    # If you don't want to show the window until it's properly loaded, you can use this pattern:
    #  MyWindow.on_load { MyWindow.show }
    #  MyWindow.file = :test
    #
    # Any undefined methods are delegated to the Window class.
    # See that class for the full windowing API.
    class WindowManager
      extend Bridge::ClassMethods
      js_expose
      
      extend Bowline::Watcher::Base
      watch :on_load
      
      class << self
        # An array of all the application's windows
        def windows
          Bowline::Desktop::WindowManager.subclasses.map(&:constantize)
        end
        
        # An array of all the application's windows that are currently shown
        def shown_windows
          windows.select(&:shown?)
        end
        
        # An array of all the application's allocated windows
        def allocated_windows
          windows.select(&:allocated?)
        end
        
        # Methods for subclasses:
        
        def window #:nodoc:
          @window
        end
        
        def allocated?
          !deallocated?
        end
        
        def deallocated?
          @window && @window.deallocated?
        end
        
        # Call this method to allocate a new window.
        # You'll need to do this before using it, 
        # or after it has been closed.
        def setup!
          return unless Desktop.enabled?
          return if allocated?
          if self.name == "MainWindow"
            @window = MainWindow.get
          else
            @window = Window.new
          end
          # Has to be an instance variable since
          # it is getting GCed (even if I mark it).
          @script_callback = Proc.new {|str|
            Bowline::Desktop::Bridge.call(self, str)
          }
          @window.script_callback = @script_callback
          true
        end
        
        # Evaluate JavaScript in this window. Pass
        # a block to capture the result. 
        # Example:
        #   eval("Bowline.msgs") {|res| puts res }
        def eval(*args, &block)
          JS.eval(window, *args, &block)
        end
        
        # Window Proxy instance. Use this to evaluate JavaScript
        # in this window, but in an object orientated way.
        # Example:
        #   page.yourFunc.call
        # 
        # See Bowline::Desktop::Proxy for full usage.
        def page
          Proxy.new(self)
        end
        
        def bowline
          page.Bowline
        end
        
        # Returns true if the both the HTML and JavaScript in
        # this window have loaded. Use the on_load event to know
        # when this window has loaded.
        def loaded?
          @loaded
        end
        
        ##
        # :singleton-method: on_load(method = nil, &block)
        # A Watcher event method that gets called when this window loads.
        # Example:
        #   on_load { puts "Window loaded!" }
        
        def loaded! # :nodoc:
          @loaded = true
          watcher.call(:on_load)
          true
        end
        
        # Delegate most methods to Window
        def method_missing(sym, *args) #:nodoc:
          if window && window.respond_to?(sym)
            return window.send(sym, *args)
          end
          # Window won't be around if Bowline::Desktop isn't enabled
          Bowline::Desktop.enabled? ? super : nil
        end
      end
    end
  end
end
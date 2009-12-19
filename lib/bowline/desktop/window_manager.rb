module Bowline
  module Desktop
    class WindowManager
      extend Bridge::ClassMethods
      js_expose
      
      extend Bowline::Watcher::Base
      watch :on_load
      
      class << self
        def windows
          subclasses.map(&:constantize)
        end
        
        def shown_windows
          windows.select(&:shown?)
        end
        
        def allocated_windows
          windows.select(&:allocated?)
        end
        
        # Methods for subclasses:
        
        def window
          @window
        end
        
        def allocated?
          !!@window
        end
        
        def setup
          return unless Desktop.enabled?
          return if @window && !@window.dealocated?
          if self.name == "MainWindow"
            @window = MainWindow.get
          else
            @window = Window.new
          end
        end
                
        def eval(*args, &block)
          JS.eval(window, *args, &block)
        end
        
        def page
          Proxy.new(window)
        end
        
        def loaded?
          @loaded
        end
        
        def loaded! # :nodoc:
          @loaded = true
          watcher.call(:on_load)
          true
        end
        
        # Delegate most methods to Window
        def method_missing(sym, *args)
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
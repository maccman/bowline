module Bowline
  class Window
    def self.window
      defined?(Titanium) && Titanium.UI.mainWindow.window
    end
    
    def initialize(obj = self.class.window)
      @object = obj
    end
    
    def method_missing(*args)
      Bowline.logger.info "Sending to Window: #{args.inspect}"
      if defined?(Titanium)        
        @object = @object.send(*args)
      end
      self
    end
  end
end
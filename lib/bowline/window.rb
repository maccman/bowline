module Bowline
  class Window
    def initialize(obj = Titanium.UI.mainWindow.window)
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
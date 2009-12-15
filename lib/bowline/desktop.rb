module Bowline
  module Desktop
    include Bowline::Logging
    extend Bowline::Watcher::Base
    watch :startup, :load, :tick, :idle
    
    def js_exposed?
      true
    end
    module_function :js_exposed?
    
    def enabled?
      $0 == "bowline"
    end
    module_function :enabled?
    
    @@loaded = false
    def loaded
      unless @@loaded
        @@loaded = true
        watcher.call(:startup)
      end
      watcher.call(:load)
    rescue => e
      log_error e
    end
    module_function :loaded
    
    def loaded?
      @@loaded == true
    end
    module_function :loaded?
    
    def idle
      watcher.call(:idle)
    rescue => e
      log_error e
    end
    module_function :idle

    def tick
      watcher.call(:tick)
    rescue => e
      log_error e
    end
    module_function :tick
  end
end
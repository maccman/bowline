module Bowline
  module Desktop
    include Bowline::Logging
    extend Bowline::Watcher::Base
    watch :tick, :idle
    
    def enabled?
      $0 == "bowline"
    end
    module_function :enabled?
    
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
module Bowline
  module Desktop
    include Bowline::Logging
    extend Bowline::Watcher::Base
    watch :on_tick, :on_idle
    
    def enabled?
      $0 == "bowline"
    end
    module_function :enabled?
    
    def idle
      watcher.call(:on_idle)
    rescue => e
      log_error e
    end
    module_function :idle

    def tick
      watcher.call(:on_tick)
    rescue => e
      log_error e
    end
    module_function :tick
  end
end
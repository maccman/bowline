module Bowline
  module Desktop
    include Bowline::Logging
    extend Bowline::Watcher::Base
    watch :on_tick, :on_idle
    
    ##
    # :singleton-method: on_tick(method = nil, &block)
    # A Watcher event method that gets called every few microseconds,
    # inside the application's main thread.
    # Example:
    #   on_tick { puts "App tick" }
    
    # Return true if we're currently 
    # being executed by bowline-desktop.
    def enabled?
      $0 == "bowline"
    end
    module_function :enabled?
    
    def idle #:nodoc:
      watcher.call(:on_idle)
    rescue => e
      log_error e
    end
    module_function :idle

    def tick #:nodoc:
      watcher.call(:on_tick)
    rescue => e
      log_error e
    end
    module_function :tick
  end
end
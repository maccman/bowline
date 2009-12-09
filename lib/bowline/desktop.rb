module Bowline
  module Desktop
    extend Bowline::Watcher::Base
    watch :startup, :load, :idle
    
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
    end
    module_function :loaded

    def idle
      watcher.call(:idle)
    end
    module_function :idle
  end
end
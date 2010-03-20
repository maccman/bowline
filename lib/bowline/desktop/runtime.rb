require "thread"

module Bowline
  module Desktop
    module Runtime
      def setup! #:nodoc:
        Desktop.on_tick(method(:poll))
      end
      module_function :setup!
      
      # Run block/method in main thread
      def main(method = nil, &block)
        proc = method||block
        if main_thread?
          proc.call
        else
          procs << proc
        end
      end
      module_function :main
      
      def main_thread?
        Thread.current == Thread.main
      end
      module_function :main_thread?
      
      private
        def poll
          while proc = procs.shift
            proc.call
          end
        end
        module_function :poll
      
        def procs
          @procs ||= []
        end
        module_function :procs 
    end
  end
end
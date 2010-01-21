module Bowline
  module Desktop
    module Runtime
      def setup
        Desktop.on_tick(method(:poll))
      end
      module_function :setup
      
      def run_in_main_thread(method = nil, &block)
        procs << method||block
      end
      module_function :run_in_main_thread
      
      private      
        def poll
          while proc = procs.shift
            proc.call
          end
        end
        module_function :poll
      
        # TODO - thread safety, needs mutex
        def procs
          Thread.main[:procs] ||= []
        end
        module_function :procs 
    end
  end
end
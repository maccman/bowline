module Bowline
  module Desktop
    module JS #:nodoc:
      class Script
        include Bowline::Logging
        
        attr_reader :window, :script, :prok
        def initialize(window, script, prok = nil)
          @window = window
          @script = script
          @prok   = prok
        end
        alias :windows :window
        
        def ready?
          multiple_windows? ? 
            windows.all?(&:loaded?) : 
              window.loaded?
        end
      
        def call
          if Desktop.enabled?
            trace "JS eval on #{window}: #{script}"
            if multiple_windows?
              windows.each {|w| w.run_script(script) }
              raise "Can't return from multiple windows" if prok
            else
              result = parse(window.run_script(script))
              Thread.new { prok.call(result) } if prok
            end
            result
          else
            trace "Pseudo JS eval on #{window}: #{script}"
            prok.call(nil)
          end
        end
        
        private
          def multiple_windows?
            windows.is_a?(Array)
          end
        
          def parse(str)
            # This is crazy! The JSON 
            # lib can't parse booleans
            case str
            when "true"  then true
            when "false" then false
            when nil     then nil
            else
              JSON.parse(str)
            end
          end
      end

      def poll
        run_scripts
      end
      module_function :poll
      
      def setup
        Desktop.on_tick(method(:poll))
      end
      module_function :setup
    
      def eval(win, str, method = nil, &block)
        script = Script.new(win, str, method||block)
        if Thread.current == Thread.main && script.ready?
          script.call
        else
          scripts << script
        end
      end
      module_function :eval
    
      private
        def run_scripts
          ready_scripts = scripts.select(&:ready?)
          while script  = ready_scripts.shift
            script.call
          end
        end
        module_function :run_scripts
        
        # TODO - thread safety, needs mutex
        def scripts
          Thread.main[:scripts] ||= []
        end
        module_function :scripts
    end
  end
end
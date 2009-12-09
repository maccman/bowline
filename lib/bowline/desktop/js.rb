module Bowline
  module Desktop
    module JS    
      class Script
        include Bowline::Logging
        
        attr_reader :str, :prok
        def initialize(str, prok = nil)
          @str, @prok = str, prok
        end
      
        def call
          if Desktop.enabled?
            result = JSON.parse(run_js_script(str))
            Thread.new { prok.call(result) } if prok
            result
          else
            trace "Pseudo JS eval: #{str}"
          end
        end
      end

      def poll
        run_scripts
      end
      module_function :poll
      
      def setup
        Desktop.on_idle(method(:poll))
      end
      module_function :setup
    
      def eval(str, method = nil, &block)
        script = Script.new(str, method||block)
        if Thread.current == Thread.main
          script.call
        else
          scripts << script
        end
      end
      module_function :eval
    
      private      
        def run_scripts
          while script = scripts.shift
            script.call
          end
        end
        module_function :run_scripts
      
        def scripts
          Thread.main[:scripts] ||= []
        end
        module_function :scripts
    end
  end
end
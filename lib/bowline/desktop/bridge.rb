module Bowline
  module Desktop
    module Bridge
      module ClassMethods
        def js_expose(opts = {})
          # TODO - implement options, 
          # like :except and :only
          define_method(:js_exposed?) do
            true
          end
        end
      end
      
      class Message
        def self.from_array(arr)
          arr.map {|i| self.new(i) }
        end
        
        def initialize(atts)
          atts.with_indifferent_access!
          @id     = atts[:id]
          @klass  = atts[:klass]
          @method = atts[:method]
        end
        
        def invoke
          # TODO - error support
          klass = @klass.constantize
          if klass.respond_to?(:js_exposed?) && 
              klass.js_exposed?
            result = klass.send(@method)
            proxy  = Proxy.new
            proxy.Bowline.invokeCallback(@id, result)
            run_js_script(proxy.to_s)
          end
        end
      end
      
      def setup
        Desktop.on_idle(method(:poll))
      end
      module_function :setup

      def poll
        result   = JSON.parse(run_js_script("Bowline.pollJS()"))
        messages = Message.from_array(result)
        messages.each(&:invoke)
      end
      module_function :poll
    end
  end
end
require "json"

module Bowline
  module Desktop
    module Bridge
      module ClassMethods
        ##
        # Extend you own classes with this module, and then call js_expose 
        # to expose your classes' class variables to JavaScript.
        #
        # Example:
        #   class FooClass
        #     extend Bowline::Desktop::Bridge::ClassMethods
        #     js_expose
        #     
        #     def self.foo
        #       return :bar
        #     end
        #   end
        #
        # JavaScript Example:
        #   Bowline.invoke("FooClass", "foo", function(res){
        #     console.log(res);
        #   })
        def js_expose(opts = {})
          # TODO - implement options, 
          # like :except and :only
          instance_eval <<-RUBY
            def js_exposed?(meth)
              true
            end
            
            def js_invoke(window, callback, method, *args)
              callback.call(send(method, *args))
            end
          RUBY
        end
      end
      
      class Message #:nodoc:
        include Bowline::Logging
        
        attr_reader :window, :id, :klass, :method_name, :args
        
        def initialize(window, atts)
          @window       = window
          atts          = atts.with_indifferent_access
          @id           = atts[:id]
          @klass        = atts[:klass]
          @method_name  = atts[:method].to_sym
          @args         = atts[:args] || []
        end
        
        def callback?
          @id != -1
        end
        
        def callback(result)
          return unless callback?
          proxy = Proxy.new(window)
          proxy = proxy.Bowline.invokeCallback(
            id, result.to_js.to_json
          )
          Runtime.main { 
            window.run_script(proxy.to_s)
          }
        end

        def invoke
          debug "JS invoking: #{klass}.#{method_name}(#{args.join(',')})"

          if klass == "_window"
            object = window
          else
            # TODO - security concerns with constantize
            object = klass.constantize
          end

          if object.respond_to?(:js_exposed?) && 
              object.js_exposed?(method_name)
            
            object.js_invoke(
              window, 
              method(:callback), 
              method_name, 
              *args
            )

          else
            raise "Method not allowed"
          end
        rescue => e
          log_error e
        end
      end
      
      def call(window, str) #:nodoc:
        result = JSON.parse(str)
        Message.new(window, result).invoke
      rescue => e
        Bowline::Logging.trace(str)
        Bowline::Logging.log_error(e)
      end
      module_function :call
    end
  end
end
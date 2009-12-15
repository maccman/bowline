module Bowline
  module Desktop
    module Bridge
      module ClassMethods
        # Extend you own classes with this
        # module, and then call js_expose 
        # to expose your classes' class
        # variables to JavaScript.
        #
        # Ruby Class:
        #   class FooClass
        #     extend Bowline::Desktop::Bridge::ClassMethods
        #     js_expose
        #     
        #     def self.foo
        #       return :bar
        #     end
        #   end
        #
        # JavaScript:
        #   Bowline.invoke("FooClass", "foo", function(res){
        #     console.log(res);
        #   })
        def js_expose(opts = {})
          # TODO - implement options, 
          # like :except and :only
          instance_eval <<-RUBY
            def js_exposed?
              true
            end
          RUBY
        end
      end
      
      class Message
        include Bowline::Logging
        
        def self.from_array(arr)
          arr.map {|i| self.new(i) }
        end
        
        def initialize(atts)
          atts    = atts.with_indifferent_access
          @id     = atts[:id]
          @klass  = atts[:klass]
          @method = atts[:method]
          @args   = atts[:args] || []
        end
        
        def invoke          
          # TODO - error support
          trace "JS invoking: #{@klass}.#{@method}(#{@args.join(',')})"
          # TODO - security concerns with constantize
          klass = @klass.constantize
          if klass.respond_to?(:js_exposed?) && 
              klass.js_exposed?
            result = klass.send(@method, *@args)
            proxy  = Proxy.new
            proxy.Bowline.invokeCallback(@id, result)
            run_js_script(proxy.to_s)
          else
            raise "Method not allowed"
          end
        rescue => e
          log_error e
        end
      end
      
      def setup
        Desktop.on_tick(method(:poll))
      end
      module_function :setup

      def poll
        result   = run_js_script("try {Bowline.pollJS()} catch(e) {false}")
        return unless result
        result   = JSON.parse(result)
        messages = Message.from_array(result)
        messages.each(&:invoke)
      end
      module_function :poll
    end
  end
end
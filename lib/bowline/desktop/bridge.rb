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
            def js_exposed?
              true
            end
            
            def js_invoke(window, method, *args)
              send(method, *args)
            end
          RUBY
        end
      end
      
      class Message #:nodoc:
        include Bowline::Logging
        
        def self.from_array(window, arr)
          arr.map {|i| self.new(window, i) }
        end
        
        attr_reader :window, :id, :klass, :method, :args
        
        def initialize(window, atts)
          @window = window
          atts = atts.with_indifferent_access
          @id     = atts[:id]
          @klass  = atts[:klass]
          @method = atts[:method].to_sym
          @args   = atts[:args] || []
        end

        def invoke
          if klass == "_window"
            object = window
          else
            # TODO - security concerns with constantize
            object = klass.constantize
          end
          trace "JS invoking: #{klass}.#{method}(#{args.join(',')})"
          if object.respond_to?(:js_exposed?) && object.js_exposed?
            result = object.js_invoke(window, method, *args)
            proxy  = Proxy.new(window)
            proxy.Bowline.invokeCallback(id, result)
            window.run_script(proxy.to_s)
          else
            raise "Method not allowed"
          end
        rescue => e
          log_error e
        end
      end
      
      def setup #:nodoc:
        Desktop.on_tick(method(:poll))
      end
      module_function :setup

      def poll #:nodoc:
        WindowManager.allocated_windows.each do |window|
          result   = window.run_script("try {Bowline.pollJS()} catch(e) {false}")
          next if result.blank? || result == "false"
          result   = JSON.parse(result)
          messages = Message.from_array(window, result)
          messages.each(&:invoke)
        end
      rescue => e
        Bowline::Logging.log_error(e)
      end
      module_function :poll
    end
  end
end
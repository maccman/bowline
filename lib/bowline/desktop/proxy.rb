module Bowline
  module Desktop
    class Proxy      
      # Use to call out to JavaScript.
      #
      # Use the method 'call' if you want 
      # to call a function, or the method 'res' if you want 
      # the result of a variable evaluation.
      #
      # You can pass a block as the last argument which will
      # be called with the result of the evaluation.
      # 
      # All arguments are serialized by JSON, so you can only pass
      # the following objects:
      # * Hash
      # * Array
      # * String
      # * Integer
      #
      # Usage:
      #   proxy.FooObject.messages = [1,2,3] #=> "FooObject.messages = [1,2,3]"
      #   proxy.FooObject.hi.call #=> "FooObject.hi()"
      #   proxy.FooObject.hi(1,2,3).bye.call #=> "FooObject.hi(1,2,3).bye()"
      #   proxy.FooObject.messages.res #=> "FooObject.messages"
      #   proxy.FooObject.messages.res {|result|
      #     puts "Messages are: #{result}"
      #   }
      #
      # Reasoning behind this class:
      #  * JavaScript needs to be called all at once
      #  * We don't know if it's a method call, or a variable
      
      def initialize(win)
        @window = win
        @crumbs = []
      end
      
      # Call a JavaScript function:
      #  proxy.myFunction('arg1').call
      def call(method = nil, &block)
        if @crumbs.empty?
          raise "No method provided"
        end
        string = to_s
        string << "()" unless string.last == ")"
        Bowline::Desktop::JS.eval(
          @window,
          "Bowline.invokeJS(#{string.inspect});", 
          method,
          &block
        )
      end
      
      # Evaluate a JavaScript variable:
      #  proxy.my_variable.res {|result| p result }
      def res(method = nil, &block)
        if @crumbs.empty?
          raise "No attribute provided"
        end
        Bowline::Desktop::JS.eval(
          @window,
          "Bowline.invokeJS(#{to_s.inspect});", 
          method,
          &block
        )
      end
      
      def method_missing(sym, *args) #:nodoc:
        method_name = sym.to_s
        @crumbs << [method_name, args]
        if method_name.last == "="
          call
        end
        self
      end
      
      # Return the JavaScript that is to be evaluated
      def to_s
        (@crumbs || []).inject([]) do |arr, (method, args)|
          str = method
          if args.any?
            str << "(" + args.to_json[1..-2] + ")"
          end
          arr << str
        end.join(".")
      end
      alias :to_js :to_s
      
      def inspect
        "<#{self.class.name}:#{@window} #{to_s}>"
      end   
    end
  end
end
module Bowline
  module Desktop
    class Proxy
      attr_reader :crumps
      
      # Fulfills two main objectives:
      #  * JS needs to be called all at once
      #  * We don't know if it's a method call, or a variable
      #
      # Usage:
      #   proxy.Bowline.messages = [1,2,3] #=> "Bowline.messages = [1,2,3]"
      #   proxy.Bowline.hi.call #=> "Bowline.hi()"
      #   proxy.Bowline.hi(1,2,3).bye.call #=> "Bowline.hi(1,2,3).bye()"
      #   proxy.Bowline.messages.res #=> "Bowline.messages"
      #
      def initialize
        @crumbs = []
      end

      def call(&block)
        if @crumbs.empty?
          raise "No method provided"
        end
        string = to_s
        string << "()" unless string.last == ")"
        Bowline::Desktop::JS.eval(
          "Bowline.invokeJS(#{string.inspect});", 
          &block
        )
      end
      
      def res(&block)
        if @crumbs.empty?
          raise "No attribute provided"
        end
        Bowline::Desktop::JS.eval(
          "Bowline.invokeJS(#{to_s.inspect});", 
          &block
        )
      end
      
      def method_missing(sym, *args)
        method_name = sym.to_s
        @crumbs << [method_name, args]
        if method_name.last == "="
          call
        end
        self
      end
      
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
        "<#{self.class.name} #{to_s}>"
      end   
    end
  end
end
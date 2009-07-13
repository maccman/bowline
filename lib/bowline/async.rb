module Bowline
  module Async
    def self.included(base)
      base.extend Methods
      base.send :include, Methods
      class << base
        extend Methods
      end
    end

    module Methods
      def async(*methods)
        methods.each {|meth|
          define_method("#{meth}_with_async") {|*args|
            callback = nil
            if(args.last.is_a?(::RubyKMethod))
              callback = args.pop
            end
            Thread.new do
              res = send("#{meth}_without_async", *args)
              callback.call(res) if callback
            end
          }
          alias_method_chain meth, :async
        }
      end
    end
  end
end
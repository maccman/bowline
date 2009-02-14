module Bowline
  class JQuery
    def method_missing(sym, args)
      self.class.dollar.send(sym, *args)
    end
    
    class << self    
      def for_element(el)
        Bowline::js.send("$", el)
      end
      
      def bind(event, fun, data)
        for_element("document.body").bind(event, data, fun)
      end
         
      def dollar
        Bowline::js.send("$")
      end
      
      def bowline
        dollar.bowline
      end
    end
  end
end
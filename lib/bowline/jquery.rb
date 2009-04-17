module Bowline
  class JQuery
    # Equivalent to: $.foo()
    def method_missing(sym, args)
      self.class.dollar.send(sym, *args)
    end
    
    class << self
      # Equivalent to: $('#item_id')
      def for_element(el)
        Bowline::js.send("jQuery", el)
      end
      
      # For binding global events
      # Equivalent to: $('body').bind()
      def bind(event, fun, data)
        for_element("body").bind(event, data, fun)
      end
      
      # Equivalent to: $
      def dollar
        Bowline::js.send("jQuery")
      end
      
      # Equivalent to: $.bowline
      def bowline
        dollar.bowline
      end
    end
  end
end
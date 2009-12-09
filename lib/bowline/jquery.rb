module Bowline
  class JQuery
    # Equivalent to: $.foo()
    def method_missing(sym, args)
      self.class.dollar.send(sym, *args)
    end
    
    class << self
      # Equivalent to: $('#item_id')
      def for_id(id)
        Bowline::page.jQuery("##{id}")
      end
      
      # Equivalent to: $
      def dollar
        Bowline::page.jQuery
      end
    end
  end
end
module Bowline
  class JQuery
    def method_missing(sym, args)
      dollar.send(sym, *args)
    end
    
    def for_element(el)
      Bowline::js.send("$", el)
    end
    
    def dollar
      Bowline::js.send("$")
    end
  end
end
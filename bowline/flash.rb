module Bowline
  class Flash
   def []=(key, value)
    JQuery.bowline.flash(key, value)
   end
  end
end
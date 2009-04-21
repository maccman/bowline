module Bowline
  class Singleton < Base
    cattr_accessor :item
    class << self
      def item=(arg)
        @@item = arg
        self.item_sync!
      end
    
      def item_sync!
        return unless @@item && @@elements
        # Call the chain.js function 'item' on elements
        @@elements.each {|i| 
          i.updateSingleton(@@item.to_js) 
        }
      end
      
      def find(*a)
        @@item
      end
    end
  end
end
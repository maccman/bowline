module Bowline
  module Binders
    class Collection < Base
      class << self
        def items=(args)
          @items = args
          self.item_sync!
          @items
        end
        
        def items
          @items ||= []
        end
    
        def item_sync!
          return unless @items && @elements
          value = @items.map {|item|
            hash = item.to_js
            hash.merge!({:_id => item.__id__})
            hash.stringify_keys 
          }
          @elements.each {|i|
            i.updateCollection(value) 
          }
        end
    
        def find(id)
          @items.find {|item| 
            item.__id__ == id
          }
        end
      end
    end
  end
end
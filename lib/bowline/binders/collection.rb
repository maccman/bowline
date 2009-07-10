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
          @elements.each {|i| 
            i.updateCollection(@items.to_js) 
          }
        end
    
        def find(id)
          @items.find {|item| 
            item.id == id
          }
        end
      end
    end
  end
end
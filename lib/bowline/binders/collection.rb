module Bowline
  module Binders
    class Collection < Base
      class ItemsProxy
        def initialize(&block)
          @callback = block
          @items = []
        end
        
        def method_missing(*args)
          @diff = @items.hash
          res = @items.send(*args)
          if @diff != @items.hash
            @callback.call
          end
          res
        end
      end
      
      class << self
        def items=(args)
          items.replace(args)
        end
        
        def items
          @items ||= ItemsProxy.new {
            self.item_sync!
          }
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
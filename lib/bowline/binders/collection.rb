module Bowline
  module Binders
    class Collection < Base
      class ItemsProxy
        def initialize(&block)
          @callback = block
          @items = []
        end
        
        def real
          @items
        end
        
        def method_missing(*args, &block)
          diff = @items.hash
          res = @items.send(*args, &block)
          if diff != @items.hash
            @callback.call
          end
          res
        end
      end
      
      class << self
        def items=(args)
          if args
            items.replace(args)
          else
            items.clear
          end
        end
        
        def items
          @items ||= ItemsProxy.new {
            self.item_sync!
          }
        end
    
        def item_sync!
          return unless @items && @elements
          value = @items.real.map {|item|
            hash = item.to_js
            hash.merge!({:_id => item.__id__})
            hash.stringify_keys 
          }
          @elements.each {|i|
            i.updateCollection(value) 
          }
        end
    
        def find(id)
          @items.real.find {|item| 
            item.__id__ == id
          }
        end
      end
    end
  end
end
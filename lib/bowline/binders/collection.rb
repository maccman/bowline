module Bowline
  module Binders
    class Collection < Base
      cattr_accessor :items
      class << self
        def items=(args)
          @@items = args
          self.item_sync!
          @@items
        end
    
        def item_sync!
          return unless @@items && @@elements
          @@elements.each {|i| 
            i.updateCollection(@@items.to_js) 
          }
        end
    
        def find(id)
          @@items.find {|item| 
            item.id == id if item.respond_to?(:id) 
          }
        end
      end
    end
  end
end
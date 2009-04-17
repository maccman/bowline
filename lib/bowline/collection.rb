module Bowline
  class Collection < Base
    cattr_accessor :items
    class << self
      def items=(args)
        @@items = args
        self.item_sync!
      end
    
      def item_sync!
        return unless @@items && @@elements
        # todo
        puts "Calling item_sync"
        p to_js(@@items)
        p @@elements
        js.alert(1)
        js.alert({})
        js.alert([{"one" => "two"}])
        js.alert(@@items)
        # Call the chain.js function 'items' on elements
        @@elements.each {|i| i.items(@@items.to_js) }
      end
    
      def find(id)
        @@items.find {|item| 
          item.id == id if item.respond_to?(:id) 
        }
      end
    end
  end
end
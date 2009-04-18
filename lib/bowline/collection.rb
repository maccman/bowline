module Bowline
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
        # todo
        puts "Calling item_sync"
        p @@items.to_js
        p @@elements
        puts "logging..."
        js.console.log([{"one" => "two"}])
        # js.console.log(@@items)
        # Call the chain.js function 'items' on elements
        puts "Setting"
        @@elements.each {|i| i.bowlineUpate([{"name" => "two", "three" => "four"}]) }
      end
    
      def find(id)
        @@items.find {|item| 
          item.id == id if item.respond_to?(:id) 
        }
      end
    end
  end
end
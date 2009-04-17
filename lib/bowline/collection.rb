module Bowline
  class Collection < Base
    cattr_accessor :items
    def self.items=(args)
      @@items = args
      self.item_sync!
    end
    
    def self.item_sync!
      return unless @@items
      puts "Calling item_sync"
      p to_js(@@items)
      p @@elements
      js.alert(1)
      js.alert({})
      js.alert([{"one" => "two"}])
      js.alert(@@items)
      @@elements.each {|i| i.items(to_js(@@items)) }
    end
  end
end
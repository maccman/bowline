module Bowline
  class Collection < Base
    cattr_accessor :items
    def self.items=(args)
      @@items = args
    end
    
    def self.item_sync!
      @@elements.each {|i| i.items(@@items) }
    end
  end
end
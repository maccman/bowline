module Bowline
  class Collection < Base
    cattr_accessor :items
    def self.items=(args)
      @@items = args
      @@elements.each {|i| i.items(args) }
    end
    
    def self.getItem(data)
      @@items.index(data)
    end
  end
end
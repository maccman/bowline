module Bowline
  class Singleton < Base
    cattr_accessor :item
    def self.item=(arg)
      @@item = arg
      @@elements.each {|i| i.items(arg) }
    end
    
    def self.getItem(data)
      return @@item if @@item == data
    end
  end
end
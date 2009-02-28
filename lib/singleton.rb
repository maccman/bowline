module Bowline
  class Singleton < Base
    cattr_accessor :item
    def self.item=(arg)
      @@item = arg
      self.item_sync!
    end
    
    def self.item_sync!
      @@elements.each {|i| i.item(to_js(@@item)) }
    end
  end
end
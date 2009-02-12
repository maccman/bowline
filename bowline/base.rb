module Bowline
  class Base
    class << self
      def js
        Bowline::js
      end
      alias js page
      
      def inherited(child)
        js.set("bowline.#{child.name}", child)
      end
      
      def jquery
        @@jquery ||= JQuery.new
      end
      
      def observer
        @@observer ||= Observer.new
      end
      
      def show_view(name)
        js.window.location = "app://#{name}.html"
      end
      
      def setup(d)
        @@elements ||= []
        @@elements << d
      end
    end
    
    attr_reader :element
    
    def initialize(element)
      @element = element
    end
    
    def js
      self.class.js
    end
    alias js page
    
    def jquery
      self.class.jquery.for_element(element)
    end
  end
end
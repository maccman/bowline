module Bowline
  class Base
    cattr_accessor :session
    cattr_accessor :params
    extend Utils
    
    class << self
      def js
        Bowline::js
      end
      alias js page
      
      def inherited(child)
        js.set("$.bowline.#{underscore(child.name)}", child)
      end
      
      def jquery
        @@jquery ||= JQuery.new
      end
      
      def observer
        @@observer ||= Observer.new
      end
      
      def session
        @@session ||= {}
      end
      
      def params=(p)
        case p
        when String
          # Stolen from Ramaze
          m = proc {|_,o,n|o.merge(n,&m)}
          @@params = params.inject({}) do |hash, (key, value)|
            parts = key.split(/[\]\[]+/)
            hash.merge(parts.reverse.inject(value) { |x, i| {i => x} }, &m) 
          end
        else
          @@params = p
        end
      end
      
      def show_view(name)
        js.window.location = "app://#{name}.html"
      end
      
      def setup(d)
        @@elements ||= []
        @@elements << d
        self.item_sync!
      end
    end
    
    attr_reader :element
    
    def initialize(element)
      # jQuery element
      @element = element
    end
    
    def js
      self.class.js
    end
    alias js page
    
    def jquery
      self.class.jquery
    end
    
    def dom
      self.element[0]
    end
  end
end
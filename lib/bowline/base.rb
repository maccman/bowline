module Bowline
  class Base
    cattr_accessor :session
    cattr_accessor :params
    
    class << self
      def js
        Bowline::js
      end
      alias :page :js
      
      def jquery
        @@jquery ||= JQuery.new
      end
      
      def observer
        @@observer ||= Observer.new
      end
      
      def session
        @@session ||= {}
      end
      
      def show_view(name)
        js.window.location = "app://#{name}.html"
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
      
      def setup(d)
        @@elements ||= []
        @@elements << d
        self.item_sync!
      end
      
      def inherited(child)
        return if self == Bowline::Base
        name = child.name.underscore
        name = name.split('/').last
        js.set("jQuery.bowline.#{name}", child)
      end
      
      protected
      
        def to_js(ob)
          if ob.respond_to?(:to_js)
            ob.to_js
          elsif ob.respond_to?(:attributes)
            ob.attributes
          else
            ob
          end
        end      
    end
    
    attr_reader :element
    
    def initialize(element)
      # jQuery element
      @element = element
    end
    
    def trigger(event, data = nil)
      self.element.trigger(event, data)
    end
    
    def js
      self.class.js
    end
    alias :page :js
    
    def jquery
      self.class.jquery
    end
    
    def observer
      self.class.observer
    end
    
    def show_view(*args)
      self.class.show_view(*args)
    end
    
    def dom
      self.element[0]
    end
  end
end
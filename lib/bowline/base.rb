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
      
      def instance(el)
        self.new(el).method(:send)
      end
      
      def invoke(method)
        # todo *args doesn't work with Titanium
        send(method)
      end
      
      def inherited(child)
        return if self == Bowline::Base
        return if child == Bowline::Singleton
        return if child == Bowline::Collection
        name = child.name.underscore
        name = name.split('/').last
        js.send("bowline_#{name}_setup=",    child.method(:setup))
        js.send("bowline_#{name}_instance=", child.method(:instance))
        js.send("bowline_#{name}=",          child.method(:invoke))
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
    attr_reader :item
    
    def initialize(element)
      # jQuery element
      @element = element
      # todo @item
    end
    
    def trigger(event, data = nil)
      self.element.trigger(event, data)
    end
    
    def js
      self.class.js
    end
    # todo - decide on API
    alias :page :js
    alias :window :js
    
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
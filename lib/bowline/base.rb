module Bowline
  class Base
    cattr_accessor :params
    
    class << self
      # The raw JavaScript window object
      def js
        Bowline::js
      end
      
      # Equivalent of the 'jQuery' function
      def jquery
        @@jquery ||= JQuery.new
      end
      
      # See the Observer class
      def observer
        @@observer ||= Observer.new
      end
      
      # Change which page we're on
      def show_view(name)
        js.window.location = "app://#{name}.html"
      end
      
      def params=(p)
        case p
        when String
          # Params comes in a string (since it's a
          # serialized form) - we need to make it into
          # a nestled hash.
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
    end
    
    attr_reader :element
    attr_reader :item
    
    def initialize(element)
      # jQuery element
      @element = element
      # Calling chain.js 'item' function
      @item    = element.item()
      if @item
        @item.with_indifferent_access
        # If possible, find Ruby object
        if @item[:id] && respond_to?(:find)
          @item = find(@item[:id])
        end
      end
    end
    
    # Trigger jQuery events on this element
    def trigger(event, data = nil)
      self.element.trigger(event, data)
    end
    
    # Bind event to element:
    # bind(:click) { puts "element clicked" }
    # todo - two events with the same item/event overwrite each other
    def bind(event, method_name, &block)
      event_name = [event, item_id].join(":")
      callback = block
      callback ||= begin
        method_name.is_a?(Method) ? 
          method_name : method(method_name)
      end
      self.observer.append(event_name, callback)
      self.element.bind(
        event.to_s, 
        event_name, 
        self.observer.method(:call)
      )
    end
    
    def click(method_name = nil, &block)
      bind(:click, method, &block)
    end
    
    # Raw DOM element
    def dom
      self.element[0]
    end
    
    # Shortcut methods
    
    # See self.class.show_view
    def show_view(*args)
      self.class.show_view(*args)
    end
    
    # See self.class.js
    def js
      self.class.js
    end
    
    # See self.class.jquery
    def jquery
      self.class.jquery
    end
    
    # See self.class.observer
    def observer
      self.class.observer
    end
    
    private
      # This is just a unique identifier
      # for the item - and isn't
      # used in the dom
      def item_id
        if item.respond_to?(:dom_id)
          item.dom_id
        else
          [
            item.id, 
            self.class.name.underscore
          ].join("_")
        end
      end
  end
end
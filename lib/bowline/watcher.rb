module Bowline
  class Watcher
    # Callbacks on steroids.
    # Add callbacks as class methods, or instance ones.
    # 
    # class MyClass
    #   extend Bowline::Watcher::Base
    #   watch :update, :create
    # 
    #   def self.update
    #     watcher.call(:update)
    #   end
    # 
    #   def create
    #     watcher.call(:create)
    #   end
    # end
    # 
    # MyClass.on_update { puts 'update' }
    # MyClass.new.on_create { puts 'create' }
    
    module Base    
      def watch(*names)
      	names.each do |name|
          # Because define_method only takes a block,
          # which doesn't accept multiple arguments
          script = <<-RUBY
            def #{name}(*args, &block)
              watcher.append(:#{name}, *args, &block)
            end
          RUBY
          instance_eval script
          class_eval    script
  			end
      end
      
      def watcher
        @watcher ||= Watcher.new
      end
    end
  
    class Callback
      attr_reader :event, :prok
    
      def initialize(watcher, event, prok)
      	@watcher, @event, @prok = watcher, event, prok
      end
    
      def call(*args)
      	@prok.call(*args)
      end
    
      def remove
      	@watcher.remove(@event, @prok)
      end
    end
  
    def initialize
      @listeners = {}
    end
  
    def append(event, method = nil, &block)
      callback = Callback.new(self, event, method||block)
      (@listeners[event] ||= []) << callback
      callback
    end
  
    def call(event, *args)
      return unless @listeners[event]
      @listeners[event].each do |callback|
        callback.call(*args)
      end
    end
  
    def remove(event, value=nil)
      return unless @listeners[event]
      if value
        @listeners[event].delete(value)
        if @listeners[event].empty?
          @listeners.delete(event)
        end
      else
        @listeners.delete(event)
      end
    end
  
    def clear
      @listeners = {}
    end
  end
end
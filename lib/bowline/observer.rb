# o = Observable.new
# o.append('greet') {
#  puts 'hi'
# }
# o.call('greet')
#
# def greet(who)
#  puts "Hi #{who}"
# end
# event = o.append('greet', method(:greet), 'Alex')
# o.call('greet')
# event.remove

module Bowline
  class Observable
    class Event
      attr_reader :type, :callback
      def initialize(observable, type, callback = nil)
        @observable = observable
        @type       = type
        @callback   = callback
      end
      
      def call(*args)
        @callback.call(*args)
      end
      
      def remove
        @observable.remove(self)
      end
    end
    
    def initialize
      @listeners = {}
    end

    def append(event, method = nil, &block)
      event = Event.new(self, event, method||block)
      (@listeners[event] ||= []) << event
      event
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
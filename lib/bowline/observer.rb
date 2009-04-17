# o = Observer.new
# o.append('greet') {
#  puts 'hi'
# }
# o.call('greet')
#
# def greet(who)
#  puts "Hi #{who}"
# end
# o.append('greet', method(:greet), 'Alex')
# o.call('greet')

module Bowline
  class Observer
    def initialize
      @listeners = {}
    end
    
    # Append block/method to listeners
    def append(event, method = nil, *args, &block)
      (@listeners[event.to_s] ||= []) << [method||block, args]
    end
    
    # Like append, but adds it to the body too
    def on(event, method = nil, &block)
      append(event, method, &block)
      JQuery.bind(event.to_s, method(:call), event)
    end
    
    # Call event
    def call(event)
      event = event.to_s
      @listeners[event].each do |callback|
        callback[0].call(*callback[1])
      end
      @listeners.delete(event)
    end
  
    def clear
      @listeners = {}
    end
  end
end
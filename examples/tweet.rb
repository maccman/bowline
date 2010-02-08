require "supermodel"

class Tweet < SuperModel::Base
  class << self
    def poll
      destroy_all
      populate(timeline)
    end
    
    def timeline
      twitter.friends_timeline.collect {|t|
        t.delete('user')
        t.to_hash
      }
    end
    
    def update(status)
      twitter.update(status)
    end

    private
      def twitter
        httpauth = Twitter::HTTPAuth.new(
          AppConfig.username, 
          AppConfig.password
        )
        Twitter::Base.new(httpauth)
      end
  end
end

Thread.new do
  loop do
    Tweet.poll
    sleep 60
  end
end
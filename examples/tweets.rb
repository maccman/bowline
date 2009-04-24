module Binders
  class Tweets < Bowline::Binders::Collection
    class << self
      def index
        self.items = timeline
      end
      
      def update(status)
        twitter.update(status)
        index # update timeline
      end
      
      protected
        def twitter
          httpauth = Twitter::HTTPAuth.new('user', 'pass')
          Twitter::Base.new(httpauth)
        end
        
        def timeline
          twitter.friends_timeline.collect {|t|
            t.delete('user')
            t.to_hash
          }
        end
    end
    
  end
end # Binders
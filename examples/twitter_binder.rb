class TwitterBinder < Bowline::Binders::Collection
  cattr_accessor :user, :pass
  
  class << self    
    def index
      self.items = timeline
    end
    
    def update(text)
      twit.update(text)
      index # update timeline
    end
    
    def login
      self.user, self.pass = params[:user], params[:pass]
      if logged_in?
        show_view :twitter
        index
      else
        js.alert('Credentials invalid')
      end
    end
    
    def logged_in?
      return false unless self.user && self.pass
      begin
        twit.timeline && true
      rescue Twitter::CantConnect
        false
      end
    end
    
    protected
      def twit
        httpauth = Twitter::HTTPAuth.new(self.user, self.pass)
        Twitter::Base.new(httpauth)
      end
      
      def timeline
        twit.friends_timeline.collect {|t|
          t.delete('user')
          t.to_hash
        }
      end
  end
end
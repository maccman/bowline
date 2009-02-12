class TwitterBinder < Bowline::Collection
  class << self
    # What about filters - should they be implemented?
    cattr_accessor :user, :pass
    
    def index
      self.items = twit.timeline(:user)
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
        Twitter::Base.new(self.user, self.pass)
      end
  end
end
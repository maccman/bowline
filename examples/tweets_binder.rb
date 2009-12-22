class TweetsBinder < Bowline::Binders::Base
  bind Tweet
  class << self
    def update(status)
      klass.update(status)
    end
  end
end
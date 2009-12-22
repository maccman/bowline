class TweetsBinder < Bowline::Binders::Base
  bind Tweet
  def self.update(status)
    klass.update(status)
  end
end
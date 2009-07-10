module Bowline
  module Helpers
    def self.init
      Bowline.js.send("bowline_helper=", method(:send))
    end
  end
end
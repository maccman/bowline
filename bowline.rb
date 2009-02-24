module Bowline
  def self.js
    Window if defined?(Window)
  end
end

$: << File.dirname(__FILE__)

require 'bowline/ext/class'
require 'bowline/ext/string'

require 'bowline/jquery'
require 'bowline/observer'

require 'bowline/base'
require 'bowline/collection'
require 'bowline/singleton'
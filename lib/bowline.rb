module Bowline
  def self.js
    if defined?(Window)
      Window
    else
      Class.new { def self.method_missing(*a); self; end }
    end
  end
end

$LOAD_PATH << File.dirname(__FILE__)

require 'bowline/ext/class'
require 'bowline/ext/string'
require 'bowline/gem_dependency'
require 'bowline/initializer'

require 'bowline/jquery'
require 'bowline/observer'

require 'bowline/base'
require 'bowline/collection'
require 'bowline/singleton'
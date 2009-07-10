module Bowline
  # The raw JavaScript window object
  def self.js
    if defined?($app_window)
      $app_window
    else
      Class.new { 
        def self.method_missing(*a)
          Bowline.logger.info "Sending to Window: #{a.inspect}"
          self
        end 
      }
    end
  end
  
  # Change which page we're on
  def self.show_view(name)
    js.location = "app://public/#{name}.html"
  end
  
  class Base
  end
end

$LOAD_PATH << File.dirname(__FILE__)

require 'bowline/version'

require 'bowline/ext/object'
require 'bowline/ext/array'
require 'bowline/ext/class'
require 'bowline/ext/string'

require 'bowline/helpers'
require 'bowline/gem_dependency'
require 'bowline/initializer'

require 'bowline/jquery'
require 'bowline/observer'

require 'bowline/binders'
require 'bowline/binders/collection'
require 'bowline/binders/singleton'
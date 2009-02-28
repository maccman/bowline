module Bowline
  def self.js
    if defined?(Window)
      Window
    else
      Class.new do
        def self.method_missing(*a)
        end
      end
    end
  end
end

# todo
require File.dirname(__FILE__) + '/lib/ext/class'
require File.dirname(__FILE__) + '/lib/ext/string'
require File.dirname(__FILE__) + '/lib/gem_dependency'
require File.dirname(__FILE__) + '/lib/initializer'

require File.dirname(__FILE__) + '/lib/jquery'
require File.dirname(__FILE__) + '/lib/observer'

require File.dirname(__FILE__) + '/lib/base'
require File.dirname(__FILE__) + '/lib/collection'
require File.dirname(__FILE__) + '/lib/singleton'
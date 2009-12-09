Thread.abort_on_exception = true

module Bowline
  def page
    Bowline::Desktop::Proxy.new
  end
  module_function :page

  def bowline
    page.Bowline
  end
  module_function :bowline
end

$LOAD_PATH << File.dirname(__FILE__)

require 'bowline/version'

require 'bowline/ext/object'
require 'bowline/ext/array'
require 'bowline/ext/class'
require 'bowline/ext/string'

require 'bowline/watcher'
require 'bowline/local_model'

require 'bowline/desktop/js'
require 'bowline/desktop/proxy'
require 'bowline/desktop/bridge'

require 'bowline/helpers'
require 'bowline/dependencies/lib/dependencies'
require 'bowline/initializer'

require 'bowline/jquery'

require 'bowline/binders'
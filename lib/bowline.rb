Thread.abort_on_exception = true

module Bowline
  def lib_path
    File.expand_path(
      File.join(File.dirname(__FILE__), *%w[..])
    )
  end
  module_function :lib_path
  
  def assets_path
    File.join(lib_path, "assets")
  end
  module_function :assets_path
  
  def page
    Bowline::Desktop::Proxy.new
  end
  module_function :page

  def bowline
    page.Bowline
  end
  module_function :bowline
  
  module Base
  end
end

require 'active_support'

$LOAD_PATH << File.dirname(__FILE__)

require 'bowline/version'

require 'bowline/ext/object'
require 'bowline/ext/array'
require 'bowline/ext/class'
require 'bowline/ext/string'

require 'bowline/logging'
require 'bowline/watcher'
require 'bowline/local_model'

require 'bowline/platform'

require 'bowline/desktop'
require 'bowline/desktop/js'
require 'bowline/desktop/proxy'
require 'bowline/desktop/bridge'

require 'bowline/helpers'
require 'bowline/dependencies/lib/dependencies'
require 'bowline/initializer'

require 'bowline/jquery'

require 'bowline/binders'
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
require 'bowline/desktop/app'
require 'bowline/desktop/bridge'
require 'bowline/desktop/clipboard'
require 'bowline/desktop/dialog'
require 'bowline/desktop/dock'
require 'bowline/desktop/host'
require 'bowline/desktop/misc'
require 'bowline/desktop/network'
require 'bowline/desktop/sound'
require 'bowline/desktop/window_methods'
require 'bowline/desktop/window'
require 'bowline/desktop/js'
require 'bowline/desktop/proxy'
require 'bowline/desktop/bridge'
require 'bowline/desktop/window_manager.rb'

require 'bowline/helpers'
require 'bowline/dependencies/lib/dependencies'
require 'bowline/initializer'

require 'bowline/binders'
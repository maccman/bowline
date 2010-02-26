require 'active_support'
require 'active_support/dependencies'
require 'active_support/core_ext/string/access'
require 'active_support/core_ext/kernel/reporting'
require 'active_support/core_ext/hash/indifferent_access'

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

$LOAD_PATH.unshift(File.dirname(__FILE__))
$LOAD_PATH << File.join(Bowline.lib_path, 'vendor')

require 'bowline/version'

require 'bowline/ext/object'
require 'bowline/ext/array'

require 'bowline/logging'
require 'bowline/watcher'

require 'bowline/platform'
require 'bowline/library'

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
require 'bowline/desktop/runtime'
require 'bowline/desktop/js'
require 'bowline/desktop/proxy'
require 'bowline/desktop/bridge'
require 'bowline/desktop/window_manager.rb'

require 'bowline/helpers'
require 'bowline/app_config'
require 'bowline/initializer'

require 'bowline/binders'
require 'bowline/binders/observer'
require 'bowline/binders/collection'
require 'bowline/binders/singleton'

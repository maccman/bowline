unless Bowline::Desktop.enabled?
  raise "Script not executed by bowline-desktop"
end

require "#{APP_ROOT}/config/environment"

if ENV["IRB"]
  require "irb"
  require "irb/completion"
  IRB.start
  Bowline::Desktop::App.exit
end
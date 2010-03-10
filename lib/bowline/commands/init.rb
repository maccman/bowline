unless Bowline::Desktop.enabled?
  raise "Script not executed by bowline-desktop"
end

require Bowline.root.join(*%w{config environment})

if ENV["APP_IRB"]
  require "irb"
  require "irb/completion"
  IRB.start
  Bowline::Desktop::App.exit
end
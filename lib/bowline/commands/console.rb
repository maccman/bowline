require "optparse"
require "irb"
require "irb/completion"

options = {}
OptionParser.new do |opt|
  opt.banner = "Usage: console [environment] [options]"
  opt.on("--debugger", "Enable ruby-debugging for the console.") { |v| options[:debugger] = v }
  opt.parse!(ARGV)
end

if options[:debugger]
  begin
    require "ruby-debug"
    puts "=> Debugger enabled"
  rescue Exception
    puts "You need to install ruby-debug to run the console in debugging mode. With gems, use 'gem install ruby-debug'"
    exit
  end
end

require "#{APP_ROOT}/config/environment"
IRB.start
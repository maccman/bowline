# Don't change this file!
# Configure your app in config/environment.rb

APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), "..")) unless defined?(APP_ROOT)
local_path = File.join(APP_ROOT, *%w{vendor bowline lib bowline.rb})

if File.exist?(local_path)
  require local_path
else
  require "rubygems"
  require "bowline"
end
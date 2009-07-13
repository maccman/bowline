# Don't change this file!
# Configure your app in config/environment.rb and config/environments/*.rb

APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), "..")) unless defined?(APP_ROOT)

gems_path    = File.join(APP_ROOT, *%w{vendor gems gems})
bowline_path = Dir[File.join(gems_path, *%w{{maccman-bowline*,bowline*} lib bowline.rb})][-1]

if bowline_path
  require bowline_path
else
  require "rubygems"
  require "bowline"
end
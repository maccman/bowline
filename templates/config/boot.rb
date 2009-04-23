# Don't change this file!
# Configure your app in config/environment.rb and config/environments/*.rb

APP_ROOT = File.join(File.dirname(__FILE__), "..") unless defined?(APP_ROOT)

bowline_path = File.join(APP_ROOT, *%w[vendor bowline lib bowline.rb])

if File.exist?(bowline_path)
  require bowline_path
else
  require "rubygems"
  require "bowline"
end
# Don't change this file!
# Configure your app in config/environment.rb and config/environments/*.rb

if defined?(Titanium)
  # Hack for load paths - Titanium doesn't add .
  app_resources = Titanium.App.appURLToPath("app://index.html")
  APP_ROOT = File.dirname(app_resources)
else
  APP_ROOT = File.join(File.dirname(__FILE__), "..")
end
$LOAD_PATH << APP_ROOT
$LOAD_PATH.uniq!

bowline_path = File.join(APP_ROOT, *%w[vendor bowline lib bowline.rb])

if File.exist?(bowline_path)
  require bowline_path
else
  require "rubygems"
  require "bowline"
end
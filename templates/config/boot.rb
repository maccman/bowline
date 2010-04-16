APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), "..")) unless defined?(APP_ROOT)

# Use Bundler (preferred)
environment = File.expand_path("../../.bundle/environment", __FILE__)
if File.exist?("#{environment}.rb")
  require environment

# Use RubyGems
else  
  require "rubygems"
  require "bundler"
  Bundler.setup
end

require "bowline"
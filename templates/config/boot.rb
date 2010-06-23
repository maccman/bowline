APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), "..")) unless defined?(APP_ROOT)

# Fixing Ruby 1.9.2 bugs
%w{enc/encdb enc/trans/transdb}.each { |init| require init rescue nil }

require "rubygems"

# Use Bundler (preferred)
environment = File.expand_path("../../vendor/gems/environment", __FILE__)
if File.exist?("#{environment}.rb")
  require environment

# Use RubyGems
else
  abort "Please run 'bowline-bundle install'"
end

require "bowline"
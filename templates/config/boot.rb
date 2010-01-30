APP_ROOT = File.expand_path("../../", __FILE__) unless defined?(APP_ROOT)

# Use Bundler (preferred)
environment = File.expand_path('../../vendor/gems/environment', __FILE__)
if File.exist?("#{environment}.rb")
  require environment

# Use vendor/bowline and RubyGems
else
  vendor_rails = File.expand_path('../../vendor/bowline', __FILE__)
  if File.exist?(vendor_rails)
    Dir["#{vendor_rails}/*/lib"].each { |path| $:.unshift(path) }
  end

  require 'rubygems'
end

require "bowline"
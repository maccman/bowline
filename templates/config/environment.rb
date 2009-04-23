# Bootstrap the Bowline environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Bowline::Initializer.run do |config|
  config.name = <%= name.camel_case %>
    
  # config.gem "net-mdns", :lib => 'net/dns/mdns'
  # config.gem "rack"
  # config.gem "rubyzip", :lib => 'zip/zip'

  config.frameworks += [:active_record, :active_resource]
end
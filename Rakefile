begin
  require 'jeweler'
  Jeweler::Tasks.new do |gemspec|
    gemspec.name = "bowline"
    gemspec.summary = "Bowline GUI framework"
    gemspec.email = "alex@leadthinking.com"
    gemspec.homepage = "http://github.com/maccman/bowline"
    gemspec.description = "Ruby/JS GUI framework"
    gemspec.authors = ["Alex MacCaw"]
    gemspec.add_dependency('templater',     '>= 0.3.2')
    gemspec.add_dependency('activesupport', '>= 2.3.2')
  end
rescue LoadError
  puts "Jeweler not available. Install it with: sudo gem install technicalpickles-jeweler -s http://gems.github.com"
end

task :write_version do 
  require File.join(File.dirname(__FILE__), *%w[lib bowline])
  File.open('VERSION', 'w') {|f| f.write Bowline::Version::STRING }
end
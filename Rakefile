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
    gemspec.add_dependency('activesupport', '>= 3.0.0.beta')
    gemspec.add_dependency('rubyzip2',      '>= 2.0.1')
    gemspec.add_dependency('bundler',       '>=0.9.19')
    gemspec.add_dependency('supermodel')
    
    gemspec.post_install_message = <<-POST_INSTALL_MESSAGE
    #{'*'*50}

      Thank you for installing Bowline.
      
      If you're on Linux, please install the WebKit library:
        sudo apt-get install libwebkit-dev

    #{'*'*50}
    POST_INSTALL_MESSAGE
  end
rescue LoadError
  puts "Jeweler not available. Install it with: sudo gem install technicalpickles-jeweler -s http://gems.github.com"
end

task :write_version do 
  require File.join(File.dirname(__FILE__), *%w[lib bowline])
  File.open('VERSION', 'w') {|f| f.write Bowline::Version::STRING }
end

require 'rake/rdoctask'
desc "Generate documentation for Bowline."
Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = "rdoc"
  rdoc.title    = "Bowline"
  rdoc.options << "--line-numbers" << "--inline-source"
  rdoc.rdoc_files.include("README.txt")
  rdoc.rdoc_files.include("lib/**/*.rb")
end

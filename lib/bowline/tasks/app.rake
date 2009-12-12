require 'fileutils'
require 'erb'

namespace :app do
  desc "Build app"
  task :build do
    Rake::Task["build:#{Bowline::Platform.type}"].invoke
  end
  
  namespace :build do
    task :osx => :environment do
      # Create folder structure
      # Create Info.plist and other required files
      # Copy executable into MacOS
      # Copy app into Resources
      # Copy ruby lib folder into Resources/ruby
      # Makeicns
      # Create a DMG of the app
      config = Bowline.configuration
      build_path = File.join(APP_ROOT, "build")
      app_path   = File.join(build_path, "#{config.name}.app", "Contents")
      FileUtils.mkdir_p(app_path)
      FileUtils.cd(app_path) do
        FileUtils.mkdir("MacOS")
        FileUtils.mkdir("Resources")
        FileUtils.mkdir(File.join("Resources", "English.lproj"))
        
        config_path = config.name + " ../Resources"
        config_name = config.name
        config_id   = config.id
        config_icon = "#{config.name}.icns"
        
        info_plist_path = File.join(Bowline.app_path, "osx", "Info.plist.erb")
        info_plist = ERB.new(File.read(info_plist_path)).result(binding)
        File.open("Info.plist", "w+") {|f| f.write info_plist }
      end
    end
    
    task :linux => :environment do
      # Build debian package
      raise "Unimplemented"
    end
    
    task :win32 => :environment do
      # Use Inno Setup
      raise "Unimplemented"
    end
  end
end
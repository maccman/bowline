require 'fileutils'
require 'erb'
require 'rbconfig'

namespace :app do  
  namespace :build do
    task :osx => :environment do
      if RUBY_VERSION == "1.9.1"
        ruby_lib_dir = Config::CONFIG["rubylibdir"]
      else
        ruby_lib_dir = "/usr/local/lib/ruby/1.9.1"
        unless File.directory?(ruby_lib_dir)
          raise "Can't find Ruby 1.9.1 libs"
        end
      end
      # Copy executable into MacOS
      # Copy app into Resources
      # Copy bowline to vendor/bowline (if doesn't exist)
      # Permissions?
      # Create a DMG of the app
      config = Bowline.configuration
      assets_path = File.join(Bowline.assets_path, "osx")
      build_path  = File.join(APP_ROOT, "build")
      app_path    = File.join(build_path, "#{config.name}.app")
      FileUtils.rm_rf(app_path)
      contents_path = File.join(app_path, "Contents")
      FileUtils.mkdir_p(contents_path)
      FileUtils.cd(contents_path) do        
        config_name = config.name
        config_id   = config.id
        config_icon = "#{config.name}.icns"
        
        info_plist_path = File.join(assets_path, "Info.plist.erb")
        info_plist = ERB.new(File.read(info_plist_path)).result(binding)
        File.open("Info.plist", "w+") {|f| f.write info_plist }
        
        FileUtils.mkdir("Resources")
        FileUtils.cd("Resources") do
          FileUtils.mkdir("English.lproj")
          
          # Make icon
          makeicns     = File.join(assets_path, "makeicns")
          config.icon ||= File.join(assets_path, "bowline.png")
          makeicns_in  = File.join(APP_ROOT, config.icon)
          makeicns_out = File.expand_path(File.join("English.lproj", config_icon))
          `#{makeicns} -in #{makeicns_in} -out #{makeicns_out}`
        
          # Copy App
          dirs = Dir[File.join(APP_ROOT, '**')]
          dirs.delete(build_path)
          dirs.delete(File.join(APP_ROOT, 'log'))
          dirs.delete(File.join(APP_ROOT, 'tmp'))
          dirs.delete(File.join(APP_ROOT, 'db', 'migrate'))
          dirs.delete_if {|i| i =~ /\.svn|\.DS_Store/ }
          FileUtils.cp_r(dirs, '.')

          # Copy Bowline
          unless File.directory?(File.join("vendor", "bowline"))
            FileUtils.cp_r(
              File.dirname(Bowline.lib_path), 
              File.join("vendor", "bowline")
            )
          end
          
          # Copy RB libs
          ruby_dir = File.join("vendor", "ruby")
          FileUtils.mkdir_p(ruby_dir)
          FileUtils.cp_r(ruby_lib_dir, ruby_dir)
        end
        
        # Copy Binary
        FileUtils.mkdir("MacOS")
        FileUtils.cp(File.expand_path("~/bowline-desktop/bowline-desktop"), File.join("MacOS", config.name))
      end
      FileUtils.chmod_R(0755, app_path)
      FileUtils.chmod(0644, File.join(contents_path, "Info.plist"))
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
  
  desc "Build app"
  task :build do
    Rake::Task["app:build:#{Bowline::Platform.type}"].invoke
  end
end
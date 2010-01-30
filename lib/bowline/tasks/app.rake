require 'fileutils'
require 'erb'
require 'rbconfig'

namespace :app do  
  namespace :build do
    namespace :osx do
      desc "Copy WebKit into app's Frameworks"
      task :webkit_framework => :environment do
        config = Bowline.configuration
        build_path  = Bowline::Library.local_build_path
        app_path    = File.join(build_path, "#{config.name}.app")
        contents_path = File.join(app_path, "Contents")
        
        webkit_path = ENV["WEBKIT_PATH"] || "/Applications/WebKit.app/Contents/Frameworks/10.5"
        unless File.directory?(webkit_path)
          raise "Install the WebKit nightly: http://nightly.webkit.org/"
        end
        frameworks = ["WebKit", "JavaScriptGlue", "WebCore", "JavaScriptCore"]
        
        FileUtils.cd(contents_path) do
          FileUtils.mkdir("Frameworks")
          
          frameworks.each {|name|
            name = "#{name}.framework"
            FileUtils.cp_r(
              File.join(webkit_path, name), 
              "Frameworks"
            )
          }
        
          `install_name_tool -change \
           /Volumes/Data/WebKit/52531/10.5/WebKit.framework/Versions/A/WebKit \
           @executable_path/../Frameworks/WebKit.framework/Versions/A/WebKit \
           MacOS/#{config.name}`
           
          `install_name_tool -change \
           /Volumes/Data/WebKit/52531/10.5/WebCore.framework/Versions/A/WebCore \
           @executable_path/../Frameworks/WebCore.framework/Versions/A/WebCore \
           MacOS/#{config.name}`
         end
      end
    end
    
    task :osx => :environment do
      unless Bowline::Library.ready?
        Rake::Task["libs:setup"].invoke
      end
      
      config = Bowline.configuration
      assets_path = File.join(Bowline.assets_path, "osx")
      build_path  = Bowline::Library.local_build_path
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
          makeicns = File.join(assets_path, "makeicns")
          if config.icon
            makeicns_in = File.expand_path(config.icon, APP_ROOT)
          else
            makeicns_in = File.join(assets_path, "bowline.png")
          end
          makeicns_out = File.expand_path(File.join("English.lproj", config_icon))
          puts "#{makeicns} -in #{makeicns_in} -out #{makeicns_out}"
          `#{makeicns} -in #{makeicns_in} -out #{makeicns_out}`
        
          # Copy App
          dirs = Dir[File.join(APP_ROOT, '**')]
          dirs.delete(build_path)
          dirs.delete(File.join(APP_ROOT, 'log'))
          dirs.delete(File.join(APP_ROOT, 'tmp'))
          dirs.delete(File.join(APP_ROOT, 'db', 'migrate'))
          dirs.delete_if {|i| i =~ /\.svn|\.DS_Store/ }
          FileUtils.cp_r(dirs, '.')
        end
        
        # Copy Bowline binary & libs
        FileUtils.mkdir("MacOS")
        FileUtils.cp(
          Bowline::Library.desktop_path, 
          File.join("MacOS", config.name)
        )
        FileUtils.cp_r(
          Bowline::Library.libs_path, 
          File.join("MacOS", "libs")
        )
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
    puts "Successfully built application: #{Bowline::Library.local_build_path}"
  end  
end
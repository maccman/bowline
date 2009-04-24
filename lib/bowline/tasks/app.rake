require 'fileutils'
namespace :app do
  desc "Bundles up app into executables"
  task :bundle => ["bundle:windows", "bundle:linux", "bundle:osx"]
  
  namespace :bundle do    
    task :windows => :environment do
    end
  
    task :linux => :environment do
    end
  
    task :osx => :environment do
      build_path    = File.join(APP_ROOT, 'build')
      titanium_path = ENV['TIPATH']
      raise 'You need to provide TIPATH' unless titanium_path
      titanium_path = File.expand_path(titanium_path)
    
      titanium_path = File.join(titanium_path, 'build', 'osx')
      build_path    = File.join(build_path, 'osx')
      FileUtils.rm_rf(build_path)
    
      build_path    = File.join(build_path, "#{APP_NAME}.app", 'Contents')
      FileUtils.mkdir_p(build_path)
    
      exec_path     = File.join(build_path, 'MacOS')
      FileUtils.mkdir_p(exec_path)
    
      FileUtils.cd(titanium_path) do
        FileUtils.cp_r('runtime/template/kboot', File.join(exec_path, APP_NAME))
        FileUtils.cp_r('runtime/installer',  build_path)
        FileUtils.cp_r('modules',    build_path)
        FileUtils.cp_r('runtime',    build_path)
        # FileUtils.cp_r('Frameworks', build_path) # todo
      end
      
      # Todo - put this in config?
      File.open(File.join(build_path, 'Info.plist'), 'w+') do |f|
        f.write <<-EOF
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        <plist version="1.0">
          <dict>
            <key>CFBundleDevelopmentRegion</key>
            <string>English</string>
            <key>CFBundleExecutable</key>
            <string>#{APP_NAME}</string>
            <key>CFBundleIconFile</key>
            <string>titanium.icns</string>
            <key>CFBundleIdentifier</key>
            <string>com.titaniumapp.testapp</string>
            <key>CFBundleInfoDictionaryVersion</key>
            <string>6.0</string>
            <key>CFBundleName</key>
            <string>#{APP_NAME}</string>
            <key>CFBundlePackageType</key>
            <string>APPL</string>
            <key>CFBundleSignature</key>
            <string>WRUN</string>
            <key>CFBundleVersion</key>
            <string>0.4</string>
            <key>NSMainNibFile</key>
            <string>MainMenu</string>
            <key>NSPrincipalClass</key>
            <string>NSApplication</string>
          </dict>
        </plist>
        EOF
      end
    
      resources_path = File.join(build_path, 'Resources')
      FileUtils.mkdir_p(resources_path)
    
      english_path = File.join(resources_path, 'English.lproj')
      FileUtils.mkdir_p(english_path)
      FileUtils.cd(build_path) do
        FileUtils.cp_r('runtime/template/MainMenu.nib',  english_path)
        FileUtils.cp_r('runtime/template/titanium.icns', english_path)
      end
    
      dirs = Dir[File.join(APP_ROOT, '*')] - [File.join(APP_ROOT, 'build')]
      FileUtils.cp_r(dirs, resources_path)
    
      FileUtils.cd(resources_path) do
        FileUtils.mv(File.join('config', 'manifest'),  build_path)
        FileUtils.mv(File.join('config', 'tiapp.xml'), build_path)
      end
    end
  end
end
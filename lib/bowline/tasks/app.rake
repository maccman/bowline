require 'fileutils'
namespace :app do
  desc "Bundles up app into executables"
  task :bundle do
    build_path    = File.join(APP_ROOT, 'build')
    titanium_path = ENV['TIPATH']
    raise 'You need to provide TIPATH' unless titanium_path
    titanium_path = File.expand_path(titanium_path)
    
    titanium_path = File.join(titanium_path, 'build', 'osx')
    build_path    = File.join(build_path, 'osx')
    FileUtils.rm_rf(build_path)
    
    build_path    = File.join(build_path, 'testapp.app', 'Contents')
    FileUtils.mkdir_p(build_path)
    
    FileUtils.cd(titanium_path) do
      # todo MacOS
      # FileUtils.cp_r('installer',  build_path)
      FileUtils.cp_r('modules',    build_path)
      FileUtils.cp_r('runtime',    build_path)
      # FileUtils.cp_r('Frameworks', build_path)
    end
    
    File.open(File.join(build_path, 'Info.plist'), 'w+') do |f|
      f.write <<-EOF
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
        <dict>
          <key>CFBundleDevelopmentRegion</key>
          <string>English</string>
          <key>CFBundleExecutable</key>
          <string>testapp</string>
          <key>CFBundleIconFile</key>
          <string>titanium.icns</string>
          <key>CFBundleIdentifier</key>
          <string>com.titaniumapp.testapp</string>
          <key>CFBundleInfoDictionaryVersion</key>
          <string>6.0</string>
          <key>CFBundleName</key>
          <string>Titanium Test App</string>
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
    
    dirs = Dir[File.join(APP_ROOT, '*')] - [File.join(APP_ROOT, 'build')]

    FileUtils.cp_r(dirs, resources_path)
    
    FileUtils.cd(resources_path) do
      FileUtils.mv(File.join('config', 'manifest'),  build_path)
      FileUtils.mv(File.join('config', 'tiapp.xml'), build_path)
    end
  end
end
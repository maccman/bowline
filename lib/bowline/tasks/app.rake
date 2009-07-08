require 'fileutils'
namespace :app do
  desc "Bundles up app into executables"  
  task :bundle => :environment do
    build_path    = File.join(APP_ROOT, 'build')
    titanium_path = ENV['TIPATH']
    
    conf = Bowline.configuration
    
    # ./tibuild.py -d . -s /Library/Application\ Support/Titanium/ -r -a /Library/Application\ Support/Titanium/sdk/osx/0.4.4 ~/Downloads/Test\ app/
    
    ti_dir = "/Library/Application\ Support/Titanium"
    ti_lib_dir = "/Library/Application\ Support/Titanium/sdk/osx/0.4.4"
    
    command = [File.join(ti_lib_dir, "tibuild.py")]
    command << "-d #{build_path}"
    command << "-s #{ti_dir}"
    command << "-r"
    command << "-a #{ti_lib_dir}"
    command << APP_ROOT
    exec(*command)
  end
end
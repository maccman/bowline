require 'fileutils'
namespace :app do
  task :default => [:bundle, :run]
  
  desc "Bundles up app into executables"  
  task :bundle => :environment do
    build_path    = File.join(APP_ROOT, 'build')
    app_path      = File.join(build_path, 'app')
    
    conf = Bowline.configuration
    
    manifest = %{
      #appname:#{conf.name}
      #appid:#{conf.id}
      #publisher:#{conf.publisher}
      #image:public/logo.png
      #url:#{conf.url}
      #guid:0e70684a-dd4b-4d97-9396-6bc01ba10a4e
      #desc:#{conf.description}
      #type:desktop
      runtime:0.4.4
      api:0.4.4
      tiapp:0.4.4
      tifilesystem:0.4.4
      tiplatform:0.4.4
      tiui:0.4.4
      javascript:0.4.4
      tianalytics:0.4.4
      ruby:0.4.4
      tidatabase:0.4.4
      tidesktop:0.4.4
      tigrowl:0.4.4
      timedia:0.4.4
      timonkey:0.4.4
      tinetwork:0.4.4
      tinotification:0.4.4
      tiprocess:0.4.4
    }
    
    tiapp = %{
      <?xml version='1.0' encoding='UTF-8'?>
      <ti:app xmlns:ti='http://ti.appcelerator.org'>
        <id>#{conf.id}</id>
        <name>#{conf.name}</name>
        <version>#{conf.version}</version>
        <publisher>#{conf.publisher}</publisher>
        <url>#{conf.url}</url>
        <icon>public/icon.png</icon>
        <copyright>#{conf.copyright}</copyright>
        <window>
          <id>initial</id>
          <title>#{conf.name}</title>
          <url>app://public/index.html</url>
          <width>700</width>
          <max-width>3000</max-width>
          <min-width>0</min-width>
          <height>800</height>
          <max-height>3000</max-height>
          <min-height>0</min-height>
          <fullscreen>false</fullscreen>
          <resizable>true</resizable>
          <chrome scrollbars="true">true</chrome>
          <maximizable>true</maximizable>
          <minimizable>true</minimizable>
          <closeable>true</closeable>
        </window>
      </ti:app>
    }
    
    dirs = Dir[File.join(APP_ROOT, '**')]
    dirs.delete(build_path)
    dirs.delete(File.join(APP_ROOT, 'log'))
    dirs.delete(File.join(APP_ROOT, 'tmp'))
    dirs.delete_if {|i| i =~ /\.svn|\.DS_Store/ }
    
    # Todo - check gem dependencies
    
    FileUtils.cd(app_path) {
      File.open('manifest', 'w+') {|f| f.write manifest }
      File.open('tiapp.xml', 'w+') {|f| f.write tiapp }
      FileUtils.cp_r(dirs, 'Resources')
      FileUtils.rm_f(File.join('Resources', 'db', 'application.sqlite3'))
    }
  end
  
  desc "Use the Titanium SDK to build the app"
  task :build do
    build_path    = File.join(APP_ROOT, 'build')
    app_path      = File.join(build_path, 'app')

    # Todo - cross OS
    ti_path = ENV['TIPATH'] || "/Library/Application Support/Titanium"
    ti_lib_path = Dir[File.join(ti_path, "sdk", "*", "*")][0]
    
    command = []
    command << File.join(ti_lib_path, "tibuild.py")
    command << "-d #{build_path}"
    command << "-s #{ti_path}"
    # command << "-r"
    command << "-a #{ti_lib_path}"
    command << app_path
    exec(*command)
  end
end
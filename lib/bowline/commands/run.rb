exec_path = File.join(APP_ROOT, 'build', 'osx', "#{APP_NAME}.app")

unless File.exist?(exec_path)
  require 'rake'
  require 'bowline/tasks/bowline'
  Rake::Task['app:bundle'].invoke
end

if ENV['debug']
  `open #{File.join(exec_path, 'Contents', 'MacOS', APP_NAME)}`
else
  `open #{exec_path}`
end
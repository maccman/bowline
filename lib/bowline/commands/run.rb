exec_path = File.join(APP_ROOT, 'build', 'osx', 'testapp.app')

unless File.exist?(exec_path)
  require 'rake'
  require 'bowline/tasks/bowline'
  Rake::Task['app:bundle'].invoke
end

if ENV['debug']
  `open #{File.join(exec_path, 'Contents', 'MacOS', 'testapp')}`
else
  `open #{exec_path}`
end
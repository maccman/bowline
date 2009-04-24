require "config/environment"
exec_path = File.join(APP_ROOT, 'build', 'osx', "#{APP_NAME}.app")

unless File.exist?(exec_path)
  require 'rake'
  require 'bowline/tasks/bowline'
  Rake::Task['app:bundle'].invoke
end

# Debug view
`open #{File.join(exec_path, 'Contents', 'MacOS', APP_NAME)}`
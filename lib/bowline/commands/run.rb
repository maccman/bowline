unless Bowline::Library.downloaded?
  require 'rake'
  require 'bowline/tasks/bowline'
  Rake::Task['libs:download'].invoke
end

exec("#{Bowline::Library.desktop_path} #{APP_ROOT}")
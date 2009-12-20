unless Bowline::Library.ready?
  require 'bowline/tasks/bowline'
  Rake::Task['libs:setup'].invoke
end

exec("#{Bowline::Library.desktop_path} #{APP_ROOT}")
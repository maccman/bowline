unless Bowline::Library.ready?
  puts "Setting up Bowline. This could take a while..."
  require 'bowline/tasks/bowline'
  Rake::Task['libs:setup'].invoke
end

ENV["APP_ENV"] = "development"

exec("#{Bowline::Library.desktop_path} #{APP_ROOT}")
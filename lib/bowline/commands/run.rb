unless Bowline::Library.ready?
  puts "Setting up Bowline. This could take a while..."
  require 'bowline/tasks/bowline'
  Rake::Task['libs:setup'].invoke
end

exec("#{Bowline::Library.desktop_path} #{Bowline.root}")
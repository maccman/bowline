require 'rake'
require 'bowline/tasks/bowline'
ENV['TIRUN'] = 'true'
Rake::Task['app'].invoke
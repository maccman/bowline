module Dependencies; end

Dir[File.join(File.dirname(__FILE__), 'dependencies', '*.rb')].each do |file|
  require file
end
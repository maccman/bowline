$VERBOSE = nil

# Load Rails rakefile extensions
Dir["#{File.dirname(__FILE__)}/*.rake"].each { |ext| load ext }

# Load any custom rakefile extensions
Dir["#{APP_ROOT}/vendor/plugins/*/**/tasks/**/*.rake"].sort.each { |ext| load ext }
Dir["#{APP_ROOT}/lib/tasks/**/*.rake"].sort.each { |ext| load ext }
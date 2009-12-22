module Bowline
  # Provides paths to Bowline's required libraries.
  module Library
    RUBY_LIB_VERSION      = "1.9.1"
    RUBY_ARCHLIB_PLATFORM = "i386-darwin9.8.0"
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop"
    RUBYLIB_URL  = "#{PROJECT_URL}/rubylib.zip"
    
    # Path to a folder stored under the users
    # home directory containing the downloaded libraries.
    def path
      File.expand_path(
        File.join(home_path, ".bowline")
      )
    end
    module_function :path
    
    # Path to the bowline-desktop binary
    def desktop_path
      File.join(path, "bowline-desktop")
    end
    module_function :desktop_path
    
    # Path to Ruby's stdlib
    def rubylib_path
      File.join(path, "rubylib")
    end
    module_function :rubylib_path
    
    def local_bowline_path
      File.join(APP_ROOT, "vendor", "bowline")
    end
    module_function :local_bowline_path
    
    def local_rubylib_path
      File.join(APP_ROOT, "vendor", "rubylib")
    end
    module_function :local_rubylib_path
    
    # Returns true if all required libraries exist.
    def ready?
      File.exist?(desktop_path) && 
        File.directory?(rubylib_path) && 
          File.directory?(local_bowline_path)
    end
    module_function :ready?
    
    private
      # Borrowed from Rubygems
      def home_path
        ['HOME', 'USERPROFILE'].each do |homekey|
          return ENV[homekey] if ENV[homekey]
        end
        if ENV['HOMEDRIVE'] && ENV['HOMEPATH'] then
          return "#{ENV['HOMEDRIVE']}#{ENV['HOMEPATH']}"
        end
        begin
          File.expand_path("~")
        rescue
          File::ALT_SEPARATOR ? "C:/" : "/"
        end
      end
      module_function :home_path
  end
end
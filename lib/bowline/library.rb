module Bowline
  module Library
    RUBY_LIB_VERSION      = "1.9.1"
    RUBY_ARCHLIB_PLATFORM = "i386-darwin9.8.0"
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop"
    RUBYLIB_URL  = "#{PROJECT_URL}/rubylib.zip"
    
    def path
      File.expand_path(
        File.join(home_path, ".bowline")
      )
    end
    module_function :path
    
    def desktop_path
      File.join(path, "bowline-desktop")
    end
    module_function :desktop_path
    
    def rubylib_path
      File.join(path, "rubylib")
    end
    module_function :rubylib_path
    
    def bowline_path
      File.join(APP_ROOT, "vendor", "bowline")
    end
    module_function :bowline_path
    
    def ready?
      File.exist?(desktop_path) && 
        File.directory?(rubylib_path) && 
          File.directory?(bowline_path)
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
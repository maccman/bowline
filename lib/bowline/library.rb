module Bowline
  # Provides paths to Bowline's required libraries.
  module Library
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop.zip"
    LIBS_URL     = "#{PROJECT_URL}/libs.zip"
    
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
    
    def libs_path
      File.join(path, "libs")
    end
    module_function :libs_path
    
    def local_build_path
      File.join(APP_ROOT, "build")
    end
    module_function :local_build_path
    
    # Returns true if all required libraries exist.
    def ready?
      File.exist?(desktop_path) && 
        File.directory?(libs_path)
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
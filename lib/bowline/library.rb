require "pathname"

module Bowline
  # Provides paths to Bowline's required libraries.
  module Library
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop.zip"
    LIBS_URL     = "#{PROJECT_URL}/libs.zip"
    
    # Path to a folder stored under the users
    # home directory containing the downloaded libraries.
    def path
      Pathname.new(
        File.expand_path(
          File.join(Gem.user_home, ".bowline")
        )
      )
    end
    
    # Path to the bowline-desktop binary
    def desktop_path
      path.join("bowline-desktop")
    end
    
    def libs_path
      path.join("libs")
    end
    
    def local_build_path
      Bowline.root.join("build")
    end
    
    # Returns true if all required libraries exist.
    def ready?
      File.exist?(desktop_path) && 
        File.directory?(libs_path)
    end

    extend self
  end
end
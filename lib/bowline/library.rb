module Bowline
  module Library
    RUBY_LIB_VERSION      = "1.9.1"
    RUBY_ARCHLIB_PLATFORM = "i386-darwin9.8.0"
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop"
    RUBYLIB_URL  = "#{PROJECT_URL}/rubylib.zip"
    
    def path
      File.expand_path(
        File.join(Gem.user_home, ".bowline")
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
    
    def downloaded?
      File.exist?(desktop_path) && File.directory?(rubylib_path)
    end
    module_function :downloaded?
  end
end
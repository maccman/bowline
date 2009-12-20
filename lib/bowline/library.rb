module Bowline
  module Library
    PROJECT_URL  = "http://bowline.s3.amazonaws.com/#{Platform.type}"
    DESKTOP_URL  = "#{PROJECT_URL}/bowline-desktop"
    RUBYLIB_URL  = "#{PROJECT_URL}/rubylib.zip"
    
    def path
      # TODO - tilda won't work on win32
      File.expand_path(
        File.join(*%w{~ .bowline})
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
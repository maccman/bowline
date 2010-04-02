module Bowline
  module Desktop
    module Path
      ##
      # :singleton-method: documents
      # Get the users documents dir.
      # * Unix: ~ (the home directory)
      # * Windows: "C:\Documents and Settings\username\My Documents"
      # * Mac: ~/Documents
      
      # Get the users home dir
      def home
        Gem.user_home
      end
      module_function :home
      
      ##
      # :singleton-method: data
      # Get the app's data dir.
      # * Unix: prefix/share/appinfo
      # * Windows: the directory where the executable file is located
      # * Mac: appinfo.app/Contents/SharedSupport bundle subdirectory
      
      ##
      # Get the app's user data dir.
      # * Unix: ~/.appinfo
      # * Windows: "C:\Documents and Settings\username\Application Data\appinfo"
      # * Mac: "~/Library/Application Support/appinfo".
      def user_data
        conf = Bowline.configuration
        case Bowline::Platform.type
        when :linux
          File.join(home, "." + conf.name)
        when :win32
          File.join(home, "Application Data", conf.name)
        when :osx
          File.join(home, "Library", "Application Support", conf.name)
        end
      end
      module_function :user_data
      
      ##
      # :singleton-method: temp
      # Get the tempory directory
    end
  end
end
module Bowline
  module Desktop
    module Path
      ##
      # :singleton-method: documents
      # Get the users documents dir.
      # * Unix: ~ (the home directory)
      # * Windows: "C:\Documents and Settings\username\My Documents"
      # * Mac: ~/Documents
      
      ##
      # :singleton-method: data
      # Get the app's data dir.
      # * Unix: prefix/share/appinfo
      # * Windows: the directory where the executable file is located
      # * Mac: appinfo.app/Contents/SharedSupport bundle subdirectory
      
      ##
      # :singleton-method: user_data
      # Get the app's user data dir.
      # * Unix: ~/.appinfo
      # * Windows: "C:\Documents and Settings\username\Application Data\appinfo"
      # * Mac: "~/Library/Application Support/appinfo".
      
      ##
      # :singleton-method: temp
      # Get the tempory directory
    end
  end
end
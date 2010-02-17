require "net/http"

module Bowline
  module Desktop
    module WindowMethods #:nodoc:
      def center(direction = nil)
        direction = 
        case direction
        when :both       then Window::BOTH
        when :horizontal then Window::HORIZONTAL
        when :vertical   then Window::VERTICAL
        when :center     then Window::CENTRE_ON_SCREEN
        else
          Window::BOTH
        end
        _center(direction)
      end
      
      def file=(path)
        if path.is_a?(Symbol)
          path = File.join(APP_ROOT, "public", path.to_s)
        end
        if File.extname(path).blank?
          path += ".html"
        end
        path = File.expand_path(path, APP_ROOT)
        self._file = path
      end
      alias :load_file :file=
      
      def url=(address)
        unless address.is_a?(URI)
          address = URI.parse(address)
        end
        self._url = address.to_s
      end
      
      def select_file(options = {})
        flags = 0
        flags |= Window::FD_OPEN if options[:open]
        flags |= Window::FD_SAVE if options[:save]
        flags |= Window::FD_OVERWRITE_PROMPT if options[:overwrite_prompt]
        flags |= Window::FD_FILE_MUST_EXIST  if options[:file_must_exist]
        _select_dir(
          options[:message],
          options[:default_path],
          options[:default_filename],
          options[:default_extension],
          options[:wildcard],
          flags
        )
      end
      
      def select_dir(options = {})
        _select_dir(options[:message], options[:default_path])
      end
      
      def width=(w)
        set_size(w, -1)
      end
      
      def height=(h)
        set_size(-1, h)
      end
      
      # Window was shut; setup!
      # needs to be called again
      def dealocated?
        id == -1
      end
      
      # The methods won't exist on window
      # if Bowline::Desktop isn't enabled
      def method_missing(sym, *args)
        Bowline::Desktop.enabled? ? super : nil
      end
    end
  end
end
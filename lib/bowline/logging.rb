module Bowline
  # To be included in classes to allow some basic logging.
  module Logging
    def trace(msg=nil)
      Bowline.logger.info(msg)
    end
    module_function :trace
    public :trace
    
    def debug(msg=nil)
      Bowline.logger.debug(msg)
    end
    module_function :debug
    public :debug
    
    # Log an error backtrace if debugging is activated
    def log_error(e=$!)
      Bowline.logger.error "#{e}\n\t" + e.backtrace.join("\n\t")
    end
    module_function :log_error
    public :log_error
  end
end

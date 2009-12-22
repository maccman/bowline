module Bowline
  module Desktop
    module Dialog
      # Display a dialog box from the main window.
      # You can ask for a confirmation, or just display some information.
      # 
      # Supported options are:
      #   :yes_no           - Puts Yes and No buttons on the message box *
      #   :ok               - Puts an Ok button on the message box *
      #   :cancel           - Puts a Cancel button on the message box
      #   :icon_exclamation - Displays an exclamation mark symbol
      #   :icon_error       - Displays an error symbol
      #   :question         - Displays a question mark symbol
      #   :information      - Displays an information symbol
      #   :caption          - Title for the message box
      #                       * may be combined with :cancel
      # 
      # Return values are:
      #   :yes    - User clicked yes
      #   :no     - User clicked no
      #   :ok     - User clicked ok
      #   :cancel - User clicked cancel, or closed the box
      def message(msg, options = {})
        style = 0
        style |= YES_NO if options[:yes_no]
        style |= OK     if options[:ok]
        style |= CANCEL if options[:cancel]
        style |= ICON_EXCLAMATION if options[:icon_exclamation]
        style |= ICON_HAND   if options[:icon_hand]
        style |= ICON_ERROR  if options[:icon_error]
        style |= QUESTION    if options[:question]
        style |= INFORMATION if options[:information]
        caption = options[:caption] || "Message"
        
        result = _message(msg, caption, style)
        
        case result
        when YES then :yes
        when NO  then :no
        when OK  then :ok
        when CANCEL then :cancel
        end
      end
      module_function :message
    end
  end
end
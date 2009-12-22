module Binders
  class Users < Bowline::Binders::Base
    bind User    
    class << self 
      def admins
        self.items = User.admins.all
      end
    end
  
    def update(attrs)
      if @item.update_attributes(attrs)
        page.flash("Successfully updated").call
      else
        page.flash_error("Errors updating users").call
      end
    end
 
    def highlight
      # Calls $('user_1').highlight()
      self.element.highlight.call
    end
  
    def charge!
      # calls charge! on model (i.e. do SQL commit )
      self.item.charge!
      # Now gui stuff
      page.flash("Charged!")
      highlight
    end
  end
end
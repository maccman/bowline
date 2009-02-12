class UsersBinder < Bowline::Collection    
  class << self
    # self.items is a special method
    # Basically it'll update users on the client side
    def index
      self.items = User.all
    end
    
    # def index(offset)
    #   self.items = User.all(:conditions => ['id > ?', offset])
    # end
 
    def admins
      self.items = User.admins.all
    end
  end
  
  def update(attrs)
    if @item.update_attributes(attrs)
      flash[:notice] = "Successfully updated"
    else
      flash[:notice] = "Errors updating users"
    end
  end
 
  def highlight
    # Calls $('user_1').highlight()
    self.element.highlight
  end
  
  # Overrides charge on user
  def charge!
    # calls charge! on model (i.e. do sql commit )
    self.item.charge!
    # Now gui stuff
    flash[:notice] = "Successfully charged"
    highlight
  end
end
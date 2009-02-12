class AccountBinder < Bowline::Singleton  
  class << self
    # self.collection is a special method
    # Basically it'll update users on the client side
    def index
      self.item = current_account
    end
 
    def destroy
      current_account.destroy
      self.item = nil
    end
  end
  
  # Everything has a js_id which is basically the lowercase classname + _ + self.id
  def highlight
    # Calls $(element).highlight()
    self.element.highlight
  end
  
  # Overrides charge on user
  def charge!
    # calls charge on model (i.e. do sql commit )
    self.item.charge!
    # Now gui stuff
    flash[:notice] = "Successfully charged"
    highlight
  end
end
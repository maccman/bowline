module Bowline
  module Desktop
    class Window
      include WindowMethods
      # Methods:
      #  new()
      #  center(direction = :both)
      #  close
      #  chrome=
      #  disable
      #  enable
      #  file=      
      #  id 
      #  modal(flag = true)
      #  name=
      #  run_script(str) #=> str
      #  raise
      #  show
      #  hide
      #  set_size(width, height)
      #  set_position(x, y)
      #  select_dir(
      #  )
    end
    
    class MainWindow
      include WindowMethods
    end
  end
end
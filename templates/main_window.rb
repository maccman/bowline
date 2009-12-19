class MainWindow < Bowline::Desktop::WindowManager
  setup
  self.width  = 300
  self.height = 400
  center
  on_load { show }
end
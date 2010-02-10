class MainWindow < Bowline::Desktop::WindowManager
  setup
  self.file   = :index
  self.width  = 300
  self.height = 400
  center
  enable_developer
  on_load { show }
end
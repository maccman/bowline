module Bowline::Generators
  class ApplicationGenerator < Generator
    def app_id
      ['bowline', name].join('.')
    end
    
    first_argument :name, :required => true, :desc => "application name"

    empty_directory :tmp,     "tmp"    
    empty_directory :vendor,  "vendor"
    empty_directory :lib,     "lib"
    empty_directory :db,      "db"
    empty_directory :build,   "build"
    empty_directory :log,     "log"
    
    template :rakefile, "Rakefile"
    
    file :gitignore do |file|
      file.source      = "gitignore"
      file.destination = ".gitignore"
    end
    
    glob! "script"
    glob! "app"
    glob! "config"
    glob! "public"
  end
  
  add :app, ApplicationGenerator
end
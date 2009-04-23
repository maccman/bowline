module Bowline::Generators
  class ApplicationGenerator < NamedGenerator
    desc <<-DESC
      Generates a new application.
    DESC
    
    def app_id
      ['bowline', name].join('.')
    end
    
    def destination_root
      File.join(@destination_root, base_name)
    end
    
    first_argument :name, :required => true, :desc => "application name"

    empty_directory :tmp,     "tmp"    
    empty_directory :vendor,  "vendor"
    empty_directory :lib,     "lib"
    empty_directory :db,      "db"
    empty_directory :build,   "build"
    empty_directory :log,     "log"
    
    template :rakefile, "Rakefile", "Rakefile"
    
    file :gitignore do |file|
      file.source      = "gitignore"
      file.destination = ".gitignore"
    end
    
    glob! "script"
    glob! "app"
    glob! "config"
    glob! "public"
    
    empty_directory :models, "app/models"
    template :tiapp, "tiapp.xml", "config/tiapp.xml"
  end
  
  add :app, ApplicationGenerator
end
module Bowline::Generators
  class ApplicationGenerator < NamedGenerator
    desc <<-DESC
      Generates a new application.
    DESC
    
    def app_id
      ['bowline', name].join('.')
    end
    
    def destination_root
      # Todo - only works relative
      File.join(@destination_root, base_name)
    end
    
    def full_name
      File.basename(name).camel_case
    end
    
    first_argument :name, :required => true, :desc => "application name"

    empty_directory :tmp,     "tmp"    
    empty_directory :vendor,  "vendor"
    empty_directory :lib,     "lib"
    empty_directory :db,      "db"
    empty_directory :build,   "build"
    empty_directory :log,     "log"
    
    template :rakefile, "Rakefile", "Rakefile"
    
    file :gitignore, "gitignore", ".gitignore"
    
    empty_directory :public, "public"
    
    template :index, "public/index.html", "public/index.html"
    file :logo, "public/icon.png", "public/icon.png"
    
    glob! "public/javascripts"
    glob! "public/stylesheets"
    
    glob! "script"
    
    file :jquery,    "../assets/jquery.js",         "public/javascripts/jquery.js"
    file :chainjs,   "../assets/jquery.chain.js",   "public/javascripts/jquery.chain.js"
    file :bowlinejs, "../assets/jquery.bowline.js", "public/javascripts/jquery.bowline.js"
    
    empty_directory :app, "app"
    empty_directory :models, "app/models"
    empty_directory :binders, "app/binders"
    empty_directory :binders, "app/helpers"
    empty_directory :config, "config"
    
    template :environment, "config/environment.rb", "config/environment.rb"
    ["application.yml", "database.yml", "boot.rb"].each {|action|
      action = File.join('config', action)
      file(action.downcase.gsub(/[^a-z0-9]+/, '_').to_sym, action, action)
    }
    
    empty_directory :initializers, "config/initializers"
  end
  
  add :app, ApplicationGenerator
end
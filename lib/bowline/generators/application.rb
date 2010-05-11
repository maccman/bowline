module Bowline::Generators
  class ApplicationGenerator < NamedGenerator
    desc <<-DESC
      Generates a new application.
    DESC
    
    def app_id
      ["bowline", name].join(".")
    end
    
    def destination_root
      # TODO - only works relative
      File.join(@destination_root, base_name)
    end
    
    def full_name
      File.basename(name).camel_case
    end
    
    first_argument :name, :required => true, :desc => "application name"

    empty_directory :vendor,  "vendor"
    empty_directory :lib,     "lib"
    empty_directory :db,      "db"
    empty_directory :build,   "build"
    empty_directory :log,     "log"
    
    template :rakefile, "Rakefile", "Rakefile"
    template :gemfile, "Gemfile", "Gemfile"
    
    file :gitignore, "gitignore", ".gitignore"
    
    empty_directory :public, "public"
    
    template :index, "public/index.html", "public/index.html"
    file :logo, "public/icon.png", "public/icon.png"
    
    glob! "public/javascripts"
    glob! "public/stylesheets"
    
    glob! "script", [nil]
    chmod "script", :mode => 0755
    
    file :jquery,         "../assets/jquery.js",        "public/javascripts/jquery.js"
    file :chainjs,        "../assets/jquery.chain.js",  "public/javascripts/jquery.chain.js"
    file :superclassjs,   "../assets/superclass.js",    "public/javascripts/superclass.js"
    file :bowlinejs,      "../assets/bowline.js",       "public/javascripts/bowline.js"
    file :bowlinechainjs, "../assets/bowline.chain.js", "public/javascripts/bowline.chain.js"
    
    empty_directory :app, "app"
    empty_directory :models, "app/models"
    empty_directory :binders, "app/binders"
    empty_directory :helpers, "app/helpers"
    empty_directory :windows, "app/windows"
    file :mainwindow, "main_window.rb", "app/windows/main_window.rb"
    
    empty_directory :config, "config"
    template :environment, "config/environment.rb", "config/environment.rb"
    ["application.yml", "database.yml", "boot.rb"].each {|action|
      action = File.join('config', action)
      file(action.downcase.gsub(/[^a-z0-9]+/, '_').to_sym, action, action)
    }
    
    glob! "config/environments"
    
    empty_directory :initializers, "config/initializers"
    empty_directory :first_run,    "config/first_run"
    
    touch "app_first_run"
    
    file :readme, "../README.txt", "README"
  end
  
  add :app, ApplicationGenerator
end
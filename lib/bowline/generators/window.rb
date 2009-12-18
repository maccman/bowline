module Bowline::Generators
  class WindowGenerator < NamedGenerator
    desc <<-DESC
      Generates a new window.
    DESC
    
    def modules
      []
    end
    
    def class_name
      "#{self.name.camel_case}Window"
    end
    
    def file_name
      "#{name}_window"
    end
    
    first_argument :name, :required => true, :desc => "window name"
    
    template :helper do |template|
      template.source       = "window.rb"
      template.destination  = "app/windows/#{file_name}.rb"
    end
  end
  
  add :window, WindowGenerator
end
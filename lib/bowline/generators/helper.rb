module Bowline::Generators
  class HelperGenerator < NamedGenerator
    desc <<-DESC
      Generates a new helper.
    DESC
    
    def modules
      []
    end
    
    def module_name
      "#{self.name.camel_case}Helper"
    end
    
    def file_name
      "#{name}_helper"
    end
    
    first_argument :name, :required => true, :desc => "helper name"
    
    template :helper do |template|
      template.source       = "helper.rb"
      template.destination  = "app/helpers/#{file_name}.rb"
    end
  end
  
  add :helper, HelperGenerator
end
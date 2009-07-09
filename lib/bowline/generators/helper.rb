module Bowline::Generators
  class HelperGenerator < NamedGenerator
    desc <<-DESC
      Generates a new helper.
    DESC
    
    def modules
      []
    end
    
    first_argument :name, :required => true, :desc => "helper name"
    
    
    template :model do |template|
      template.source       = "model.rb"
      template.destination  = "app/models/#{file_name}.rb"
    end
  end
  
  add :helper, HelperGenerator
end
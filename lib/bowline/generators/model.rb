module Bowline::Generators
  class ModelGenerator < NamedGenerator
    desc <<-DESC
      Generates a new model.
    DESC
    
    def class_name
      super + " < SuperModel::Base"
    end
    
    def modules
      []
    end
    
    first_argument :name, :required => true, :desc => "model name"
    
    template :model do |template|
      template.source       = "model.rb"
      template.destination  = "app/models/#{file_name}.rb"
    end
  end
  
  add :model, ModelGenerator
end

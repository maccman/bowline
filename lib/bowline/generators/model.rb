module Bowline::Generators
  class ModelGenerator < NamedGenerator
    desc <<-DESC
      Generates a new model.
    DESC
    
    def class_name
      if local
        super + " < SuperModel::Base"
      else
        super + " < ActiveRecord::Base"
      end
    end
    
    def modules
      []
    end
    
    first_argument :name, :required => true, :desc => "model name"
    second_argument :local, :required => false
    
    template :model do |template|
      template.source       = "model.rb"
      template.destination  = "app/models/#{file_name}.rb"
    end
  end
  
  add :model, ModelGenerator
end

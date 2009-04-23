module Bowline::Generators
  class ModelGenerator < NamedGenerator
    def self.source_root
      File.join(super, 'app', 'models')
    end
    
    first_argument :name, :required => true, :desc => "model name"
    
    template :model do |template|
      template.source       = "model.rb"
      template.destination  = "app/models/#{file_name}.rb"
    end
  end
  
  add :model, ModelGenerator
end

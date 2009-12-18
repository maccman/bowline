module Bowline::Generators
  class BinderGenerator < NamedGenerator
    desc <<-DESC
      Generates a new binder.
    DESC
    
    alias :plain_class_name :class_name
    def class_name
      super + "Binder < Bowline::Binders::Base"
    end
    
    def expose_name
      plain_class_name.singularize
    end
    
    def file_name
      super + "_binder"
    end
    
    first_argument :name, :required => true, :desc => "binder name"
        
    template :binder do |template|
      template.source       = "binder.rb"
      template.destination  = "app/binders/#{file_name}.rb"
    end
  end
  
  add :binder, BinderGenerator
end
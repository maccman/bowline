module Bowline::Generators
  class BinderGenerator < NamedGenerator
    desc <<-DESC
      Generates a new binder.
    DESC
    
    alias :plain_class_name :class_name
    def class_name
      super + "Binder < Bowline::Binders::#{bind_type.capitalize}"
    end
    
    def bind_name
      plain_class_name.singularize
    end
    
    def bind_type
      "Collection"
    end
    
    def file_name
      super + "_binder"
    end
    
    first_argument :name, :required => true, :desc => "binder name"
    second_argument :bind_type, :default => "collection", :desc => "binder type (singleton/collection)"
    
    template :binder do |template|
      template.source       = "binder.rb"
      template.destination  = "app/binders/#{file_name}.rb"
    end
  end
  
  add :binder, BinderGenerator
end
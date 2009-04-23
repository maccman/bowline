module Bowline::Generators
  class BinderGenerator < NamedGenerator
    desc <<-DESC
      Generates a new binder, either a collection one, or a singleton one.
    DESC
    
    def class_name
      super + " < Bowline::#{type.to_s.camel_case}"
    end
    
    def modules
      ['Binders']
    end
    
    first_argument :name, :required => true, :desc => "binder name"
    option :type, :desc => "Binder type (collection/singleton)", :default => "collection"
    
    template :binder do |template|
      template.source       = "binder.rb"
      template.destination  = "app/binders/#{file_name}.rb"
    end
  end
  
  add :binder, BinderGenerator
end
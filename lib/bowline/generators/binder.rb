module Bowline::Generators
  class BinderGenerator < NamedGenerator
    def self.source_root
      File.join(super, 'app', 'binders')
    end
    
    def modules
      ['Binders']
    end
    
    first_argument :name, :required => true, :desc => "binder name"
    
    template :binder do |template|
      template.source       = "binder.rb"
      template.destination  = "app/binders/#{file_name}.rb"
    end
  end
  
  add :binder, BinderGenerator
end
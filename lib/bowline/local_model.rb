module Bowline
  class LocalModel
    include ActiveSupport::Callbacks
    define_callbacks :before_save,    :after_save,
                     :before_create,  :after_create,
                     :before_update,  :after_update,
                     :before_destroy, :after_destroy
  
    @@records = []
  
    class << self
      def populate(array)
        array.each {|r| create(r) }
      end
    
      def find(id)
        @@records.find {|r| r.id == id } || raise('Unknown Record')
      end
      alias :[] :find
    
      def first
        @@records[0]
      end
      
      def last
        @@records[-1]
      end
      
      def count
        @@records.length
      end
    
      def all
        @@records
      end
    
      def destroy(id)
        find(id).destroy
      end
      
      def destroy_all
        @@records.each {|r| r.destroy }
      end
      
      def delete_all
        @@records.clear
      end
    
      def create(atts = {})
        self.new(atts).save
      end
    end
  
    attr_reader :attributes
  
    def initialize(atts = {})
      @attributes = {}.with_indifferent_access
      @attributes.replace(atts)
      @attributes[:id] ||= __id__
      @new_record = true
    end
  
    # Override __id__
    def id
      @attributes[:id]
    end
  
    def update(atts)
      run_callbacks(:before_save)
      run_callbacks(:before_update)
      attributes.merge!(atts)
      run_callbacks(:after_save)
      run_callbacks(:after_update)
      true
    end
  
    def save
      run_callbacks(:before_save)
      if @new_record
        run_callbacks(:before_create)
        @@records << self
        run_callbacks(:after_create)
        @new_record = false
      end
      run_callbacks(:after_save)
      true
    end
  
    def destroy
      run_callbacks(:before_destroy)
      @@records.delete(self)
      run_callbacks(:after_destroy)
      true
    end
  
    def method_missing(method_symbol, *arguments) #:nodoc:
      method_name = method_symbol.to_s

      case method_name.last
        when "="
          attributes[method_name.first(-1)] = arguments.first
        when "?"
          attributes[method_name.first(-1)]
        else
          attributes.has_key?(method_name) ? attributes[method_name] : super
      end
    end
  end
end
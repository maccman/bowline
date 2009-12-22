module Bowline
  # The LocalModel class mirrors ActiveRecord's api, and is used for 
  # models you want to hold in memory. 
  # 
  # You can also use this class in conjunction with Bowline's binders.
  # 
  # All normal ActiveRecord callbacks are supported, such as before_save and after_save.
  # 
  # Associations are not currently supported.
  class LocalModel
    extend Watcher::Base
    
    watch :before_save,    :after_save,
          :before_create,  :after_create,
          :before_update,  :after_update,
          :before_destroy, :after_destroy
    
    @@records = []
  
    class << self
      # Populate the model with the array argument.
      # This doesn't replace the model's existing records.
      # Create callbacks are still executed.
      def populate(array)
        array.each {|r| create(r) }
      end
      
      # Find record by ID, or raise.
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
      
      # Removes all records and executes 
      # destory callbacks.
      def destroy_all
        @@records.dup.each {|r| r.destroy }
      end
      
      # Removes all records without executing
      # destroy callbacks.
      def delete_all
        @@records.clear
      end
      
      # Create a new record.
      # Example:
      #   create(:name => "foo", :id => 1)
      def create(atts = {})
        rec = self.new(atts)
        rec.save && rec
      end
    end
  
    attr_reader :attributes
    
    # Initialize the record with an optional
    # hash of attributes. If a :id attribute
    # isn't passed, the instance's object id 
    # is used instead.
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
    
    # Update record with a hash of new attributes.
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
    
    private
      def run_callbacks(callback)
        self.class.watcher.call(callback)
      end
  end
end
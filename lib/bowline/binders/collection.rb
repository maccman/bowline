module Bowline
  module Binders
    class Collection < Base
      class << self
        # Associate the binder with a model to setup callbacks so 
        # changes to the model are automatically reflected in the view.
        # Example:
        #   bind Post
        #
        # When the bound class is created/updated/deleted
        # the binder's callbacks are executed and the view
        # updated accordingly.
        # 
        # Classes inheriting from ActiveRecord and SuperModel are 
        # automatically compatible, but if you're using your own custom model
        # you need to make sure it responds to the following methods:
        #  * all                    - return all records
        #  * find(id)               - find record by id
        #  * after_create(method)   - after_create callback
        #  * after_update(method)   - after_update callback
        #  * after_destroy(method)  - after_destroy callback
        #
        # The klass' instance needs to respond to:
        #   * id      - returns record id
        #   * to_js   - return record's attribute hash
        #
        # You can override the to_js method on the model instance
        # in order to return specific attributes for the view.
        def bind(klass)
          @klass = klass
          observer = Observer.new(self)
          @klass.add_observer(observer)
        end
      end
    end
  end
end
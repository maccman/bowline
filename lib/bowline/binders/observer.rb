module Bowline
  module Binders
    class Observer
      attr_reader :binder
      def initialize(binder)
        @binder = binder
      end
      
      def after_create(rec)
        binder.created(rec)
      end
      
      def after_update(rec)
        binder.updated(rec)
      end
      
      def after_destroy(rec)
        binder.removed(rec)
      end
      
      def update(observed_method, object) #:nodoc:
        send(observed_method, object) if respond_to?(observed_method)
      end

      def observed_class_inherited(subclass) #:nodoc:
        subclass.add_observer(self)
      end
    end
  end
end
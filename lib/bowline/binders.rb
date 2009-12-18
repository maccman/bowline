module Bowline
  module Binders
    class Base
      extend Bowline::Watcher::Base
      extend Bowline::Desktop::Bridge::ClassMethods
      js_expose
      
      class << self
        def windows
          @windows ||= []
        end
        
        # Called by JS when first bound
        def setup(window)
          self.windows << window
          self.items = all
          true
        end
        
        def js_invoke(window, method, *args)
          if method == :setup
            setup(window)
          else
            send(method, *args)
          end
        end
                
        def instance_invoke(id, meth, *args) #:nodoc:
          self.new(id).send(meth, *args)
        end
        
        def find(id)
          klass.find(id)
        end

        def all
          klass.all
        end
        
        def items=(items) #:nodoc:
          bowline.populate(name, items.to_js).call
        end
        
        def created(item) #:nodoc:
          bowline.created(
            name, 
            item.id, 
            item.to_js
          ).call
        end
        
        def updated(item) #:nodoc:
          bowline.updated(
            name, 
            item.id, 
            item.to_js
          ).call
        end
        
        def removed(item) #:nodoc:
          bowline.removed(
            name, 
            item.id
          ).call
        end
        
        protected
          # Associate the binder with a model 
          # to setup callbacks so changes to the
          # model are automatically reflected in
          # the view. Usage:
          #   expose Post
          #
          # When the exposed class is created/updated/deleted
          # the binder's callbacks are executed and the view
          # updated accordingly.
          #  
          # klass needs to respond to:
          #  * all
          #  * find(id)
          #  * after_create(method)
          #  * after_update(method)
          #  * after_destroy(method)
          #
          # klass instance needs to respond to:
          #   * id
          #
          # You can override .to_js on the model instance
          # in order to return specific attributes for the view
          def expose(klass)
            @klass = klass
            @klass.after_create(method(:created))
            @klass.after_update(method(:updated))
            @klass.after_destroy(method(:removed))
          end
          
          # Returns class set by the 'expose' method
          def klass
            @klass || raise("klass not set - see expose method")
          end
          
          # JavaScript proxy to the page:
          #   page.myFunc(1,2,3).call
          def page
            Bowline::Desktop::Proxy.new(
              windows.length == 1 ? windows.first : windows
            )
          end
          
          # JavaScript proxy to the Bowline object:
          #   bowline.log("msg").call
          def bowline
            page.Bowline
          end
      
          # Javascript proxy to jQuery:
          #   jquery.getJSON("http://example.com")
          def jquery
            page.jQuery
          end
        
          # See Bowline::logger
          def logger
            Bowline::logger
          end
          
          # Trigger events on all elements
          # bound to this binder:
          #   trigger(:reload, {:key => :value})
          def trigger(event, data = nil)
            bowline.trigger(
              name,
              format_event(event), 
              data
            ).call
          end
          
          # Helper method to trigger a loading 
          # event either side of a block:
          #  loading {
          #   # Slow code, e.g. http call
          #  }
          def loading(&block)
            trigger(:loading, true)
            yield
            trigger(:loading, false)
          end
        
          def format_event(name) #:nodoc:
            name.is_a?(Array) ? 
              name.join('.') : 
                name.to_s
          end
      end
    
      attr_reader :element
      attr_reader :item
      
      # Instance of an element on the view.
      # 
      # item.destroy
      # element.highlight.call
      def initialize(id, *args) #:nodoc:
        @element = self.class.bowline.element(
                      self.class.name, id
                   )
        @item    = self.class.find(id)
      end
      
      protected
        # Trigger jQuery events on this element:
        #   trigger(:highlight)
        def trigger(event, data = nil)
          element.trigger(
            self.class.format_event(event), 
            data
          ).call
        end
        
        # Remove element from the view
        def remove!
          self.class.removed(item)
        end
    
        # Shortcut methods
    
        # See self.class.js
        def page
          self.class.page
        end
    
        # See self.class.jquery
        def jquery
          self.class.jquery
        end
      
        # See self.class.logger
        def logger
          self.class.logger
        end
    end
  end
end
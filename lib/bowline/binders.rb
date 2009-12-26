module Bowline
  module Binders
    # Binders are a central part of Bowline. They perform two main functions:
    #   1) Bind a model to the view, so any changes to the model get automatically
    #      reflected in the view.
    #   2) View abstraction of the model. You can define view specific class & instance
    #      methods, and easily call them from bound JavaScript objects.
    # 
    # To use a binder, you first need to bind it to a model using the bind method.
    # Example:
    #   class UsersBinder < Bowline::Binders::Base
    #     bind User
    #   end
    # 
    # Once a class is bound, any updates to the model automatically update any bound HTML.
    # The class names in the HTML are tied to the model's attribute names.
    # You can bind HTML using the bowline.js bindup function.
    # Example:
    #   <div id="users">
    #     <div class="item">
    #       <span class="name"></span>
    #     </div>
    #   </div>
    #   <script>
    #     $("#users").bindup('UsersBinder');
    #   </script>
    # 
    # =Class methods
    # 
    # You can define class methods on your binder, and call them using JavaScript
    # using the invoke function on the bound HTML element.
    # Example:
    #   <script>
    #     var users = $("#users").bindup('UsersBinder');
    #     users.invoke("method_name", "arg1", "arg2")
    #   </script>
    # 
    # =Instance methods
    # 
    # You can call your binders instance method from JavaScript by calling the invoke
    # function on the generated HTML elements. Your binder's instance methods have access
    # to an 'element' variable, which is the jQuery element, and a 'item' variable, which 
    # is the bound model's instance record.
    # 
    # Example:
    #   class UsersBinder < Bowline::Binders::Base
    #     bind User
    #     def charge!
    #       #...
    #     end
    #   end
    # 
    #   <script>
    #     $('#users').items(10).invoke('charge!');
    #   </script>
    #
    # For more documentation on Bowline's JavaScript API, see bowline.js
    class Base
      extend Bowline::Watcher::Base
      extend Bowline::Desktop::Bridge::ClassMethods
      js_expose
      
      class << self
        # An array of window currently bound.
        def windows
          @windows ||= []
        end
         
        def setup(window) #:nodoc:
          self.windows << window
          window.bowline.populate(
            name, initial.to_js
          ).call
          true
        end
        
        # Called by a window's JavaScript whenever that window is bound to this Binder.
        # This method populates the window's HTML with all bound class' records.
        # Override this if you don't want to send all the class' records to the window.
        # Example:
        #   def initial
        #     klass.all(:limit => 10)
        #   end
        def initial
          klass.all
        end
        
        def js_invoke(window, method, *args) #:nodoc:
          if method == :setup
            setup(window)
          else
            send(method, *args)
          end
        end
                
        def instance_invoke(id, meth, *args) #:nodoc:
          self.new(id).send(meth, *args)
        end
        
        # Calls .find on the klass sent to the bind method.
        # This is used internally, to find records when the page
        # invoke instance methods.
        def find(id)
          klass.find(id)
        end
        
        # Set the binder's items. This will replace all items, and update the HTML.
        def items=(items)
          bowline.populate(name, items.to_js).call
        end
        
        # Add a new item to the binder, updating the HTML.
        # This method is normally only called internally by 
        # the bound class's after_create callback.
        def created(item)
          bowline.created(
            name, 
            item.id, 
            item.to_js
          ).call
        end
        
        # Update an item on the binder, updating the HTML.
        # This method is normally only called internally by 
        # the bound class's after_update callback.
        def updated(item)
          bowline.updated(
            name, 
            item.id, 
            item.to_js
          ).call
        end
        
        # Remove an item from the binder, updating the HTML.
        # This method is normally only called internally by 
        # the bound class's after_destroy callback.
        def removed(item)
          bowline.removed(
            name, 
            item.id
          ).call
        end
        
        protected
          # Associate the binder with a model to setup callbacks so 
          # changes to the model are automatically reflected in the view.
          # Example:
          #   bind Post
          #
          # When the bound class is created/updated/deleted
          # the binder's callbacks are executed and the view
          # updated accordingly.
          # 
          # Classes inheriting fromActiveRecord and Bowline::LocalModel are 
          # automatically compatable, but if you're using your own custom model
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
            @klass.after_create(method(:created))
            @klass.after_update(method(:updated))
            @klass.after_destroy(method(:removed))
          end
          
          # Returns class set by the 'bind' method
          def klass
            @klass || raise("klass not set - see bind method")
          end
          
          # JavaScript proxy to the page. 
          # See Bowline::Desktop::Proxy for more information.
          # Example:
          #   page.myFunc(1,2,3).call
          def page
            Bowline::Desktop::Proxy.new(
              windows.length == 1 ? windows.first : windows
            )
          end
          
          # JavaScript proxy to the Bowline object.
          # See Bowline::Desktop::Proxy for more information.
          # Example:
          #   bowline.log("msg").call
          def bowline
            page.Bowline
          end
      
          # Javascript proxy to jQuery.
          # See Bowline::Desktop::Proxy for more information.
          # Example:
          #   jquery.getJSON("http://example.com").call
          def jquery
            page.jQuery
          end
        
          # See Bowline::logger
          def logger
            Bowline::logger
          end
          
          # Trigger events on all elements
          # bound to this binder.
          # Example:
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
      
      # jQuery element object
      attr_reader :element
      
      # Instance of the bound class' record
      attr_reader :item

      def initialize(id, *args) #:nodoc:
        @element = self.class.bowline.element(
                      self.class.name, id
                   )
        @item    = self.class.find(id)
      end
      
      protected
        # Trigger jQuery events on this element.
        # Example:
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
    
        # See self.class.page
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
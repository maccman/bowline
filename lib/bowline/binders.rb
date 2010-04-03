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
      
      module Async
        protected
        def async(*methods)
          if block_given?
            Thread.new(callback_proc) do |proc|
              begin
              self.callback_proc = proc
              yield
            rescue => e
              Bowline::Logging.log_error(e)
            end
            end
          else
            methods.each do |method|
              class_eval(<<-EOS, __FILE__, __LINE__)
                def #{method}_with_async(*args, &block)
                  async { #{method}_without_async(*args, &block) }
                end
              EOS
              alias_method_chain method, :async
            end
          end
        end
      end
      
      extend  Async
      include Async
      class << self; extend Async; end
      
      class << self        
        def callback_proc(proc = nil) #:nodoc:
          Thread.current[:callback] = proc if proc
          Thread.current[:callback]
        end
        alias_method :callback_proc=, :callback_proc
        
        def callback(result = nil)
          result = yield if block_given?
          callback_proc.call(result)
        end
        
        def js_invoke(window, callback, method, *args) #:nodoc:
          self.callback_proc = callback
          if method == :setup
            setup(window)
          else
            send(method, *args)
          end
        end
                
        def instance_invoke(id, method, *args) #:nodoc:
          self.new(id).send(method, *args)
        end
        
        # An array of window currently bound.
        def windows
          @windows ||= []
        end
        
        def setup(window) #:nodoc:
          self.windows << window
          self.windows.uniq!
          if initial_items = initial
            self.items = initial_items
          end
          callback(true)
        end
        
        # Called by a window's JavaScript whenever that window is bound to this Binder.
        # This method populates the window's HTML with all bound class' records.
        # Override this if you don't want to send all the class' records to the window.
        # Example:
        #   def initial
        #     klass.all(:limit => 10)
        #   end
        def initial
        end
        
        # Calls .find on the klass sent to the bind method.
        # This is used internally, to find records when the page
        # invoke instance methods.
        def find(id)
          klass.find(id)
        end
        
        # Set the binder's items. This will replace all items, and update the HTML.
        def items=(items)
          bowline.replace(name, items.to_js).call
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
        def destroyed(item)
          bowline.destroyed(
            name, 
            item.id
          ).call
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
      end
            
      # Instance of the bound class' record
      attr_reader :item

      def initialize(id, *args) #:nodoc:
        @item = self.class.find(id)
      end
      
      protected
        def callback_proc(*args) #:nodoc
          self.class.callback_proc(*args)
        end
        alias_method :callback_proc=, :callback_proc
      
        def callback(*args, &block)
          self.class.callback(*args, &block)
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
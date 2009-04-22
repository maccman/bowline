require 'logger'
require 'set'
require 'pathname'

module Bowline
  class << self
    # The Configuration instance used to configure the Bowline environment
    def configuration
      @@configuration
    end

    def configuration=(configuration)
      @@configuration = configuration
    end
    
    def initialized?
      @initialized || false
    end

    def initialized=(initialized)
      @initialized ||= initialized
    end

    def logger
      if defined?(BOWLINE_LOGGER)
        BOWLINE_LOGGER
      else
        nil
      end
    end
    
    def root
      Pathname.new(APP_ROOT) if defined?(APP_ROOT)
    end
  end
  
  class Initializer
    # The Configuration instance used by this Initializer instance.
    attr_reader :configuration
    
    # Runs the initializer. By default, this will invoke the #process method,
    # which simply executes all of the initialization routines. Alternately,
    # you can specify explicitly which initialization routine you want:
    #
    #   Bowline::Initializer.run(:set_load_path)
    #
    # This is useful if you only want the load path initialized, without
    # incurring the overhead of completely loading the entire environment.
    def self.run(command = :process, configuration = Configuration.new)
      yield configuration if block_given?
      initializer = new configuration
      initializer.send(command)
      initializer
    end
    
    # Create a new Initializer instance that references the given Configuration
    # instance.
    def initialize(configuration)
      @configuration = configuration
      @loaded_plugins = []
    end
    
    def require_frameworks
      configuration.frameworks.each { |framework| require(framework.to_s) }
    end
    
    def set_load_path
      load_paths = configuration.load_paths + configuration.framework_paths
      load_paths.reverse_each { |dir| $LOAD_PATH.unshift(dir) if File.directory?(dir) }
      $LOAD_PATH.uniq!
    end
    
    # Set the paths from which Bowline will automatically load source files, and
    # the load_once paths.
    def set_autoload_paths
      ActiveSupport::Dependencies.load_paths = configuration.load_paths.uniq
      ActiveSupport::Dependencies.load_once_paths = configuration.load_once_paths.uniq

      extra = ActiveSupport::Dependencies.load_once_paths - ActiveSupport::Dependencies.load_paths
      unless extra.empty?
        abort <<-end_error
          load_once_paths must be a subset of the load_paths.
          Extra items in load_once_paths: #{extra * ','}
        end_error
      end

      # Freeze the arrays so future modifications will fail rather than do nothing mysteriously
      configuration.load_once_paths.freeze
    end
    
    def add_plugin_load_paths
      Dir.glob(File.join(configuration.plugin_glob, 'lib')).sort.each do |path|
        $LOAD_PATH << path
        ActiveSupport::Dependencies.load_paths << path
        unless configuration.reload_plugins?
          ActiveSupport::Dependencies.load_once_paths << path
        end
      end
      $LOAD_PATH.uniq!
    end
    
    def initialize_database
      if defined?(ActiveRecord)
        ActiveRecord::Base.establish_connection(configuration.database_configuration)
      end
    end
    
    def initialize_logger
      # if the environment has explicitly defined a logger, use it
      return if Bowline.logger

      unless logger = configuration.logger
        begin
          logger = ActiveSupport::BufferedLogger.new(configuration.log_path)
          logger.level = ActiveSupport::BufferedLogger.const_get(configuration.log_level.to_s.upcase)
        rescue StandardError => e
          logger = ActiveSupport::BufferedLogger.new(STDERR)
          logger.level = ActiveSupport::BufferedLogger::WARN
          logger.warn(
            "Bowline Error: Unable to access log file. Please ensure that #{configuration.log_path} exists and is chmod 0666. " +
            "The log level has been raised to WARN and the output directed to STDERR until the problem is fixed."
          )
        end
      end

      silence_warnings { Object.const_set "BOWLINE_LOGGER", logger }
    end
    
    def initialize_framework_logging
      ActiveRecord::Base.logger ||= Bowline.logger if defined?(ActiveRecord)
      ActiveSupport::Dependencies.logger ||= Bowline.logger
    end
    
    # Loads support for "whiny nil" (noisy warnings when methods are invoked
    # on +nil+ values) if Configuration#whiny_nils is true.
    def initialize_whiny_nils
      require('active_support/whiny_nil') if configuration.whiny_nils
    end
    
    # Sets the default value for Time.zone, and turns on ActiveRecord::Base#time_zone_aware_attributes.
    # If assigned value cannot be matched to a TimeZone, an exception will be raised.
    def initialize_time_zone
      if configuration.time_zone
        zone_default = Time.__send__(:get_zone, configuration.time_zone)

        unless zone_default
          raise \
            'Value assigned to config.time_zone not recognized.' +
            'Run "rake -D time" for a list of tasks for finding appropriate time zone names.'
        end

        Time.zone_default = zone_default

        if defined?(ActiveRecord)
          ActiveRecord::Base.time_zone_aware_attributes = true
          ActiveRecord::Base.default_timezone = :utc
        end
      end
    end
    
    def initialize_framework_settings
      (configuration.frameworks - [:active_support]).each do |framework|
        base_class = framework.to_s.camelize.constantize.const_get("Base")
        settings = configuration.send(framework)
        next if !settings
        settings.each do |setting, value|
          base_class.send("#{setting}=", value)
        end
      end
      configuration.active_support.each do |setting, value|
        ActiveSupport.send("#{setting}=", value)
      end
    end
    
    def initialize_rubygems
      # todo - use custom rubygems on deployment
      # $LOAD_PATH << File.join(root, 'ruby', 'rubygems')
      # ::GEM_DIR = File.join(root, 'ruby', 'gems')
      # $LOAD_PATH << GEM_DIR
      # ENV['GEM_HOME'] = GEM_DIR
      # require 'rubygems'
      # Gem.use_paths(GEM_DIR, [GEM_DIR])
      # Gem.source_index.refresh!
    end
    
    def add_gem_load_paths
      unless configuration.gems.empty?
        configuration.gems.each { |gem| gem.add_load_paths }
      end
    end
    
    def load_gems
      configuration.gems.each { |gem| gem.load }
    end
    
    def load_plugins
      Dir.glob(File.join(configuration.plugin_glob, 'init.rb')).sort.each do |path|
        config = configuration # Need local config variable
        eval(IO.read(path), binding, path)
      end
    end
    
    def load_application_initializers
      Dir.glob(configuration.initializer_glob).sort.each do |initializer|
        load(initializer)
      end
    end
    
    def after_initialize
      configuration.after_initialize_blocks.each do |block|
        block.call
      end
    end
    
    def load_application_classes
      if configuration.cache_classes
        configuration.eager_load_paths.each do |load_path|
          matcher = /\A#{Regexp.escape(load_path)}(.*)\.rb\Z/
          Dir.glob("#{load_path}/**/*.rb").sort.each do |file|
            require_dependency file.sub(matcher, '\1')
          end
        end
      end
    end
    
    # For Ruby 1.8, this initialization sets $KCODE to 'u' to enable the
    # multibyte safe operations. Plugin authors supporting other encodings
    # should override this behaviour and set the relevant +default_charset+
    # on ActionController::Base.
    #
    # For Ruby 1.9, this does nothing. Specify the default encoding in the Ruby
    # shebang line if you don't want UTF-8.
    def initialize_encoding
      $KCODE='u' if RUBY_VERSION < '1.9'
    end
    
    def load_app_config
      app_config = configuration.app_config
      return unless app_config
      Object.const_set("AppConfig", Class.new {
        app_config.keys.each do |key|
          cattr_accessor key
          send("#{key}=", app_config[key])
        end
      })
    end
    
    def process
      Bowline.configuration = configuration
      
      set_load_path
      initialize_rubygems
      add_gem_load_paths
      
      require_frameworks
      set_autoload_paths
      add_plugin_load_paths
      
      initialize_encoding
      initialize_database
      
      initialize_logger
      initialize_framework_logging
      
      initialize_whiny_nils

      initialize_time_zone
      
      initialize_framework_settings
      
      load_app_config
      
      load_gems
      load_plugins
            
      load_application_initializers
      
      after_initialize
      
      load_application_classes
      
      Bowline.initialized = true
    end
    
  end
  
  # The Configuration class holds all the parameters for the Initializer and
   # ships with defaults that suites most Bowline applications. But it's possible
   # to overwrite everything. Usually, you'll create an Configuration file
   # implicitly through the block running on the Initializer, but it's also
   # possible to create the Configuration instance in advance and pass it in
   # like this:
   #
   #   config = Bowline::Configuration.new
   #   Bowline::Initializer.run(:process, config)
   class Configuration
     # The application's base directory.
     attr_reader :root_path
    
     # A stub for setting options on ActiveRecord::Base.
     attr_accessor :active_record

     # A stub for setting options on ActiveResource::Base.
     attr_accessor :active_resource

     # A stub for setting options on ActiveSupport.
     attr_accessor :active_support
     
     attr_accessor :bowline
     
     attr_accessor :frameworks
     
     attr_accessor :framework_paths

     # Whether or not classes should be cached (set to false if you want
     # application classes to be reloaded on each request)
     attr_accessor :cache_classes
     
     attr_accessor :binder_paths
     
     # The path to the database configuration file to use. (Defaults to
     # <tt>config/database.yml</tt>.)
     attr_accessor :database_configuration_file
     
     attr_accessor :app_config_file
     
     # An array of additional paths to prepend to the load path. By default,
     # all +app+, +lib+, +vendor+ and mock paths are included in this list.
     attr_accessor :load_paths

     # An array of paths from which Bowline will automatically load from only once.
     # All elements of this array must also be in +load_paths+.
     attr_accessor :load_once_paths
     
     # An array of paths from which Bowline will eager load on boot if cache
     # classes is enabled. All elements of this array must also be in
     # +load_paths+.
     attr_accessor :eager_load_paths
     
     # The log level to use for the default Bowline logger. 
     attr_accessor :log_level

     # The path to the log file to use. Defaults to log/#{environment}.log
     # (e.g. log/development.log or log/production.log).
     attr_accessor :log_path
     
     # The specific logger to use. By default, a logger will be created and
     # initialized using #log_path and #log_level, but a programmer may
     # specifically set the logger to use via this accessor and it will be
     # used directly.
     attr_accessor :logger
     
     # Set to +true+ if you want to be warned (noisily) when you try to invoke
     # any method of +nil+. Set to +false+ for the standard Ruby behavior.
     attr_accessor :whiny_nils
     
     attr_accessor :reload_plugins
     # Returns true if plugin reloading is enabled.
     def reload_plugins?
       !!@reload_plugins
     end

     # An array of gems that this Bowline application depends on.  Bowline will automatically load
     # these gems during installation, and allow you to install any missing gems with:
     #
     #   rake gems:install
     #
     # You can add gems with the #gem method.
     attr_accessor :gems
     
     # Adds a single Gem dependency to the Bowline application. By default, it will require
     # the library with the same name as the gem. Use :lib to specify a different name.
     #
     #   # gem 'aws-s3', '>= 0.4.0'
     #   # require 'aws/s3'
     #   config.gem 'aws-s3', :lib => 'aws/s3', :version => '>= 0.4.0', \
     #     :source => "http://code.whytheluckystiff.net"
     #
     # To require a library be installed, but not attempt to load it, pass :lib => false
     #
     #   config.gem 'qrp', :version => '0.4.1', :lib => false
     def gem(name, options = {})
       # todo
       @gems << Bowline::GemDependency.new(name, options)
     end
     
     # Sets the default +time_zone+.  Setting this will enable +time_zone+
     # awareness for Active Record models and set the Active Record default
     # timezone to <tt>:utc</tt>.
     attr_accessor :time_zone
     
     attr_accessor :plugin_glob
     
     attr_accessor :initializer_glob
     
     # Create a new Configuration instance, initialized with the default
     # values.
     def initialize
       set_root_path!
       
       self.frameworks                   = default_frameworks
       self.framework_paths              = default_framework_paths
       self.load_paths                   = default_load_paths
       self.load_once_paths              = default_load_once_paths
       self.eager_load_paths             = default_eager_load_paths
       self.log_path                     = default_log_path
       self.log_level                    = default_log_level
       self.binder_paths                 = default_binder_paths
       self.cache_classes                = default_cache_classes
       self.whiny_nils                   = default_whiny_nils
       self.database_configuration_file  = default_database_configuration_file
       self.app_config_file              = default_app_config_file
       self.gems                         = default_gems
       self.plugin_glob                  = default_plugin_glob
       self.initializer_glob             = default_initalizer_glob
       
       for framework in default_frameworks
         self.send("#{framework}=", Bowline::OrderedOptions.new)
       end
     end
     
     # Set the root_path to APP_ROOT and canonicalize it.
     def set_root_path!
       raise 'APP_ROOT is not set' unless defined?(::APP_ROOT)
       raise 'APP_ROOT is not a directory' unless File.directory?(::APP_ROOT)

       @root_path =
         # Pathname is incompatible with Windows, but Windows doesn't have
         # real symlinks so File.expand_path is safe.
         if RUBY_PLATFORM =~ /(:?mswin|mingw)/
           File.expand_path(::APP_ROOT)

         # Otherwise use Pathname#realpath which respects symlinks.
         else
           Pathname.new(::APP_ROOT).realpath.to_s
         end

       Object.const_set(:RELATIVE_APP_ROOT, ::APP_ROOT.dup) unless defined?(::RELATIVE_APP_ROOT)
       ::APP_ROOT.replace @root_path
     end
     
     def app_config
       require 'erb'
       YAML::load(ERB.new(IO.read(app_config_file)).result) if File.exists?(app_config_file)
     end
     
     # Loads and returns the contents of the #database_configuration_file. The
     # contents of the file are processed via ERB before being sent through
     # YAML::load.
     def database_configuration
       require 'erb'
       YAML::load(ERB.new(IO.read(database_configuration_file)).result) if File.exists?(database_configuration_file)
     end
     
     # Adds a block which will be executed after bowline has been fully initialized.
     # Useful for per-environment configuration which depends on the framework being
     # fully initialized.
     def after_initialize(&after_initialize_block)
       after_initialize_blocks << after_initialize_block if after_initialize_block
     end
     
     # Returns the blocks added with Configuration#after_initialize
     def after_initialize_blocks
       @after_initialize_blocks ||= []
     end
     
   private
   
     def default_frameworks
       [:active_support, :bowline]
     end
   
     def default_framework_paths
       [
         File.join(root_path, 'vendor', 'bowline', 'lib'),
         File.join(root_path, 'vendor', 'rails', 'activesupport',  'lib'),
         File.join(root_path, 'vendor', 'rails', 'activerecord',   'lib'),
         File.join(root_path, 'vendor', 'rails', 'activeresource', 'lib')
        ]
     end
     
     def default_load_paths
       paths = []

       # Followed by the standard includes.
       paths.concat %w(
         app
         app/binders
         app/models
         app/remote
         lib
         vendor
       ).map { |dir| "#{root_path}/#{dir}" }.select { |dir| File.directory?(dir) }

       paths
     end
     
     # Doesn't matter since plugins aren't in load_paths yet.
     def default_load_once_paths
       []
     end

     def default_eager_load_paths
       %w(
         app/models
         app/remote
         app/binders
       ).map { |dir| "#{root_path}/#{dir}" }.select { |dir| File.directory?(dir) }
     end
     
     def default_log_path
       File.join(root_path, 'log', "application.log")
     end
     
     def default_log_level
       :info
     end
     
     def default_database_configuration_file
       File.join(root_path, 'config', 'database.yml')
     end
     
     def default_app_config_file
       File.join(root_path, 'config', 'application.yml')
     end
     
     def default_binder_paths
       File.join(root_path, 'app', 'binders')
     end

     def default_cache_classes
       true
     end

     def default_whiny_nils
       false
     end
     
     def default_gems
       []
     end
     
     def default_plugin_glob
       File.join(root_path, *%w{ vendor plugins * })
     end
     
     def default_initalizer_glob
       File.join(root_path, *%w{ config initializers **/*.rb })
     end
  end
end

# Needs to be duplicated from Active Support since its needed before Active
# Support is available. Here both Options and Hash are namespaced to prevent
# conflicts with other implementations AND with the classes residing in Active Support.
class Bowline::OrderedOptions < Array #:nodoc:
  def []=(key, value)
    key = key.to_sym

    if pair = find_pair(key)
      pair.pop
      pair << value
    else
      self << [key, value]
    end
  end

  def [](key)
    pair = find_pair(key.to_sym)
    pair ? pair.last : nil
  end

  def method_missing(name, *args)
    if name.to_s =~ /(.*)=$/
      self[$1.to_sym] = args.first
    else
      self[name]
    end
  end

  private
    def find_pair(key)
      self.each { |i| return i if i.first == key }
      return false
    end
end
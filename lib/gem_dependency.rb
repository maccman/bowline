module Bowline
  class GemDependency
    attr_accessor :lib, :source
    
    def initialize(name, options = {})
      require 'rubygems' unless Object.const_defined?(:Gem)

      if options[:requirement]
        req = options[:requirement]
      elsif options[:version]
        req = Gem::Requirement.create(options[:version])
      else
        req = Gem::Requirement.default
      end

      @dep = Gem::Dependency.new(name, req)
      @lib      = options[:lib]
      @source   = options[:source]
    end
    
    def add_load_paths
    end
    
    def name
      @dep.name.to_s
    end
    
    def requirement
      r = @dep.version_requirements
      (r == Gem::Requirement.default) ? nil : r
    end
    
    def load
      return if @loaded
      require(@lib || name) unless @lib == false
      @loaded = true
    rescue LoadError
      puts $!.to_s
      $!.backtrace.each { |b| puts b }
    end
  end
end
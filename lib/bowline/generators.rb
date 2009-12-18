gem 'templater', '>= 0.3.2'
require 'templater'

module Bowline
  module Generators
    extend Templater::Manifold
    
    desc <<-DESC
      Generate components for your application or entirely new applications.
    DESC
    class Generator < Templater::Generator
      def with_modules(modules, options={}, &block)
        indent = options[:indent] || 0
        text = capture(&block)
        modules.each_with_index do |mod, i|
          concat(("  " * (indent + i)) + "module #{mod}\n", block.binding)
        end
        text = text.to_a.map{ |line| ("  " * modules.size) + line }.join
        concat(text, block.binding)
        modules.reverse.each_with_index do |mod, i|
          concat(("  " * (indent + modules.size - i - 1)) + "end # #{mod}\n", block.binding)
        end
      end
      
      def self.source_root
        File.join(File.dirname(__FILE__), *%w[.. .. templates])
      end
    end
    
    class NamedGenerator < Generator
      # NOTE: Currently this is not inherited, it will have to be 
      # declared in each generator that inherits from this.
      first_argument :name, :required => true
      
      def initialize(*args)
        super
      end
      
      def class_name
        name.gsub('-', '_').camel_case
      end
      alias_method :module_name, :class_name

      def file_name
        name.snake_case
      end
      alias_method :base_name, :file_name

      def symbol_name
        file_name.gsub('-', '_')
      end
    end
  end
end

require "bowline/generators/application"
require "bowline/generators/binder"
require "bowline/generators/helper"
require "bowline/generators/migration"
require "bowline/generators/model"
require "bowline/generators/window"
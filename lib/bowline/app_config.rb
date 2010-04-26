require 'supermodel'

module Bowline
  class AppConfig < SuperModel::Base
    include SuperModel::Marshal::Model
    
    class << self
      def instance
        @instance ||= create
      end
      
      def marshal_records=(record)
        self.instance.load(record.attributes) if record
        self.instance
      end
      
      def marshal_records
        self.instance
      end
      
      def load!(path)
        self.instance.load_path(path)
        self.instance
      end
      
      def reset!
        @instance = nil
      end
      alias_method :destroy_all, :reset!
      alias_method :delete_all,  :reset!
    end
    
    def load_path(path)
      return unless path && File.exist?(path)
      load(YAML::load(File.read(path)))
    end
  end
end
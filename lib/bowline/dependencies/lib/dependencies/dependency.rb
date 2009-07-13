class Dependencies::Dependency
  attr_accessor :name, :versions, :options
  
  def initialize(name, *options)
    opts = options.last.is_a?(Hash) ? options.pop : {}
    vers = options

    @name     = name
    @versions = vers
    @options  = opts
  end
end
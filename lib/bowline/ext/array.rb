class Array
  def to_js(*args)
    map {|i| i.to_js(*args) }
  end
end
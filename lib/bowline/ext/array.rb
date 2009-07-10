class Array
  def to_js(opts = {})
    map {|i| i.to_js(opts) }
  end
end
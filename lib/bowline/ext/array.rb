class Array
  def to_js(opts = {})
    collect {|i| i.to_js(opts) }
  end
end
class Array
  def to_js
    map {|i| i.to_js }
  end
end
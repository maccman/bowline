class Object
  # Aim is to convert the object in:
  #  * A hash or
  #  * An array of hashes
  def to_js(opts = {})
    if respond_to?(:attributes)
      attributes
    else
      self
    end
  end
end
class Object
  # Aim is to convert the object into:
  #  * A hash or
  #  * An array of hashes
  def to_js
    if respond_to?(:attributes)
      attributes
    else
      self
    end
  end
end
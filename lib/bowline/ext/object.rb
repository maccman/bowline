class Object
  # Aim is to convert the object into:
  #  * A hash or
  #  * An array of hashes
  def to_js(*args)
    if respond_to?(:serializable_hash)
      serializable_hash(*args)
    elsif respond_to?(:attributes)
      attributes
    else
      self
    end
  end
end
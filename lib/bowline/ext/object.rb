class Object
  # Aim is to convert the object in:
  #  * A hash or
  #  * An array of hashes
  def to_js(opts = {})
    if respond_to?(:to_js)
      to_js
    elsif respond_to?(:attributes)
      attributes
    else
      ob
    end
  end
end
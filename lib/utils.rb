module Bowline
  module Utils
    # From Activesupport
    def underscore(camel_cased_word)
     camel_cased_word.to_s.gsub(/::/, '/').
       gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2').
       gsub(/([a-z\d])([A-Z])/,'\1_\2').
       tr("-", "_").
       downcase
    end
    
    def to_js(ob)
      if ob.respond_to?(:to_js)
        ob.to_js
      elsif ob.respond_to?(:attributes)
        ob.attributes
      else
        ob
      end
    end
  end
end
    
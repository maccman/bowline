Window.alert(__FILE__.to_s)
Window.alert(File.dirname(__FILE__))

$: << File.join(File.dirname(__FILE__), *%w[.. .. Resources])


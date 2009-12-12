# naive platform detection for Ruby
# Based on code by Matt Mower <self@mattmower.com>
# http://matt.blogs.it/gems/ruby/platform.rb

module Bowline
  module Platform
    if RUBY_PLATFORM =~ /darwin/i
       OS = :unix
       IMPL = :macosx
    elsif RUBY_PLATFORM =~ /linux/i
       OS = :unix
       IMPL = :linux
    elsif RUBY_PLATFORM =~ /freebsd/i
       OS = :unix
       IMPL = :freebsd
    elsif RUBY_PLATFORM =~ /netbsd/i
       OS = :unix
       IMPL = :netbsd
    elsif RUBY_PLATFORM =~ /mswin/i
       OS = :win32
       IMPL = :mswin
    elsif RUBY_PLATFORM =~ /cygwin/i
       OS = :unix
       IMPL = :cygwin
    elsif RUBY_PLATFORM =~ /mingw/i
       OS = :win32
       IMPL = :mingw
    elsif RUBY_PLATFORM =~ /bccwin/i
       OS = :win32
       IMPL = :bccwin
    else
       OS = :unknown
       IMPL = :unknown
    end

    if RUBY_PLATFORM =~ /(i\d86)/i
       ARCH = :x86
    elsif RUBY_PLATFORM =~ /ia64/i
       ARCH = :ia64
    elsif RUBY_PLATFORM =~ /powerpc/i
       ARCH = :powerpc
    elsif RUBY_PLATFORM =~ /alpha/i
       ARCH = :alpha
    else
       ARCH = :unknown
    end
    
    def osx?
      IMPL == :macosx
    end
    module_function :osx?
    
    def linux?
      IMPL == :linux
    end
    module_function :linux?
    
    def win32?
      OS == :win32
    end
    module_function :win32?
    
    def type
      return :osx   if osx?
      return :linux if linux?
      return :win32 if win32?
      raise "Unknown platform"
    end
    module_function :type
  end
end
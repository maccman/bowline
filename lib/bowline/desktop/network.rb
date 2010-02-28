require "socket"
require "timeout"

module Bowline
  module Desktop
    module Network
      extend Bowline::Watcher::Base
      watch :on_online, :on_offline, :on_change
      
      def online!
        return if @online
        @online = true
        watcher.call(:on_online)
        watcher.call(:on_change)
      end
      
      def offline!
        return if @online == false
        @online = false
        watcher.call(:on_offline)
        watcher.call(:on_change)
      end
      
      def online?
        @online
      end
      
      def host
        @host ||= "google.com"
      end
      
      def host=(host)
        @host = host
      end
      
      def port
        @port ||= 80
      end
      
      def port=(port)
        @port = port
      end
      
      def poll!
        Thread.new do
          loop do
            ping ? online! : offline!
            sleep 30
          end
        end
      end
            
      private
            
        def ping
          Timeout::timeout(3) {
            TCPSocket.new(host, port).close
          }
          true
        rescue Errno::ECONNREFUSED, Timeout::Error, StandardError
          false
        end
      
      extend self
    end
  end
end
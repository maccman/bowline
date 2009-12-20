require 'fileutils'
require 'tempfile'
require 'net/http'
require 'progressbar'
require 'zip/zip'

def download(url)
  name = url.split("/").last
  file = Tempfile.new("download_#{name}")
  url  = URI.parse(url)
  req  = Net::HTTP::Get.new(url.path)
  res  = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req) {|resp|
      pbar = ProgressBar.new("Downloading: #{name}", resp.content_length)
      resp.read_body {|seg|
        pbar.inc(seg.length)
        file.write(seg)
      }
    }
  }
  file.rewind
  file
end

namespace :libs do
  task :download => :environment do
    FileUtils.mkdir_p(Bowline::Library.path)
    
    desktop_path = Bowline::Library.desktop_path
    unless File.exist?(desktop_path)
      desktop_tmp = download(Bowline::Library::DESKTOP_URL)
      desktop_tmp.close
      FileUtils.mv(desktop_tmp.path, desktop_path)
      FileUtils.chmod(0755, desktop_path)
    end
    
    rubylib_path = Bowline::Library.rubylib_path
    unless File.directory?(rubylib_path)
      rubylib_tmp = download(Bowline::Library::RUBYLIB_URL)
      rubylib_tmp.close
      Zip::ZipFile.open(rubylib_tmp.path) { |zfile|
        zfile.each {|file|
          file_path = File.join(rubylib_path, file.name)
          FileUtils.mkdir_p(File.dirname(file_path))
          zfile.extract(file, file_path)
        }
      }
    end
  end
end
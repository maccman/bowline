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
      pbar = ProgressBar.new("Downloading...", resp.content_length)
      resp.read_body {|seg|
        pbar.inc(seg.length)
        file.write(seg)
      }
      pbar.finish
    }
  }
  file.rewind
  file
end

def unzip(fpath, tpath)
  Zip::ZipFile.open(fpath) { |zfile|
    zfile.each {|file|
      file_path = File.join(tpath, file.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zfile.extract(file, file_path)
    }
  }
end

namespace :libs do
  # Lots of people are using Ruby 1.8 with Bowline.
  # When bowline-desktop loads, it doesn't know where the
  # Bowline gem is if it's an 1.8 gem dir. So, we just symlink
  # it to vendor/bowline. One caveat though, is that you have to
  # re-run this task when you update the gem.
  task :unpack => :environment do
    local_path = Bowline::Library.bowline_path
    unless File.directory?(local_path)
      begin
        FileUtils.ln_s(
          Bowline.lib_path, 
          local_path
        )
      rescue NotImplementedError
        FileUtils.cp_r(
          Bowline.lib_path,
          local_path
        )
      end
    end
  end
  
  desc "Download Bowline's binary and pre-compiled libs"
  task :download => :environment do
    FileUtils.mkdir_p(Bowline::Library.path)
    desktop_path = Bowline::Library.desktop_path
    rubylib_path = Bowline::Library.rubylib_path
    
    unless File.exist?(desktop_path)
      desktop_tmp = download(Bowline::Library::DESKTOP_URL)
      desktop_tmp.close
      FileUtils.mv(desktop_tmp.path, desktop_path)
      FileUtils.chmod(0755, desktop_path)
    end
    
    unless File.directory?(rubylib_path)
      rubylib_tmp = download(Bowline::Library::RUBYLIB_URL)
      rubylib_tmp.close
      puts "Extracting..."
      unzip(rubylib_tmp.path, Bowline::Library.path)
    end
  end
    
  task :setup => [:environment, "gems:sync", "libs:unpack", "lib:download"]
  
  desc "Update Bowline's binary and pre-compiled libs"
  task :update => :environment do
    FileUtils.rm_rf(Bowline::Library.path)
    FileUtils.rm_rf(Bowline::Library.bowline_path)
    Rake::Task["libs:setup"].invoke
  end
end
require 'fileutils'
require 'tempfile'
require 'net/http'
require 'progressbar'
require 'zip/zip'

def download(url)
  puts "Retrieving #{url}"
  name = url.split("/").last
  file = Tempfile.new("download_#{name}")
  url  = URI.parse(url)
  req  = Net::HTTP::Get.new(url.path)
  res  = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req) {|resp|
      pbar = ProgressBar.new("", resp.content_length || 0)
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

def sym_or_copy(from, to)
  begin
    FileUtils.ln_s(from, to)
  rescue NotImplementedError
    FileUtils.cp_r(from, to)
  end
end

namespace :libs do  
  desc "Download Bowline's binary and pre-compiled libs"
  task :download => :environment do
    FileUtils.mkdir_p(Bowline::Library.path)
    desktop_path = Bowline::Library.desktop_path
    libs_path    = Bowline::Library.libs_path
    
    unless File.exist?(desktop_path)
      desktop_tmp = download(Bowline::Library::DESKTOP_URL)
      desktop_tmp.close
      puts "Extracting bowline-desktop.zip"
      unzip(desktop_tmp.path, Bowline::Library.path)
      FileUtils.chmod(0755, desktop_path)
    end
    
    unless File.directory?(libs_path)
      libs_tmp = download(Bowline::Library::LIBS_URL)
      libs_tmp.close
      puts "Extracting libs.zip"
      unzip(libs_tmp.path, Bowline::Library.path)
    end
  end
    
  task :setup => [:environment, "libs:download"]
  
  desc "Update Bowline's binary and pre-compiled libs"
  task :update => :environment do
    FileUtils.rm_rf(Bowline::Library.path)
    Rake::Task["libs:setup"].invoke
  end
end
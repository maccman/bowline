class Dependencies::Repository

  def initialize(base)
    @paths = {
      :gems  => File.join(base),
      :bin   => File.join(base, 'bin'),
      :specs => File.join(base, 'specifications')
    }
  end

  def index
    @index ||= reload_index!
  end

  def reload_index!
    @index = ::Gem::SourceIndex.new.load_gems_in(@paths[:specs])
  end

  def gem(name, versions=[])
    ::Gem::Dependency.new(name, versions)
  end

  def search(gem)
    index.search(gem)
  end

  def install(gem)
    reload_index!
    return if index.search(gem).last
    
    installer = ::Gem::DependencyInstaller.new(
      :bin_dir => @paths[:bin],
      :install_dir => @paths[:gems],
      :user_install => false)

    begin
      installer.install gem.name, gem.version_requirements
    rescue ::Gem::GemNotFoundException => e
      puts "Cannot find #{gem.name} #{gem.version_requirements}"
    rescue ::Gem::RemoteFetcher::FetchError => e
      puts "Problem with fetch, retrying..."
      retry
    end
  end

  def uninstall(name, version)
    uninstaller = ::Gem::Uninstaller.new(name,
      :version => version,
      :bin_dir => @paths[:bin],
      :install_dir => @paths[:gems],
      :ignore => true,
      :executables => true
    )
    uninstaller.uninstall
  end
  
  def installed
    Dir[File.join(@paths[:gems], 'gems', '*')].map! { |n| File.basename(n) }
  end

  def gems
  end

end

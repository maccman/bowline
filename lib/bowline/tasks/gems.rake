namespace :gems do
  desc "Install gems locally"
  task :sync => [:environment] do
    conf = Bowline.configuration
    repo = Dependencies::Repository.new(
      conf.gem_path
    )

    conf.gems.each do |dep|
      gem = repo.gem(dep.name, dep.versions)
      next unless repo.search(gem).empty?
      repo.install(gem)
    end

    repo.reload_index!

    full_list = conf.gems.map do |dep|
      gem = repo.gem(dep.name, dep.versions)
      spec = repo.index.search(gem).last
      unless spec
        raise Exception.new("A required dependency #{gem} was not found")
      end
      deps = spec.recursive_dependencies(gem, repo.index)
      [spec] + deps
    end.flatten.uniq.map do |spec|
      "#{spec.name}-#{spec.version}"
    end

    (repo.installed - full_list).each do |g|
      /^(.*)\-(.*)$/ =~ g
      repo.uninstall($1, $2)
    end
  end
end
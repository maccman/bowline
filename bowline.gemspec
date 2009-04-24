# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{bowline}
  s.version = "0.1.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Alex MacCaw"]
  s.date = %q{2009-04-24}
  s.default_executable = %q{bowline-gen}
  s.description = %q{My take on Ruby desktop GUIs}
  s.email = ["info@eribium.org"]
  s.executables = ["bowline-gen"]
  s.extra_rdoc_files = ["History.txt", "Manifest.txt", "README.txt"]
  s.files = [".gitignore", "History.txt", "MIT-LICENSE", "Manifest.txt", "README.txt", "Rakefile", "assets/jquery.bowline.js", "assets/jquery.chain.js", "assets/jquery.js", "bin/bowline-gen", "bowline.gemspec", "examples/account_binder.rb", "examples/example.js", "examples/twitter.html", "examples/twitter_binder.rb", "examples/twitter_login.html", "examples/users_binder.rb", "lib/bowline.rb", "lib/bowline/binders.rb", "lib/bowline/binders/collection.rb", "lib/bowline/binders/singleton.rb", "lib/bowline/commands/console.rb", "lib/bowline/commands/generate.rb", "lib/bowline/commands/run.rb", "lib/bowline/ext/array.rb", "lib/bowline/ext/class.rb", "lib/bowline/ext/object.rb", "lib/bowline/ext/string.rb", "lib/bowline/gem_dependency.rb", "lib/bowline/generators.rb", "lib/bowline/generators/application.rb", "lib/bowline/generators/binder.rb", "lib/bowline/generators/migration.rb", "lib/bowline/generators/model.rb", "lib/bowline/initializer.rb", "lib/bowline/jquery.rb", "lib/bowline/observer.rb", "lib/bowline/tasks/app.rake", "lib/bowline/tasks/bowline.rb", "lib/bowline/tasks/database.rake", "lib/bowline/tasks/log.rake", "lib/bowline/tasks/misk.rake", "templates/Rakefile", "templates/binder.rb", "templates/config/application.yml", "templates/config/boot.rb", "templates/config/database.yml", "templates/config/environment.rb", "templates/config/manifest", "templates/config/tiapp.xml", "templates/gitignore", "templates/migration.rb", "templates/model.rb", "templates/public/index.html", "templates/public/javascripts/application.js", "templates/public/stylesheets/application.css", "templates/script/console", "templates/script/init", "templates/script/run"]
  s.has_rdoc = true
  s.homepage = %q{http://github.com/maccman/bowline}
  s.rdoc_options = ["--main", "README.txt"]
  s.require_paths = ["lib"]
  s.rubyforge_project = %q{maccman}
  s.rubygems_version = %q{1.3.2}
  s.summary = %q{My take on Ruby desktop GUIs}

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::RubyGemsVersion) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<templater>, [">= 0.3.2"])
      s.add_runtime_dependency(%q<activesupport>, [">= 2.3.2"])
      s.add_development_dependency(%q<newgem>, [">= 1.3.0"])
      s.add_development_dependency(%q<hoe>, [">= 1.8.0"])
    else
      s.add_dependency(%q<templater>, [">= 0.3.2"])
      s.add_dependency(%q<activesupport>, [">= 2.3.2"])
      s.add_dependency(%q<newgem>, [">= 1.3.0"])
      s.add_dependency(%q<hoe>, [">= 1.8.0"])
    end
  else
    s.add_dependency(%q<templater>, [">= 0.3.2"])
    s.add_dependency(%q<activesupport>, [">= 2.3.2"])
    s.add_dependency(%q<newgem>, [">= 1.3.0"])
    s.add_dependency(%q<hoe>, [">= 1.8.0"])
  end
end

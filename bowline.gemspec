# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{bowline}
  s.version = "0.3.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Alex MacCaw"]
  s.date = %q{2009-07-13}
  s.default_executable = %q{bowline-gen}
  s.description = %q{Ruby/JS GUI framework}
  s.email = %q{alex@leadthinking.com}
  s.executables = ["bowline-gen"]
  s.extra_rdoc_files = [
    "README.txt"
  ]
  s.files = [
    ".gitignore",
     "History.txt",
     "MIT-LICENSE",
     "README.txt",
     "Rakefile",
     "VERSION",
     "assets/jquery.bowline.js",
     "assets/jquery.chain.js",
     "assets/jquery.js",
     "bin/bowline-gen",
     "bowline.gemspec",
     "examples/account.rb",
     "examples/example.js",
     "examples/tweets.rb",
     "examples/twitter.html",
     "examples/users.rb",
     "lib/bowline.rb",
     "lib/bowline/async.rb",
     "lib/bowline/binders.rb",
     "lib/bowline/binders/collection.rb",
     "lib/bowline/binders/singleton.rb",
     "lib/bowline/commands/console.rb",
     "lib/bowline/commands/generate.rb",
     "lib/bowline/commands/run.rb",
     "lib/bowline/dependencies/FAQ.markdown",
     "lib/bowline/dependencies/MIT-LICENSE",
     "lib/bowline/dependencies/README.markdown",
     "lib/bowline/dependencies/Rakefile",
     "lib/bowline/dependencies/TODO.markdown",
     "lib/bowline/dependencies/init.rb",
     "lib/bowline/dependencies/lib/dependencies.rb",
     "lib/bowline/dependencies/lib/dependencies/dependency.rb",
     "lib/bowline/dependencies/lib/dependencies/reader.rb",
     "lib/bowline/dependencies/lib/dependencies/repository.rb",
     "lib/bowline/dependencies/lib/ext/common.rb",
     "lib/bowline/dependencies/lib/ext/rubygems.rb",
     "lib/bowline/dependencies/lib/template/app_script.rb",
     "lib/bowline/dependencies/spec/spec.opts",
     "lib/bowline/dependencies/tasks/dependencies.rake",
     "lib/bowline/ext/array.rb",
     "lib/bowline/ext/class.rb",
     "lib/bowline/ext/object.rb",
     "lib/bowline/ext/string.rb",
     "lib/bowline/generators.rb",
     "lib/bowline/generators/application.rb",
     "lib/bowline/generators/binder.rb",
     "lib/bowline/generators/helper.rb",
     "lib/bowline/generators/migration.rb",
     "lib/bowline/generators/model.rb",
     "lib/bowline/helpers.rb",
     "lib/bowline/initializer.rb",
     "lib/bowline/jquery.rb",
     "lib/bowline/observer.rb",
     "lib/bowline/tasks/app.rake",
     "lib/bowline/tasks/bowline.rb",
     "lib/bowline/tasks/database.rake",
     "lib/bowline/tasks/gems.rake",
     "lib/bowline/tasks/log.rake",
     "lib/bowline/tasks/misc.rake",
     "lib/bowline/version.rb",
     "lib/bowline/window.rb",
     "templates/Rakefile",
     "templates/binder.rb",
     "templates/config/application.yml",
     "templates/config/boot.rb",
     "templates/config/database.yml",
     "templates/config/environment.rb",
     "templates/config/manifest",
     "templates/config/tiapp.xml",
     "templates/gitignore",
     "templates/helper.rb",
     "templates/migration.rb",
     "templates/model.rb",
     "templates/public/icon.png",
     "templates/public/index.html",
     "templates/public/javascripts/application.js",
     "templates/public/stylesheets/application.css",
     "templates/script/console",
     "templates/script/init",
     "templates/script/run"
  ]
  s.homepage = %q{http://github.com/maccman/bowline}
  s.rdoc_options = ["--charset=UTF-8"]
  s.require_paths = ["lib"]
  s.rubygems_version = %q{1.3.4}
  s.summary = %q{Bowline GUI framework}
  s.test_files = [
    "examples/account.rb",
     "examples/tweets.rb",
     "examples/users.rb"
  ]

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::RubyGemsVersion) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<templater>, [">= 0.3.2"])
      s.add_runtime_dependency(%q<activesupport>, [">= 2.3.2"])
    else
      s.add_dependency(%q<templater>, [">= 0.3.2"])
      s.add_dependency(%q<activesupport>, [">= 2.3.2"])
    end
  else
    s.add_dependency(%q<templater>, [">= 0.3.2"])
    s.add_dependency(%q<activesupport>, [">= 2.3.2"])
  end
end

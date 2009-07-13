Dependencies
============

A port of Merb's dependency system to a Rails plugin.

Usage
=====

1. Install the plugin

        script/plugin install git://github.com/ddollar/dependencies.git

2. Add the following line to your config/environment.rb

        config.plugins = [:dependencies, :all]

3. Add the following line to your .gitignore

        gems

4. Create a config/dependencies.rb file that looks like:

        dependency 'gem'
        dependency 'gem', '1.0.1'
        dependency 'gem', :require_as => 'Gem'
        dependency 'gem', :only => %w(test staging)
        dependency 'gem', :except => 'production'

        with_options(:only => 'test') do |test|
          test.dependency 'tester-gem'
        end

5. Remove or comment out any config.gem lines from config/environment.rb or config/environments/*.rb

6. Install the gems into your project and keep them up to date using:

        rake dependencies:sync

7. Alternatively you can use the following rake task to read your existing config.gem declarations and output a file suitable for this plugin. This task will appropriately handle any gems that you are currently loading on a per-environment basis as well.

        rake dependencies:import


About
=====

Initial idea and Rubygems extension code from [Merb](http://merbivore.com/)

Rewritten for Rails by [David Dollar](http://daviddollar.org) ([@ddollar](http://twitter.com/ddollar))

Documentation, testing, ideas by Steven Soroka ([@ssoroka](http://twitter.com/ssoroka))

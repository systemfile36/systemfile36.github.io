# frozen_string_literal: true

source "https://rubygems.org"

gemspec

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
#gem 'tzinfo'
#gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]


group :test do
  gem "html-proofer", "~> 5.0"
  gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]
  gem 'wdm', '>= 0.1.0'
  gem 'jekyll-compose', group: [:jekyll_plugins]
  gem 'base64'
  gem 'jekyll', '~> 4.3.3'
  gem 'csv'
end

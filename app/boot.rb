require "bundler/setup"
Bundler.require

Dir.glob(File.dirname(__FILE__) + '/../config/*.rb') { |f| require f }
require File.dirname(__FILE__) + '/controllers/base_controller.rb'
Dir.glob(File.dirname(__FILE__) + '/**/**/*.rb') { |f| require f }


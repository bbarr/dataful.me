class BaseController < Sinatra::Base

  enable :sessions
  set :session_secret, 'super secret'
  set :root, File.dirname(__FILE__) + '/../..'
  set :views, Proc.new { root + '/app/views' }

  use Rack::Parser
  use Warden::Manager do |manager|
    manager.default_strategies :password
    manager.failure_app = MainController
  end

  before do
    content_type :json
  end

  def self.requires_user
    before do
      env['warden'].authenticate!
    end
  end

  def current_user
    @current_user ||= env['warden'].user
  end

  def ok results={}
    status 200
    halt results.to_json
  end
  
  def created resource
    status 201
    halt resource.to_json
  end
  
  def errored resource={}
    status 500
    if resource.is_a? Hash
      halt resource.to_json
    else
      halt (resource.try(:errors) || resource).to_json
    end
  end
  
  def missing
    halt 404
  end

end

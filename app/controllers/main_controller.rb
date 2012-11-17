class MainController < BaseController

  get "/" do
    content_type :html
    file_name = current_user ? 'dashboard' : 'index'
    File.read(settings.public_folder + "/#{file_name}.html")
  end

  post "/unauthenticated" do
    errored env['warden'].errors.to_hash
  end
end
